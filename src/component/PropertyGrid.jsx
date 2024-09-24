import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Image,
  VStack,
  Alert,
  AlertIcon,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';
import axiosInstance from '../axiosInstance';
import propertyImage from '../assets/Property3.jpg';
import Pagination from './common/Pagination';
import UploadWidget from './UploadWidget';

const PropertyGrid = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [newProperty, setNewProperty] = useState({
    name: '',
    price: '',
    bhk: '',
    area: '',
    location: '',
    image: ''
  });
  const [imageUrl, setImageUrl] = useState('');

  
  const bgColor = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('gray.800', 'white');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputColor = useColorModeValue('gray.800', 'white');
  
  
  const gridItemBg = useColorModeValue('white', 'gray.700');
  const textPrimaryColor = useColorModeValue('gray.800', 'white');
  const textSecondaryColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    fetchProperties();
    loadStoredProperties(); 
  }, []);

  useEffect(() => {
    if (imageUrl) {
      setNewProperty(prev => ({ ...prev, image: imageUrl }));
    }
  }, [imageUrl]);

  const fetchProperties = async () => {
    try {
      const response = await axiosInstance.get('/properties');
      setProperties(response.data);
    } catch (error) {
      setError('Failed to Fetch The Properties');
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStoredProperties = () => {
    const storedProperties = JSON.parse(localStorage.getItem('properties')) || [];
    setProperties(prev => [...prev, ...storedProperties]); 
  };

  const handleAddProperty = async () => {
    try {
      await axiosInstance.post('https://restate-json.onrender.com/properties', newProperty);
      const updatedProperties = [...properties, newProperty]; 
      setProperties(updatedProperties);

      const storedProperties = JSON.parse(localStorage.getItem('properties')) || [];
      localStorage.setItem('properties', JSON.stringify([...storedProperties, newProperty]));

      toast({
        title: 'Property Added.',
        description: "The property has been successfully added.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose(); 
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: 'Error.',
        description: "There was an error adding the property.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredProperties = properties.filter((property) => {
    const query = searchQuery.toLowerCase();
    return (
      property.name.toLowerCase().includes(query) ||
      property.location.toLowerCase().includes(query)
    );
  });

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModal = () => {
    const isLoggedIn = !!localStorage.getItem('user'); 
    if (isLoggedIn) {
      onOpen(); 
    } else {
      toast({
        title: 'Please Log In',
        description: "You need to log in to add a property.",
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right', 
      });
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
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box py="10" px={{ base: '4', md: '8', lg: '16' }} bg={bgColor}>
      <Heading textAlign="center" mb="8" color={headingColor}>
        Featured Properties
      </Heading>

      <HStack spacing="4" mb="6" justifyContent="center">
        <Button colorScheme="teal" onClick={handleOpenModal}>
          Add Property
        </Button>

        <InputGroup width="500px">
          <InputLeftElement>
            <SearchIcon color="gray.500" />
          </InputLeftElement>
          <Input
            placeholder="Search by Name or Location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg={inputBg}
            color={inputColor}
          />
        </InputGroup>
      </HStack>

      <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap={6}>
        {currentProperties.length > 0 ? (
          currentProperties.map((property) => (
            <Link key={property.id} to={`/property/${property.id}`}>
              <GridItem
                p="4"
                borderRadius="md"
                boxShadow="lg"
                bg={gridItemBg}
                textAlign="left"
                _hover={{ transform: 'scale(1.05)', transition: '0.3s ease' }}
              >
                <VStack spacing="4">
                  <Image
                    src={property.image || propertyImage}
                    alt={property.name}
                    borderRadius="md"
                    w="100%"
                    h="200px"
                    objectFit="cover"
                  />
                  <Text fontSize="lg" fontWeight="bold" color={textPrimaryColor}>
                    {property.name}
                  </Text>
                  <Text fontSize="md" color={textSecondaryColor}>
                    Price: {property.price}
                  </Text>
                  <Text fontSize="sm" color={textSecondaryColor}>
                    Location: {property.location}
                  </Text>
                </VStack>
              </GridItem>
            </Link>
          ))
        ) : (
          <Flex justifyContent="center" alignItems="center" h="200px">
            <Text textAlign={'center'} color="red.500">No properties found</Text>
          </Flex>
        )}
      </Grid>

      {filteredProperties.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Property</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Name"
              mb={4}
              value={newProperty.name}
              onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
            />
            <Input
              placeholder="Price"
              mb={4}
              value={newProperty.price}
              onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
            />
            <Input
              placeholder="BHK"
              mb={4}
              value={newProperty.bhk}
              onChange={(e) => setNewProperty({ ...newProperty, bhk: e.target.value })}
            />
            <Input
              placeholder="Area"
              mb={4}
              value={newProperty.area}
              onChange={(e) => setNewProperty({ ...newProperty, area: e.target.value })}
            />
            <Input
              placeholder="Location"
              mb={4}
              value={newProperty.location}
              onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
            />
            <UploadWidget
              uwConfig={{
                cloudName: 'ddwi66ytp', 
                uploadPreset: 'ameudhjdiu', 
              }}
              setImageUrl={setImageUrl} 
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="teal" onClick={handleAddProperty}>Add Property</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PropertyGrid;



