import React, { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Spinner,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';
import { FaHome, FaPen, FaUser, FaEye, FaTools } from 'react-icons/fa';

const Dashboard = () => {
  const [data, setData] = useState({
    properties: 0,
    blogs: 0,
    services: 0,
    users: 0,
    visitors: 0,
  });
  const [loading, setLoading] = useState(true);

  // Define color values here
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const statBgColor = useColorModeValue('white', 'gray.700');
  const statLabelColor = useColorModeValue('gray.600', 'gray.300');
  const statNumberColor = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propertiesResponse = await axios.get('https://restate-json.onrender.com/properties');
        const blogsResponse = await axios.get('https://restate-json.onrender.com/blog');
        const servicesResponse = await axios.get('https://restate-json.onrender.com/servicesData');

        
        const randomUsers = Math.floor(Math.random() * 1000);
        const randomVisitors = Math.floor(Math.random() * 5000);

        
        setData({
          properties: propertiesResponse.data.length,
          blogs: blogsResponse.data.length,
          services: servicesResponse.data.length,
          users: randomUsers,
          visitors: randomVisitors,
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={4} bg={bgColor} minHeight="100vh">
      <Text fontSize="2xl" fontWeight="bold" mb={4} color={textColor}>
        Dashboard
      </Text>
      <SimpleGrid columns={3} spacing={10}>
        <Stat p={4} borderRadius="md" boxShadow="lg" bg={statBgColor}>
          <Flex align="center" justify="space-between">
            <Box color="blue.500">
              <FaHome size={24} />
            </Box>
            <Box>
              <StatLabel color={statLabelColor}>Properties Listed</StatLabel>
              <StatNumber color={statNumberColor}>{data.properties}</StatNumber>
            </Box>
          </Flex>
        </Stat>
        <Stat p={4} borderRadius="md" boxShadow="lg" bg={statBgColor}>
          <Flex align="center" justify="space-between">
            <Box color="green.500">
              <FaPen size={24} />
            </Box>
            <Box>
              <StatLabel color={statLabelColor}>Blogs</StatLabel>
              <StatNumber color={statNumberColor}>{data.blogs}</StatNumber>
            </Box>
          </Flex>
        </Stat>
        <Stat p={4} borderRadius="md" boxShadow="lg" bg={statBgColor}>
          <Flex align="center" justify="space-between">
            <Box color="orange.500">
              <FaTools size={24} />
            </Box>
            <Box>
              <StatLabel color={statLabelColor}>Services Available</StatLabel>
              <StatNumber color={statNumberColor}>{data.services}</StatNumber>
            </Box>
          </Flex>
        </Stat>
        <Stat p={4} borderRadius="md" boxShadow="lg" bg={statBgColor}>
          <Flex align="center" justify="space-between">
            <Box color="purple.500">
              <FaUser size={24} />
            </Box>
            <Box>
              <StatLabel color={statLabelColor}>Registered Users</StatLabel>
              <StatNumber color={statNumberColor}>{data.users}</StatNumber>
            </Box>
          </Flex>
        </Stat>
        <Stat p={4} borderRadius="md" boxShadow="lg" bg={statBgColor}>
          <Flex align="center" justify="space-between">
            <Box color="red.500">
              <FaEye size={24} />
            </Box>
            <Box>
              <StatLabel color={statLabelColor}>Website Visitors</StatLabel>
              <StatNumber color={statNumberColor}>{data.visitors}</StatNumber>
            </Box>
          </Flex>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;




