
import React , { useState , useContext}from 'react';
import { jsx } from 'theme-ui';
import { Styled } from 'theme-ui';

import { Grid, Box, Flex, Label , Input} from 'theme-ui'
import { Button } from 'theme-ui';
import { Select } from 'theme-ui'


import axios from 'axios';
import swal from 'sweetalert';
  
export default function SignUp(){

  
const initialState = '';


const [firstName, setfirstName] = useState(initialState);
const [lastName, setlastName] = useState(initialState);
const [email, setemail] = useState(initialState);
const [userType, setuserType] = useState('Client');
const [password, setpassword] = useState(initialState);


const updateFirstName = (e) =>{
  setfirstName(e.target.value);
}

const updateLastName = (e) =>{
  setlastName(e.target.value);
}

const updateEmail = (e) =>{
  setemail(e.target.value);
}

const updatePassword = (e) =>{
  setpassword(e.target.value);
}

const updateUserType = (e) =>{
  setuserType(e.target.value);
}

const addUser = () =>{
   const data = {
     firstName,
     lastName,
     email,
     password,
     userType
   }

   console.log(data)

   return axios
    .post('/users/register',{
      firstName:firstName,
      lastName:lastName,
      email:email,
      password:password,
      userType:userType
    })
    .then(res=>{
      if(res.data != null){
        swal({
            title: "Done",
            text: "Registered Successfully",
            icon: "success",
            button: true,
        })
      }
      return res.data;
    })
    .then((res =>{
      setfirstName('');
      setlastName('');
      setemail('');
      setpassword('');
      setuserType('')
    }))
    .catch(err =>{
      console.log(err)
      if(err.response.status === 403){
        swal({
            title: "Oops!!!",
            text: "User Email Already Exists",
            icon: "error",
            button: "Back to Login",
        })
    }
    });


}

    return (
        <div>
          
        <Flex>
               
        <Box p={3} bg='light' sx={{ flex: '1 1 auto' }} marginLeft={'30%'} marginRight={'30%'} marginTop={'5%'} as='form' onSubmit={e => e.preventDefault()}>
                
            <Styled.h1>Sign up for Eduscope Express</Styled.h1>    

            <Label htmlFor='firstName'>First Name</Label>
            <Input name='firstName' mb={3} value={firstName} onChange={updateFirstName}/>

            <Label htmlFor='lastName'>Last Name</Label>
            <Input name='lastName' mb={3} value={lastName} onChange={updateLastName}/>

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
                      onClick={addUser}
            >
             Register   
            </Button>


   

        </Box>

      </Flex>
      </div>
    )
}
