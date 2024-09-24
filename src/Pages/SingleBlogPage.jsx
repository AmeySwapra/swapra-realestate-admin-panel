import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '../component/common/Sidebar';
import Header from '../component/common/Header';
import BlogDetail from '../component/BlogDetail';

function SingleBlogPage() {
  return (
    <Flex height="100vh"> 
      <Sidebar />
      <Box flex="1" overflowY="auto">  
        <Header />
        <BlogDetail/>
      </Box>
    </Flex>
  );
}

export default SingleBlogPage;