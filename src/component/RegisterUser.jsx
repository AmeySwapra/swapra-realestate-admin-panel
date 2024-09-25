import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Spinner, Icon, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    axios.get('https://real-estate-backend-3-ydh8.onrender.com/api/auth/register-user')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('black', 'white');

 
  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Flex direction="column" align="center" p={5} w="100%">
      {users.map((user) => (
        <Box
          key={user.id}
          w="100%"
          h="30px"
          bg={bgColor}
          p={2}
          mb={2}
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          _hover={{ h: "50px", bg: hoverBgColor, transition: "height 0.2s ease-in-out" }}
        >
          <Flex align="center">
            <Icon as={FaUser} w={5} h={5} mr={3} color={textColor} />
            <Text fontWeight="bold" color={textColor} mr={5}>
              {user.username}
            </Text>
          </Flex>
          <Text color={textColor}>{user.email}</Text>
        </Box>
      ))}
    </Flex>
  );
};

export default UserList;


