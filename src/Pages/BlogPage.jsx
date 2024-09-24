import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Header from '../component/common/Header';
import Sidebar from '../component/common/Sidebar';
import BlogGrid from '../component/BlogGrid';

function BlogPage() {
    return (
        <Flex height="100vh">
            <Sidebar />
            <Box flex="1" display="flex" flexDirection="column">
                <Header />
                <Box flex="1"  overflowY="auto">
                    <BlogGrid/>
                </Box>
            </Box>
        </Flex>
    );
}

export default BlogPage;