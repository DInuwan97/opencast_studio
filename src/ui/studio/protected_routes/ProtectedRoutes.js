import React,{useState} from "react";
import { Route, Redirect } from "react-router-dom";
import jwt_decode from 'jwt-decode';



export const ProtectedRoutesLoggedUser = ({

    component: Component,
    ...rest
  }) => {
  

  
    return (
      <Route
        {...rest}
        render={props => {
          if (localStorage.userLoginToken) {
            return <Component {...props} />;
          } else {
            return (
              <Redirect
                to={{
                  pathname: "/404NotFound",
                  state: {
                    from: props.location
                  }
                }}
              />
            );
          }
        }}
      />
    );
  };