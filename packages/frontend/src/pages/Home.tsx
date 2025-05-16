
import React, { useState, useEffect } from 'react';
import { PasswordInput } from '../components/ui/password-input';
import auth, { LoggedUser } from '../services/auth';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Field,
  Text,
  Grid,
  Heading,
  GridItem,
  Stack,
  Input,
} from '@chakra-ui/react';

interface Post {
  id: string;
  title: string;
  message: string;
  postDateTime: string;
}

interface HomeProps {
  user: LoggedUser | null;
  setUser: React.Dispatch<React.SetStateAction<LoggedUser | null>>;
}

function Home({ user, setUser }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  /* load latest 5 threads */
  useEffect(() => {
    api
      .get<Post[]>('/posts/latest')
      .then((r) => setPosts(r.data))
      .catch((err) => console.error('Error fetching posts:', err));
  }, []);

  /* login handler */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const logged = await auth.login({ username, password });
      setUser(logged);
      setUsername('');
      setPassword('');
    } catch (err: any) {
      if (err.response) {
        setErrorMessage(err.response.data.error || 'Login failed');
      } else {
        setErrorMessage('Unexpected error');
      }
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  /* UI */
  return (
    <Flex direction="column" align="center">
      <Text fontSize="5xl" fontWeight="bold" color="#35544f">
        Welcome to White Lotus - resort
      </Text>

      <Grid
        h="200px"
        templateRows="repeat(5, 1fr)"
        templateColumns="repeat(3, 1fr)"
      >
        {/* latest threads */}
        <GridItem rowSpan={3} colSpan={2} p="4">
          <Text fontSize="2xl">Recent threads</Text>
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
              <Flex
                key={post.id}
                bg="white"
                color="black"
                p="5"
                borderRadius="md"
                borderWidth="1"
                direction="column"
              >
                <Heading color="black">{post.title}</Heading>
                <Text color="gray.800">{post.message}</Text>
              </Flex>
            ))}
          </Flex>
        </GridItem>

        {/* login box */}
        {!user && (
          <GridItem rowSpan={2} colSpan={1} p="4">
            <Box
              p="6"
              gap="1"
              borderWidth="5"
              borderRadius="md"
              borderColor="#37371f"
            >
              <Text>Login with user account</Text>
              <form onSubmit={handleLogin}>
                <Stack gap="4" align="flex-start" maxW="sm">
                  <Field.Root>
                    <Field.Label>Username</Field.Label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Password</Field.Label>
                    <PasswordInput
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Field.Root>

                  {errorMessage && (
                    <Text color="red.500">{errorMessage}</Text>
                  )}

                  <Flex p="1">
                    <Button type="submit" bg="#35544f" size="lg">
                      <Text fontWeight="bold">Submit</Text>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => navigate('/createAccount')}
                    >
                      Create an account
                    </Button>
                  </Flex>
                </Stack>
              </form>
            </Box>
          </GridItem>
        )}
      </Grid>
    </Flex>
  );
}

export default Home;