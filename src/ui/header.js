//; -*- mode: rjsx;-*-
/** @jsx jsx */
import { jsx } from 'theme-ui';
import Avatar from "react-avatar";
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Styled } from 'theme-ui';

import {
  faCaretDown,
  faTimes,
  faWrench,
  faInfoCircle,
  faVideo,
  faUser,
  faLogin
} from "@fortawesome/free-solid-svg-icons";

import { useStudioState } from '../studio-state';
import jwt_decode from "jwt-decode";

// The header, including a logo on the left and the navigation on the right.
export default function Header() {


  const { isRecording } = useStudioState();

  return (
    <header
      sx={{
        height: theme => theme.heights.headerHeight,
        lineHeight: theme => theme.heights.headerHeight,
        color: 'background',
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 3,
      }}
    >
      {/* This div is used just for the background color. We can't set it for
          the parent element, as the navigation overlay would otherwise occlude
          this background color */}
      <div sx={{
        backgroundColor: '#19BCDC',
        position: 'absolute',
        zIndex: -3,
        height: '100%',
        width: '100%',
      }}></div>

      {/* This div is an overlay that is shown when a recording is currently active.
          This prevents the user from visiting other pages while recording. */}
      { isRecording && <div sx={{
        backgroundColor: '#19BCDC',
        position: 'absolute',
        zIndex: 20,
        height: '100%',
        width: '100%',
        opacity: 0.75,
      }}/>}

      {/* Actual content */}
      <Brand />
      <Navigation />
    </header>
  );
}

const Brand = () => {
  const location = useLocation();

  return (
    <Link to={{ pathname: "/", search: location.search }}>
      <picture sx={{ display: 'block', height: theme => theme.heights.headerHeight }}>
        <source
          media="(min-width: 920px)"
          srcSet={`${process.env.PUBLIC_URL}/Eduscope Logo_2.svg`}
          style={{width:150}}
        />
        <img
          src={`${process.env.PUBLIC_URL}/Eduscope Logo_2.svg`}
          alt="Eduscope Express"
          sx={{ height: theme => theme.heights.headerHeight }}
          style={{width:150}}
        />
      </picture>
    </Link>
  );
}

// One element (link) in the navigation.
const NavElement = ({ target, children, icon, ...rest }) => {
  const location = useLocation();

  return (
    <NavLink
      to={{
        pathname: target,
        search: location.search,
      }}
      exact
      activeStyle={{
        backgroundColor: '#19BCDC',
      }}
      sx={{
        color: 'white',
        pl: [3, '10px'],
        pr: [3, '14px'],
        textDecoration: 'none',
        fontSize: '18px',
        height: ['auto', '100%'],
        borderLeft: ['none', theme => `1px solid ${theme.colors.gray[3]}`],
        display: ['block', 'inline-block'],
        width: ['100%', 'auto'],

        '&:hover': {
          backgroundColor: 'gray.1',
        },
      }}
      {...rest}
    >
      <div sx={{
        width: '20px',
        display: 'inline-block',
        textAlign: 'right',
        mr: [3, 3, 2],
      }}>
        <FontAwesomeIcon icon={icon} />
      </div>
      {children}
    </NavLink>
  );
}

// The whole responsive navigation element.
const Navigation = props => {
  const [isOpened, updateIsOpened] = useState(false);
  const toggleMenu = () => updateIsOpened(!isOpened);
  const closeMenu = () => updateIsOpened(false);
  const { t } = useTranslation();



  const[firstName,setFirstName] = useState('');
  const[lastName,setLastName] = useState('');
  const [userType, setuserType] = useState('');

  if (localStorage.getItem("userLoginToken") !== null) {

    const token = localStorage.userLoginToken;
    const decoded = jwt_decode(token);

    setTimeout(()=>{
      setFirstName(decoded.firstName);
      setLastName(decoded.lastName);
      setuserType(decoded.userType);
    },100)
    
  }



  const signupLink = (
    
    
      <NavElement
      title={'SignUp'}
      target="/register"
      icon={faUser}
    >
      {'Sign Up'}
    </NavElement>
    
  
  )

  const signinLink = (
    

         <NavElement
    title={'SignIn'}
    target="/login"
    icon={faUser}
  >
    {'Sign In'}
  </NavElement>

 

  
  

)

const logOut = () =>{
  localStorage.removeItem("userLoginToken");  
  setTimeout(()=>{
    window.location.replace("/login");
  },50)
}

  const profileLink = (

  
   



<Popup
      trigger = { 

        <NavElement>
            <Avatar  round="60%" size='40' name={firstName+ ' ' +lastName} style={{marginRight:5}}/> 
            Hello { firstName }
        </NavElement>
      }
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
        <Styled.h3
            sx={{
              textAlign:'center',
              mb:10
            }}
          >
          Hi {firstName}
        </Styled.h3>
          <Styled.h1
            sx={{
              textAlign:'center',
              mb:25
            }}
          >
          Do you want to Logout ?
        </Styled.h1>
        </div>

          

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
            ml:'42%',
            px: 3,
            py: 2,
            border: 0,
            borderRadius: 4,
            variant: 'buttons.danger',
            }}
         onClick={logOut}>
      
         Log Out
        </button>



  
        </div>


      </div>
    )}

    </Popup>



  

  )


  return (
    <Fragment>
      <button
        onClick={toggleMenu}
        title={t('nav-open-menu-button')}
        sx={{
          display: ['inline-block', 'none'],
          border: theme => `2px solid ${theme.colors.gray[3]}`,
          borderRadius: '10px',
          color: 'white',
          my: 1,
          px: 3,
          mx: 1,
          fontSize: '20px',
          whiteSpace: 'nowrap',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'gray.1',
          },
          '&:active': {},
        }}
      >
        {t('nav-open-menu-button')}
        <span sx={{ width: '23px', display: 'inline-block' }}>
          <FontAwesomeIcon
            icon={isOpened ? faTimes : faCaretDown}
            sx={{ ml: '10px' }}
          />
        </span>
      </button>
      <nav
        ref={n => {
          if (n) {
            n.style.height = isOpened ? n.scrollHeight + 'px' : "";
          }
        }}
        sx={{
          overflow: 'hidden',
          zIndex: 10,
          // This "!important" is necessary unfortunately to override the inline
          // style set in the `ref` attribute above. Otherwise opening the menu
          // in mobile view and switching to desktop view (e.g. by rotating
          // phone) would result in a very strange artifact.
          height: ['0px', '100% !important'],
          top: [theme => theme.heights.headerHeight, theme => theme.heights.headerHeight, 0],
          position: ['absolute', 'static'],
          width: ['100%', 'auto'],
          backgroundColor: ['DodgerBlue', 'none'],
          transition: ['height 0.25s ease-out 0s', 'none'],
          scrollX: ['none', 'auto'],
        }}
      >
        <NavElement
          title={t('nav-recording')}
          target="/"
          icon={faVideo}
          onClick={closeMenu}
        >
          {t('nav-recording')}
        </NavElement>
        <NavElement
          title={t('nav-settings')}
          target="/settings"
          icon={faWrench}
          onClick={closeMenu}
        >
          {t('nav-settings')}
        </NavElement>



     
        {localStorage.userLoginToken ?
          profileLink:
          signinLink
        }

        {localStorage.userLoginToken ? null : signupLink}


        


      </nav>

      {/* A black, half-transparent overlay over the body */}
      {isOpened && <div
        onClick={closeMenu}
        ref={n => n && (n.style.opacity = 1)}
        sx={{
          display: [isOpened ? 'block' : 'none', 'none'],
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          position: 'fixed',
          zIndex: -10,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          opacity: 0,
          transition: 'opacity 0.25s ease-out 0s',
        }}
      ></div>}
    </Fragment>
  );
};
