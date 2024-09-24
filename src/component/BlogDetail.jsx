import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Text,
  Image,
  Container,
  Button,
  useColorModeValue,
  Flex,
  Heading,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import broker from '../assets/broker.jpg'; 

const BlogDetail = () => {
  const { id } = useParams(); 
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const textColor = useColorModeValue('gray.600', 'gray.400'); 

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      console.log(id)
      const response = await axiosInstance.get(`/blog/${id}`);
      setBlog(response.data);
      console.log(response.data);
    } catch (err) {
      setError(err);
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box py="10" px={{ base: '4', md: '8', lg: '16' }} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box py="10" px={{ base: '4', md: '8', lg: '16' }} textAlign="center">
        <Alert status="error">
          <AlertIcon />
          {error.message || 'An error occurred'}
        </Alert>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Container maxW="7xl" p={{ base: 5, md: 10 }}>
        <Text textAlign="center">Blog not found</Text>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" p={{ base: 5, md: 10 }}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        alignItems="center"
        justifyContent="space-between"
        gap={10}
      >
        {/* Left Section - Image */}
        <Box flex="1" w="100%">
          <Image
            src={blog.image || broker}
            alt={blog.title}
            borderRadius="md"
            objectFit="cover"
            w="100%"
            h={{ base: '250px', md: '400px' }}
          />
        </Box>

        {/* Right Section - Blog Info */}
        <Box flex="1" w="100%">
          <Stack spacing={6}>
            <Heading
              as="h1"
              fontSize={{ base: '2xl', md: '4xl' }}
              fontWeight="bold"
            >
              {blog.title}
            </Heading>

            <Text fontSize={{ base: 'md', lg: 'lg' }} color={textColor}>
              {blog.description}
            </Text>

            <Link to='/properties'>
              <Button colorScheme="teal" size="lg">
                View Available Properties
              </Button>
            </Link>
          </Stack>
        </Box>
      </Flex>
    </Container>
  );
};

export default BlogDetail;