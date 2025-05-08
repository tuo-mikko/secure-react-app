import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import api from '../services/api';
import Popup from '../components/NewPostPopUp';
import {
  Button,
  Box,
  Flex,
  Text,
  Heading,
  Grid,
  GridItem,
  Input,
  Field,
  Textarea,
} from '@chakra-ui/react';
import { LoggedUser } from '@/services/auth';


// post information from posts database
type PostData = {
  title: string;
  message: string;
  userId: string;
  postDateTime: string;
  id: string;
};

// connect userid to username to show in posts
interface User {
  id: string;
  username: string;
}

interface ForumProps {
    user: LoggedUser | null;
  }
  


const Forum = ({ user }: ForumProps) => {
  const [posts, setPost] = useState<PostData[]>([]); // db posts
  const [postCreatorUN, setPostCreatorUN] = useState(''); //
  const [isOpen, setIsOpen] = useState<boolean>(false); // Popup prop
  const [published, setPublished] = useState<boolean>(false);
  const [title, setTitle] = useState('');

  // handle creating a new post on forum
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostData>();

  const onSubmit: SubmitHandler<PostData> = (data) => {
    api
      .post<PostData>('/posts', {
        title: data.title,
        message: data.message,
      })
      .then(function (response) {
        setPublished(true);
        setTitle(data.title);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // fetch forumposts from database
  const fetchPosts = () => {
    api
      .get<PostData[]>('/posts')
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  // fetch username based on userID
  const fetchUsername = (userID: string): Promise<string | null> => {
    return api
      .get<User>(`/users/${userID}`)
      .then((response) => {
        return response.data.username;
      })
      .catch(() => null);
  };

  return (
    <Flex direction="column" align="center" justify="center" gap="4">
      <Text fontSize="5xl" fontWeight="bold" color="#35544f">
        FORUM
      </Text>

      <Flex align="center" justify="center" direction="column">
        {user ? (
          <Button
            bg="#37371f"
            fontWeight="bold"
            marginX="2"
            marginY="2"
            onClick={() => setIsOpen(true)}
          >
            New Post
          </Button>
        ) : (
          <Text color="gray.500">Log in to create new threads</Text>
        )}

        {isOpen && (
          <Popup onClose={() => setIsOpen(false)}>
            <Box
              padding="4"
              direction="column"
              borderRadius="md"
              borderColor="#37371f"
              borderWidth="1px"
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <p>Start a new thread</p>
                <Field.Root>
                  <Field.Label>Thread title</Field.Label>
                  <Input
                    placeholder="Thread title"
                    variant="outline"
                    margin="1"
                    {...register('title', { required: 'Title is required' })}
                  />
                  <Textarea
                    placeholder=""
                    variant="outline"
                    margin="1"
                    {...register('message', {
                      required: 'Message is required',
                    })}
                  />
                </Field.Root>
                <Button
                  bg="#37371f"
                  fontWeight="bold"
                  marginX="2"
                  marginY="2"
                  type="submit"
                >
                  Publish
                </Button>
              </form>
            </Box>
          </Popup>
        )}
      </Flex>

      <Box
        display={published ? 'block' : 'none'}
        borderRadius="md"
        bg="#88C380"
        p="3"
        maxW="20"
      >
        <Text fontWeight="bold" color="white">
          Thread published with title:{' '}
        </Text>
        <Text color="white">{title}</Text>
      </Box>

      <Flex
        bg="#f4f1bb"
        p="6"
        borderRadius="md"
        gap="1"
        direction="column"
        borderWidth="1"
        borderColor="#37371f"
        width="30"
      >
        {posts.map((post) => (
          <div key={post.id}>
            <Flex
              bg="white"
              p="5"
              borderRadius="md"
              borderWidth="1"
              direction="column"
            >
              <Grid
                w="500"
                templateColumns="repeat(6, 1fr)"
                templateRows="repeate(4, 1fr)"
                gap={2}
              >
                <GridItem rowSpan={1} colSpan={4}>
                  <Heading color="gray.800">{post.title}</Heading>
                </GridItem>
                <GridItem rowSpan={1} colSpan={4} color="gray.800">
                  <p>{post.message}</p>
                </GridItem>
                <GridItem rowSpan={1} colSpan={4}>
                  <Text color="gray.800" textStyle="xs">{post.userId}</Text>
                  <Text color="gray.800" textStyle="xs">{post.postDateTime}</Text>
                </GridItem>
              </Grid>
            </Flex>
          </div>
        ))}
      </Flex>
    </Flex>
  );
};

export default Forum;
