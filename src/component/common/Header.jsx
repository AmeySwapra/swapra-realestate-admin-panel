import React, { useState } from 'react';
import { Box, Flex, Text, Button, Image, useColorMode, useColorModeValue } from '@chakra-ui/react';
import logo from '../../assets/logo.png';
import AuthModal from '../AuthModal'; 

const Header = () => {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('black', 'white');

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <Box bg={bgColor} color={textColor} p={4}>
      <Flex align="center">
        <Image src={logo} alt='swapra-realestate-logo' width={'200px'} />
        <Text fontSize="30px" ml={2}>
          JustHome Admin
        </Text>
        <Button colorScheme="blue" ml="auto" onClick={openModal}>
          Sign In
        </Button>
      </Flex>
      <AuthModal isOpen={isModalOpen} onClose={closeModal} />
    </Box>
  );
};

export default Header;


