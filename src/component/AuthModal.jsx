import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AuthModal({ isOpen, onClose }) {
  const initialLoginData = {
    username: '',
    password: '',
  };

  const initialRegisterData = {
    username: '',
    email: '',
    password: '',
  };

  const navigate = useNavigate();
  const [loginData, setLoginData] = useState(initialLoginData);
  const [registerData, setRegisterData] = useState(initialRegisterData);
  const toast = useToast();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://real-estate-backend-3-ydh8.onrender.com/api/auth/login', loginData, {
        withCredentials: true,
      });
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      toast({
        title: 'Login successful.',
        description: `Welcome back, ${user.username}!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setLoginData(initialLoginData);
      navigate('/properties');
    } catch (error) {
      toast({
        title: 'Login Failed.',
        description: error.response?.data?.message || 'Something went wrong!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleRegisterSubmit = async () => {
    try {
      const response = await axios.post(
        'https://real-estate-backend-3-ydh8.onrender.com/api/auth/register',
        registerData,
        { withCredentials: true }
      );
      toast({
        title: 'Registration successful.',
        description: 'You have been registered successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setRegisterData(initialRegisterData);
    } catch (error) {
      toast({
        title: 'Registration failed.',
        description: error.response?.data?.message || 'Something went wrong!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  
 
  
  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign-In / Register</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>Login</Tab>
              <Tab>Register</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <FormControl id="login-username" isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={loginData.username}
                    onChange={handleLoginChange}
                  />
                </FormControl>
                <FormControl id="login-password" isRequired mt={4}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                </FormControl>
                <Button colorScheme="teal" width="100%" mt={6} onClick={handleLoginSubmit}>
                  Login
                </Button>
             
              </TabPanel>
              <TabPanel>
                <FormControl id="register-username" isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                  />
                </FormControl>
                <FormControl id="register-email" isRequired mt={4}>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                  />
                </FormControl>
                <FormControl id="register-password" isRequired mt={4}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                  />
                </FormControl>
                <Button colorScheme="teal" width="100%" mt={6} onClick={handleRegisterSubmit}>
                  Register
                </Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AuthModal;