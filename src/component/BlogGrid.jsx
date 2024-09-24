import React, { useEffect, useState } from 'react';
import {
  chakra,
  Box,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  Container,
  Image,
  Button,
  Text,
  IconButton,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import axiosInstance from '../axiosInstance';
import Pagination from './common/Pagination';
import broker from '../assets/broker.jpg'; 
import UploadWidget from './UploadWidget'; 

const BlogGrid = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    image: '',
  });

  const user = JSON.parse(localStorage.getItem('user')); 

  const cardBg = useColorModeValue('white', 'gray.800');
  const toast = useToast()
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('/blog');
        setBlogs(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

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

  
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const openModal = (blog = null) => {
    if (!user) {
        toast({
            title: 'Please Log In',
            description: "You need to log in to add a Blog.",
            status: 'warning',
            duration: 3000,
            isClosable: true,
            position: 'top-right', 
          });
      return;
    }
    if (blog) {
        if (!user) {
            toast({
                title: 'Please Log In',
                description: "You need to log in to delete a blog.",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
      setIsEditMode(true);
      setSelectedBlog(blog);
      setFormValues({
        title: blog.title,
        description: blog.description,
        image: blog.image,
      });
    } else {
      setIsEditMode(false);
      setSelectedBlog(null);
      setFormValues({
        title: '',
        description: '',
        image: '',
      });
    }
    onOpen();
  };


const handleDelete = async (blogId) => {
    if (!user) {
        toast({
            title: 'Please Log In',
            description: "You need to log in to delete a blog.",
            status: 'warning',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
        });
        return;
    }

    try {
        await axiosInstance.delete(`/blog/${blogId}`);
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
        toast({
            title: 'Blog Deleted',
            description: "The blog was deleted successfully.",
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
        });
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Error deleting blog.',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
        });
    }
};


const handleSubmit = async () => {
    const { title, description, image } = formValues;

    if (!title || !description || !image) {
        toast({
            title: 'Error',
            description: 'Please fill all fields',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
        });
        return;
    }

    try {
        if (isEditMode) {
            await axiosInstance.put(`/blog/${selectedBlog.id}`, { title, description, image });
            setBlogs((prevBlogs) =>
                prevBlogs.map((blog) =>
                    blog.id === selectedBlog.id ? { ...blog, title, description, image } : blog
                )
            );
            toast({
                title: 'Blog Updated',
                description: "The blog was updated successfully.",
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        } else {
            const response = await axiosInstance.post('/blog', { title, description, image });
            setBlogs((prevBlogs) => [...prevBlogs, response.data]);
            toast({
                title: 'Blog Added',
                description: "The blog was added successfully.",
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        }
        onClose();
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Error submitting blog.',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
        });
    }
};


  
  const setImageUrl = (url) => {
    setFormValues({ ...formValues, image: url });
  };

  return (
    <Container maxW="7xl" p={{ base: 5, md: 10 }}>
      
      <Box mb={6} textAlign="right">
        <Button colorScheme="teal" onClick={() => openModal()}>Add Blog</Button>
      </Box>

      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {currentBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            onEdit={() => openModal(blog)}
            onDelete={() => handleDelete(blog.id)}
            cardBg={cardBg}
          />
        ))}
      </SimpleGrid>

      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditMode ? 'Edit Blog' : 'Add Blog'}</ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Title</FormLabel>
              <Input
                value={formValues.title}
                onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                placeholder="Enter blog title"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formValues.description}
                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                placeholder="Enter blog description"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Image</FormLabel>
            
              <UploadWidget
                uwConfig={{
                  cloudName: 'ddwi66ytp',
                  uploadPreset: 'ameudhjdiu',
                }}
                setImageUrl={setImageUrl} 
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {isEditMode ? 'Update Blog' : 'Add Blog'}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};


const BlogCard = ({ blog, onEdit, onDelete, cardBg }) => {
  return (
    <Box
      borderWidth="1px"
      _hover={{ shadow: 'xl', transform: 'scale(1.02)' }}
      transition="all 0.2s"
      rounded="md"
      overflow="hidden"
      bg={cardBg}
      w="100%"
      h="100%"
      display="flex"
      flexDirection="column"
    >
      <Image
        src={blog.image || broker}
        objectFit="cover"
        w="100%"
        h="220px"
        alt={blog.title}
      />
      <Box p={{ base: 4, sm: 6 }} flex="1">
        <Box mb={4}>
          <chakra.h3 fontSize="xl" fontWeight="bold">
            {blog.title}
          </chakra.h3>
          <Text mt={2} noOfLines={3}>
            {blog.description}
          </Text>
        </Box>
      </Box>
      <Box p={4} display="flex" justifyContent="space-between" alignItems="center">
        <Button
          as={Link}
          to={`/blog/${blog.id}`} 
          colorScheme="teal"
        >
          Read More
        </Button>
        <Box>
          <IconButton
            icon={<EditIcon />}
            colorScheme="yellow"
            onClick={onEdit}
            mr={2}
          />
          <IconButton
            icon={<DeleteIcon />}
            colorScheme="red"
            onClick={onDelete}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BlogGrid;




