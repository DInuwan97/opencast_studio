import React from 'react'
import { jsx } from 'theme-ui';


import { Grid, Box, Flex, Label , Input} from 'theme-ui'
import { Button } from 'theme-ui'
  
export const SignUp = () => {
    return (
        <Flex>
       
        <Box p={3} bg='light' sx={{ flex: '1 1 auto' }} marginLeft={'30%'} marginRight={'30%'} marginTop={'5%'} as='form' onSubmit={e => e.preventDefault()}>
                
                
            <Label htmlFor='firstName'>First Name</Label>
            <Input name='firstName' mb={3} />

            <Label htmlFor='lastName'>Last Name</Label>
            <Input name='lastName' mb={3} />

            <Label htmlFor='email'>Email</Label>
            <Input name='email' mb={3} />

            <Label htmlFor='password'>Password</Label>
            <Input type='password' name='password'mb={3} />
          

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
            >
             Register   
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
    )
}
