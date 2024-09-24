import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Header from '../component/common/Header';
import Sidebar from '../component/common/Sidebar';
import Dashboard from '../component/Dashboard';

function HomePage() {
  return (
    <Flex height="100vh"> 
      <Sidebar />
      <Box flex="1" overflowY="auto">  
        <Header />
        <Dashboard />
      </Box>
    </Flex>
  );
}

export default HomePage;

