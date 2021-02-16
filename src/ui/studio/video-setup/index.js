//; -*- mode: rjsx;-*-
/** @jsx jsx */
import { jsx } from 'theme-ui';

import { faChalkboard, faChalkboardTeacher, faUser } from '@fortawesome/free-solid-svg-icons';
import { Flex, Heading, Text } from '@theme-ui/components';

import { Styled } from 'theme-ui';
import { Select } from 'theme-ui'

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { Fragment, useEffect, useState } from 'react';
import { OptionChoose }  from './option_choose';
import { frameRateWindows } from './prefs';


import {
  useDispatch,
  useStudioState,
  VIDEO_SOURCE_BOTH,
  VIDEO_SOURCE_DISPLAY,
  VIDEO_SOURCE_USER,
  VIDEO_SOURCE_NONE,
} from '../../../studio-state';
import { useSettings } from '../../../settings';

import { queryMediaDevices, onMobileDevice } from '../../../util';
import Notification from '../../notification';

import {
  startDisplayCapture,
  startUserCapture,
  stopDisplayCapture,
  stopUserCapture
} from '../capturer';
import { ActionButtons, StepContainer } from '../elements';
import { SourcePreview } from './preview';
import { loadCameraPrefs, loadDisplayPrefs, prefsToConstraints } from './prefs';
import { render } from '@testing-library/react';


export default function VideoSetup({ nextStep, userHasWebcam }) {




  const { t } = useTranslation();

  const dispatch = useDispatch();
  const state = useStudioState();
  const { displayStream, userStream, videoChoice: activeSource } = state;
  const hasStreams = displayStream || userStream;

  const setActiveSource = s => dispatch({ type: 'CHOOSE_VIDEO', payload: s });
  const reselectSource = () => {
    setActiveSource(VIDEO_SOURCE_NONE);
    stopUserCapture(userStream, dispatch);
    stopDisplayCapture(displayStream, dispatch);
  };

  const nextDisabled = activeSource === VIDEO_SOURCE_NONE
    || activeSource === VIDEO_SOURCE_BOTH ? (!displayStream || !userStream) : !hasStreams;

  // The warnings if we are not allowed to capture a stream.
  const userWarning = (state.userAllowed === false) && (
    <Notification key="user-stream-warning" isDanger>
      <Heading as="h3" mb={2}>
        {t('source-user-not-allowed-title')}
      </Heading>
      <Text>{t('source-user-not-allowed-text')}</Text>
    </Notification>
  );
  const displayWarning = (state.displayAllowed === false) && (
    <Notification key="display-stream-warning" isDanger>
      <Heading as="h3" mb={2}>
        {t('source-display-not-allowed-title')}
      </Heading>
      <Text>{t('source-display-not-allowed-text')}</Text>
    </Notification>
  );
  const unexpectedEndWarning = (state.userUnexpectedEnd || state.displayUnexpectedEnd) && (
    <Notification key="unexpexted-stream-end-warning" isDanger>
      <Text>{t('error-lost-video-stream')}</Text>
    </Notification>
  );

  const userInput = {
    isDesktop: false,
    stream: userStream,
    allowed: state.userAllowed,
    unexpectedEnd: state.userUnexpectedEnd,
  };
  const displayInput = {
    isDesktop: true,
    stream: displayStream,
    allowed: state.displayAllowed,
    unexpectedEnd: state.displayUnexpectedEnd,
  };

  // The body depends on which source is currently selected.
  let hideActionButtons;
  let title;
  let body;
  switch (activeSource) {
    case VIDEO_SOURCE_NONE:
      const userConstraints = prefsToConstraints(loadCameraPrefs());
      const displayConstraints = prefsToConstraints(loadDisplayPrefs());
      title = t('sources-video-question');
      hideActionButtons = true;
      body = <SourceSelection {...{
        setActiveSource,
        userConstraints,
        displayConstraints,
        userHasWebcam,
      }} />;
      break;

    case VIDEO_SOURCE_USER:
      title = t('sources-video-user-selected');
      hideActionButtons = !userStream && state.userAllowed !== false;
      body = <SourcePreview
        warnings={[userWarning, unexpectedEndWarning]}
        inputs={[userInput]}
      />;
      break;

    case VIDEO_SOURCE_DISPLAY:
      title = t('sources-video-display-selected');
      hideActionButtons = !displayStream && state.displayAllowed !== false;
      body = <SourcePreview
        warnings={[displayWarning, unexpectedEndWarning]}
        inputs={[displayInput]}
      />;
      break;

    case VIDEO_SOURCE_BOTH:
      title = t('sources-video-display-and-user-selected');
      hideActionButtons = (!userStream && state.userAllowed !== false)
        || (!displayStream && state.displayAllowed !== false);
      body = <SourcePreview
        warnings={[displayWarning, userWarning, unexpectedEndWarning]}
        inputs={[displayInput, userInput]}
      />;
      break;
    default:
      console.error('bug: active source has an unexpected value');
      return <p>Something went very wrong (internal error) :-(</p>;
  };

  const hideReselectSource = hideActionButtons
    && !state.userUnexpectedEnd && !state.displayUnexpectedEnd;

  return (
    <StepContainer>
      <Styled.h1>{ title }</Styled.h1>

      { body }

      { activeSource !== VIDEO_SOURCE_NONE && <div sx={{ mb: 3 }} /> }

      { activeSource !== VIDEO_SOURCE_NONE && <ActionButtons
        next={hideActionButtons ? null : { onClick: () => nextStep(), disabled: nextDisabled }}
        prev={hideReselectSource ? null : {
          onClick: reselectSource,
          disabled: false,
          label: 'sources-video-reselect-source',
        }}
      /> }
    </StepContainer>
  );
}

const SourceSelection = ({ setActiveSource, userConstraints, displayConstraints, userHasWebcam }) => {


  const [videoType,setVideoType] = useState('');
  const [scrennFps,setScreenFps] = useState(0);
  const [cameraFps,setCameraFps] = useState(0);
  const [bothFps,setBothFps] = useState('');

  const updateVideoType = (e) =>{
    setVideoType(e.target.value);
    console.log('Value is : ' +e.target.value)
  }

  const updateScreenFPS = (e) =>{
    setScreenFps(e.target.value);
  }

  const updateCameraFps = (e) =>{
    setCameraFps(e.target.value);
  }

  const updateBothFps = (e) =>{
    setBothFps(e.target.value);
  }


  const { t } = useTranslation();

  const settings = useSettings();
  const dispatch = useDispatch();
  const state = useStudioState();
  const { displaySupported, userSupported } = state;

  const clickUser = async () => {
    setActiveSource(VIDEO_SOURCE_USER);
    await startUserCapture(dispatch, settings, userConstraints,cameraFps);
    await queryMediaDevices(dispatch);
  };
  const clickDisplay = async () => {
    setActiveSource(VIDEO_SOURCE_DISPLAY);
    await startDisplayCapture(dispatch, settings, displayConstraints,scrennFps);
  };
  const clickBoth = async () => {

      if(videoType === "SINGLE"){
        frameRateWindows(bothFps,bothFps,videoType);
      }
      else if(videoType === "DUAL"){
        frameRateWindows(scrennFps,cameraFps,videoType);
      }
       
    setActiveSource(VIDEO_SOURCE_BOTH);
    
    await startUserCapture(dispatch, settings, userConstraints,cameraFps);
    await Promise.all([
      queryMediaDevices(dispatch),
      startDisplayCapture(dispatch, settings, displayConstraints,scrennFps),
    ]);
  };


  if (!displaySupported && !userSupported) {
    return <Notification isDanger>{t('sources-video-none-available')}</Notification>;
  }



  return <React.Fragment>
    <Spacer />
    <Flex
      sx={{
        flexDirection: ['column', 'row'],
        maxWidth: [270, 850],
        width: '100%',
        mx: ['auto', 'none'],
        mb: 3,
        flex: '4 1 auto',
        maxHeight: ['none', '270px'],
        justifyContent: 'center',
        '& > :not(:last-of-type)': {
          mb: [3, 0],
          mr: [0, 3],
        },
      }}
    >

      <Popup
      trigger = { (displaySupported || !onMobileDevice()) && <OptionButton
        label={t('sources-scenario-display')}
        img="https://img.icons8.com/fluent-systems-filled/96/4a90e2/monitor.png"
        backgroundColor={''}
        disabledText={displaySupported ? false : t('sources-video-display-not-supported')}
      />}
      modal
      nested>



      {close => (
      <div
        sx={{
          p:20,
          borderRadius:10
        }}
      >
  
        <div>
          <Styled.h1
            sx={{
              textAlign:'center',
              mb:25
            }}
          >
             Configure your output</Styled.h1></div>

           <Select
            sx={{
              mt:10
            }}
            onChange={updateScreenFPS}
           >
              <option value="">Select FPS</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
           </Select>
          

        <div
        sx={{
          mt:20
        }}
        >

        <button 
           sx={{
            appearance: 'none',
            display: 'inline-block',
            textAlign: 'center',
            lineHeight: 'inherit',
            textDecoration: 'none',
            fontSize: 'inherit',
            fontWeight: 'bold',
            m: 0,
            px: 3,
            py: 2,
            border: 0,
            borderRadius: 4,
            variant: 'buttons.primary',
            }}
            onClick={clickDisplay}
         >
      
         NEXT
        </button>



        <button
                 sx={{
                  appearance: 'none',
                  display: 'inline-block',
                  textAlign: 'center',
                  lineHeight: 'inherit',
                  textDecoration: 'none',
                  fontSize: 'inherit',
                  fontWeight: 'bold',
                  ml: 430,
                  px: 3,
                  py: 2,
                  border: 0,
                  borderRadius: 4,
                  variant: 'buttons.danger',
                  }}

            onClick={() => {
              console.log('modal closed ');
              close();
            }}
          >
            CLOSE
          </button>
        </div>


      </div>
    )}

    </Popup>




      <Popup
      trigger = { (displaySupported || !onMobileDevice()) && userSupported && <OptionButton
        label={t('sources-scenario-display-and-user')}
        img={'https://img.icons8.com/pastel-glyph/64/4a90e2/cinema-screen.png'}
        onClick={clickBoth}
        disabledText={
          displaySupported
            ? (userHasWebcam ? false : t('sources-video-no-cam-detected'))
            : t('sources-video-display-not-supported')
        }
      />}
      modal
      nested>

    {close => (
      <div
        sx={{
          p:20,
          borderRadius:10
        }}
      >
  

        <div>
          <Styled.h1
            sx={{
              textAlign:'center',
              mb:25
            }}
          >
             Configure your output</Styled.h1></div>



          <Select onChange={updateVideoType}>
            <option value="">Select Diliverable Type</option>
            <option value="SINGLE">Match Same FPS</option>
            <option value="DUAL">Select Different FPS s</option>
          </Select>

          {(videoType === "SINGLE") &&
           <Select
            sx={{
              mt:10
            }}
            onChange={updateBothFps}
           >
              <option value="">Select FPS</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
           </Select>
          
          }



          {(videoType === "DUAL") &&

          <div>
           <Select
            sx={{
              mt:10
            }}
            onChange={updateScreenFPS}
           >
              <option value="">Select FPS for PC Screen</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
           </Select>

           <Select
            sx={{
              mt:10
            }}
            onChange={updateCameraFps}
           >
              <option value="">Select FPS for Web Cam</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
           </Select>

           </div>
          
          }


        <div
        sx={{
          mt:20
        }}
        >

        <button 
           sx={{
            appearance: 'none',
            display: 'inline-block',
            textAlign: 'center',
            lineHeight: 'inherit',
            textDecoration: 'none',
            fontSize: 'inherit',
            fontWeight: 'bold',
            m: 0,
            px: 3,
            py: 2,
            border: 0,
            borderRadius: 4,
            variant: 'buttons.primary',
            }}
         onClick={clickBoth}>
      
         NEXT
        </button>



          <button
                 sx={{
                  appearance: 'none',
                  display: 'inline-block',
                  textAlign: 'center',
                  lineHeight: 'inherit',
                  textDecoration: 'none',
                  fontSize: 'inherit',
                  fontWeight: 'bold',
                  ml: 430,
                  px: 3,
                  py: 2,
                  border: 0,
                  borderRadius: 4,
                  variant: 'buttons.danger',
                  }}

            onClick={() => {
              console.log('modal closed ');
              close();
            }}
          >
            CLOSE
          </button>
        </div>


      </div>
    )}

      </Popup>



      <Popup
      trigger = { userSupported && <OptionButton
        label={t('sources-scenario-user')}
        img="https://img.icons8.com/metro/52/4a90e2/camera.png"
        onClick={clickUser}
        disabledText={userHasWebcam ? false : t('sources-video-no-cam-detected')}
      />}
      modal
      nested>



      {close => (
      <div
        sx={{
          p:20,
          borderRadius:10
        }}
      >
  
        <div>
          <Styled.h1
            sx={{
              textAlign:'center',
              mb:25
            }}
          >
             Configure your output</Styled.h1></div>

           <Select
            sx={{
              mt:10
            }}
            onChange={updateCameraFps}
           >
              <option value="">Select FPS</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
           </Select>
          

        <div
        sx={{
          mt:20
        }}
        >

        <button 
           sx={{
            appearance: 'none',
            display: 'inline-block',
            textAlign: 'center',
            lineHeight: 'inherit',
            textDecoration: 'none',
            fontSize: 'inherit',
            fontWeight: 'bold',
            m: 0,
            px: 3,
            py: 2,
            border: 0,
            borderRadius: 4,
            variant: 'buttons.primary',
            }}
            onClick={clickUser}
         >
      
         NEXT
        </button>



        <button
                 sx={{
                  appearance: 'none',
                  display: 'inline-block',
                  textAlign: 'center',
                  lineHeight: 'inherit',
                  textDecoration: 'none',
                  fontSize: 'inherit',
                  fontWeight: 'bold',
                  ml: 430,
                  px: 3,
                  py: 2,
                  border: 0,
                  borderRadius: 4,
                  variant: 'buttons.danger',
                  }}

            onClick={() => {
              console.log('modal closed ');
              close();
            }}
          >
            CLOSE
          </button>
        </div>


      </div>
    )}


      </Popup>



    </Flex>
    <Spacer />
  </React.Fragment>;
};

const OptionButton = ({ img, label, onClick, disabledText = false }) => {
  const disabled = disabledText !== false;

  return (
    <button
      
      onClick={onClick}
      disabled={disabled}
      title={label}
      sx={{
        fontFamily: 'inherit',
       
        color: disabled ? 'gray.2' : 'gray.0',
        border: theme => `3px solid ${disabled ? theme.colors.blue[2] : '#19BCDC'}`,
        backgroundColor: 'gray.4',
        
        borderRadius: '8px',
        flex: ['1 1 auto', '0 1 100%'],
        minWidth: '150px',
        maxWidth: '180px',
        minHeight: '120px',
        maxHeight: '160px',
        p: 2,
        '&:hover': disabled ? {} : {
          boxShadow: theme => `0 0 10px ${theme.colors.gray[2]}`,
          backgroundColor: 'white',
        },
      }}
    >
      <div sx={{ display: 'block', textAlign: 'center', mb: 3 }}>
      <img src={img} 
        style={{
          minWidth: '80px',
          maxWidth: '120px',
          minHeight: '80px',
          maxHeight: '120px',
        }}
      ></img>
      </div>
      <div sx={{ fontSize: 2 , fontWeight:'bold' }}>{label}</div>
      <div sx={{ fontSize: 2, mt: 1 }}>{disabledText}</div>
    </button>
  );
};

const Spacer = (rest) => <div sx={{ flex: '1 0 0' }} {...rest}></div>;