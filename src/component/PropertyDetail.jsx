import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack, Image, Spinner, Alert, AlertIcon, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, FormControl, FormLabel, Input, useDisclosure, useToast } from '@chakra-ui/react';
import { useParams,  useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import propertyImage from '../assets/Property3.jpg';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({}); 
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const history = useNavigate(); 

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await axiosInstance.get(`/properties/${id}`);
      setProperty(response.data);
      setFormData(response.data); 
    } catch (error) {
      setError('Failed to Fetch the Property Details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/properties/${id}`);
      toast({
        title: 'Property deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
      history('/properties'); 
    } catch (error) {
      toast({
        title: 'Failed to delete the property.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axiosInstance.put(`/properties/${id}`, formData); 
      toast({
        title: 'Property updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
      fetchPropertyDetails(); 
      onClose(); 
    } catch (error) {
      toast({
        title: 'Failed to update the property.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    <Box py="10" px={{ base: '4', md: '8', lg: '16' }}>
      {property ? (
        <VStack spacing="4" textAlign="left">
          <Image
            src={property.image || propertyImage} 
            alt={property.name}
            borderRadius="md"
            w="100%"
            h="400px"
            objectFit="cover"
          />
          <Heading>{property.name}</Heading>
          <Text fontSize="lg" color="gray.600">Price: ${property.price}</Text>
          <Text fontSize="lg" color="gray.600">Location: {property.location}</Text>
          <Text fontSize="lg" color="gray.600">Bedrooms: {property.bhk}</Text>
          <Text fontSize="lg" color="gray.600">Area: {property.area} sqft</Text>

          
          <Button colorScheme="blue" onClick={onOpen}>
            Edit
          </Button>
          <Button colorScheme="red" onClick={handleDelete}>
            Delete
          </Button>
        </VStack>
      ) : (
        <Text textAlign="center">No property details available</Text>
      )}


      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Property</ModalHeader>
          <ModalBody>
            <FormControl id="name" mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="price" mb={4}>
              <FormLabel>Price</FormLabel>
              <Input
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="location" mb={4}>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="bhk" mb={4}>
              <FormLabel>Bedrooms</FormLabel>
              <Input
                name="bhk"
                value={formData.bhk || ''}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleEditSubmit}>
              Save Changes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PropertyDetail;
