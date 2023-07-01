import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import { useAuth } from '../../context/auth-context';
import { useState } from "react";


function Login() {

  const { loginHandler } = useAuth();

  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });

  const loginFormInputHandler = (event) => {
    const { name, value } = event.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  const loginFormSubmitHandler = (event) => {
    event.preventDefault();
    loginHandler(loginDetails);
  };

  const guestUserDetails = {
    username: "nishtha",
    password: "nish",
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
          </Text>
        </Stack>
        <form onSubmit={loginFormSubmitHandler}>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Username:</FormLabel>
                <Input type="text" name="username"
                  value={loginDetails.username}
                  placeholder="Username"
                  onChange={loginFormInputHandler} />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" name="password"
                  value={loginDetails.password}
                  placeholder="Password"
                  onChange={loginFormInputHandler} />
              </FormControl>
              <Stack spacing={5}>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  type='submit'
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  SignIn
                </Button>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  onClick={() => setLoginDetails({
                    username: guestUserDetails.username,
                    password: guestUserDetails.password,
                  })}
                  type='submit'
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Login as Guest
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  New user? <Link color={'blue.400'} href='/signup'>Signup</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </form>
      </Stack>
    </Flex>
  );
}

export default Login