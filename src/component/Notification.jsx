import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, Spinner, Divider } from '@chakra-ui/react';
import axios from 'axios';

const Notification = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('https://real-estate-backend-3-ydh8.onrender.com/api/messages/get-message');
        setMessages(response.data); 
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" p={4}>
        <Spinner />
      </Box>
    );
  }

  return (
    <Box p={2}>
      <VStack spacing={4} align="start">
        {messages.length === 0 ? (
          <Text>No notifications available.</Text>
        ) : (
          messages.map((message) => (
            <Box
              key={message._id}
              p={4}
              borderWidth={1}
              borderRadius="md"
              boxShadow="sm"
              width="100%"
              bg="white"
              _hover={{ bg: 'gray.100' }} 
            >
              <Text fontWeight="bold">{message.name}</Text>
              <Text color="gray.500">{message.email}</Text>
              <Text mt={2} noOfLines={2}>{message.message}</Text>
              <Text fontSize="sm" color="gray.400" mt={2}>
                {message.createdAt} 
              </Text>
              <Divider my={2} /> 
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default Notification;

