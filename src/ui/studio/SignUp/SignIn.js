import React , { useState , useContext}from 'react';
import { jsx } from 'theme-ui';
import { Styled } from 'theme-ui';

import { Grid, Box, Flex, Label , Input} from 'theme-ui'
import { Button } from 'theme-ui';
import { Select } from 'theme-ui'


import axios from 'axios';
import swal from 'sweetalert';

export default function SignIn() {


const initialState = '';

const [email, setemail] = useState(initialState);
const [password, setpassword] = useState(initialState);


const updateEmail = (e) =>{
  setemail(e.target.value);
}

const updatePassword = (e) =>{
  setpassword(e.target.value);
}


const logUSer = () =>{
   const data = {
     email,
     password
   }

   console.log(data)

   axios
   .post('/users/login',{
       email:email,
       password:password
   })
   .then(res=>{
     localStorage.setItem('userLoginToken',res.data.token); //create the login session 
     window.location.replace("/");
     
   })
   .then((res =>{
     setemail('');
     setpassword('');
   }))
   .catch(err =>{
     if(err.response.status === 400){
         swal({
             title: "Oops!!!",
             text: "Your Password is Incorrect",
             icon: "error",
             button: true,
         })
     }
     else if(err.response.status === 404){
         swal({
             title: "Oops!!!",
             text: "User Does not Exist in the System",
             icon: "error",
             button: true,
         })
     }
 });
 
}


    return (
        <div>
            <Flex>
               
               <Box p={3} bg='light' sx={{ flex: '1 1 auto' }} marginLeft={'30%'} marginRight={'30%'} marginTop={'5%'} as='form' onSubmit={e => e.preventDefault()}>
                       
                   <Styled.h1>Sign in for Eduscope Express</Styled.h1>    
                     
                   <Label htmlFor='email'>Email</Label>
                   <Input name='email' mb={3} value={email} onChange={updateEmail}/>
       
                   <Label htmlFor='password' name="" value="">Password</Label>
                   <Input type='password' name='password'mb={3} onChange={updatePassword}/>
                 
                   <Button mr={2}
                           sx={{
                               appearance: 'none',
                               display: 'inline-block',
                               textAlign: 'center',
                               lineHeight: 'inherit',
                               textDecoration: 'none',
                               fontSize: 'inherit',
                               fontWeight: 'bold',
                               m: 0,
                               px: 4,
                               py: 2,
                               border: 0,
                               borderRadius: 4,
                             }}
                             onClick={logUSer}
                   >
                    Login 
                   </Button>
       
       
                   <Button mr={2}
                           sx={{
                               appearance: 'none',
                               display: 'inline-block',
                               textAlign: 'center',
                               lineHeight: 'inherit',
                               textDecoration: 'none',
                               fontSize: 'inherit',
                               fontWeight: 'bold',
                               ml: '49%',
                               px: 4,
                               py: 2,
                               border: 0,
                               borderRadius: 4,
                               variant: 'buttons.danger'
                             }}
                   >
                    Reset   
                   </Button>
       
               </Box>
       
             </Flex>
        </div>
    )
}
