import React from 'react';
import PropertyGrid from '../component/PropertyGrid';
import { Box, Flex } from '@chakra-ui/react';
import Header from '../component/common/Header';
import Sidebar from '../component/common/Sidebar';

function PropertyPage() {
    return (
        <Flex height="100vh">
            <Sidebar />
            <Box flex="1" display="flex" flexDirection="column">
                <Header />
                <Box flex="1"  overflowY="auto">
                    <PropertyGrid />
                </Box>
            </Box>
        </Flex>
    );
}

export default PropertyPage;
