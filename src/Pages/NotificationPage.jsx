import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '../component/common/Sidebar';
import Notification from '../component/Notification';
import Header from '../component/common/Header';

function NotificationPage() {
  return (
    <Flex height="100vh"> 
      <Sidebar />
      <Box flex="1" overflowY="auto">  
        <Header />
        <Notification/>
      </Box>
    </Flex>
  );
}

export default NotificationPage;