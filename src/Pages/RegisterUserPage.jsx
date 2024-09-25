import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '../component/common/Sidebar';
import Header from '../component/common/Header';
import RegisterUser from '../component/RegisterUser';

function SinglePropertyPage() {
  return (
    <Flex height="100vh"> 
      <Sidebar />
      <Box flex="1" overflowY="auto">  
        <Header />
        <RegisterUser/>
      </Box>
    </Flex>
  );
}

export default SinglePropertyPage;