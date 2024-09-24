import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  useToast,
  IconButton,
  useColorMode,
  Text,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';
import UploadWidget from './UploadWidget'; // Ensure you have the correct path for UploadWidget

const ServiceCard = ({ service, onEdit, onDelete }) => {
  return (
    <Box
      borderWidth={1}
      borderRadius="lg"
      p={4}
      textAlign="center"
      boxShadow="md"
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.05)' }}
    >
      <img
        src={service.image}
        alt={service.name}
        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
      />
      <Text fontWeight="bold" fontSize="lg" mt={2}>
        {service.name}
      </Text>
      <Text noOfLines={2} mt={2} fontSize="sm">
        {service.description}
      </Text>
      <Box mt={4}>
        <IconButton
          aria-label="Edit service"
          icon={<EditIcon />}
          colorScheme="blue"
          onClick={() => onEdit(service)}
          mr={2}
        />
        <IconButton
          aria-label="Delete service"
          icon={<DeleteIcon />}
          colorScheme="red"
          onClick={() => onDelete(service.id)}
        />
      </Box>
    </Box>
  );
};

const AddEditServiceModal = ({ isOpen, onClose, service, onSave }) => {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (service) {
      setImage(service.image);
      setName(service.name);
      setDescription(service.description);
    } else {
      setImage('');
      setName('');
      setDescription('');
    }
  }, [service]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: service?.id, image, name, description });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{service ? 'Edit Service' : 'Add Service'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired mb={4}>
              <FormLabel>Upload Image</FormLabel>
              <UploadWidget
                uwConfig={{
                  cloudName: 'ddwi66ytp',
                  uploadPreset: 'ameudhjdiu',
                }}
                setImageUrl={(url) => setImage(url)} // Set the uploaded image URL in the state
              />
            </FormControl>
            <FormControl isRequired mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="teal" type="submit">
              {service ? 'Update Service' : 'Add Service'}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://restate-json.onrender.com/servicesData');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  const handleAddEditService = async (service) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast({
        title: 'Please Log In',
        description: "You need to log in to add or edit a service.",
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    try {
      if (service.id) {
        await axios.put(`https://restate-json.onrender.com/servicesData/${service.id}`, service);
        setServices(services.map(s => (s.id === service.id ? service : s)));
        toast({ title: 'Service updated.', status: 'success', position: 'top-right' });
      } else {
        const response = await axios.post('https://restate-json.onrender.com/servicesData', service);
        setServices([...services, response.data]);
        toast({ title: 'Service added.', status: 'success', position: 'top-right' });
      }
    } catch (error) {
      toast({ title: 'Error saving service.', status: 'error', position: 'top-right' });
    }
  };

  const handleDeleteService = async (id) => {
    if (!user) {
      toast({
        title: 'Please Log In',
        description: "You need to log in to delete a service.",
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    try {
      await axios.delete(`https://restate-json.onrender.com/servicesData/${id}`);
      setServices(services.filter(service => service.id !== id));
      toast({ title: 'Service deleted.', status: 'success', position: 'top-right' });
    } catch (error) {
      toast({ title: 'Error deleting service.', status: 'error', position: 'top-right' });
    }
  };

  return (
    <Box p={5} bg={colorMode === 'light' ? 'white' : 'gray.800'} color={colorMode === 'light' ? 'black' : 'white'}>
      <Button onClick={() => { setSelectedService(null); onOpen(); }} colorScheme="teal">
        Add Service
      </Button>
      <SimpleGrid columns={[1, 2, 3]} spacing={5} mt={5}>
        {services.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
            onEdit={(service) => { setSelectedService(service); onOpen(); }}
            onDelete={handleDeleteService}
          />
        ))}
      </SimpleGrid>
      <AddEditServiceModal
        isOpen={isOpen}
        onClose={onClose}
        service={selectedService}
        onSave={handleAddEditService}
      />
    </Box>
  );
};

export default ServicesManager;




