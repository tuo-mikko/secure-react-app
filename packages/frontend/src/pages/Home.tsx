import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PasswordInput } from "../components/ui/password-input";
import auth, { LoggedUser } from '../services/auth';
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
  Input 
} from '@chakra-ui/react';

interface Post {
  title: string;
  message: string;
  postDateTime: string;
  id: string;
};

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

  useEffect(() => {
    fetchPosts();
  }, []);

  // fetch forumposts from database
  const fetchPosts = () => {
    axios.get<Post[]>('http://localhost:3001/api/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      }); 
  };

  // login functionalities
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();    
    try {
      const logged = await auth.login({ username, password });
      // Tell app what user is authorized / logged in
      setUser(logged);      
      setUsername('');
      setPassword('');
    } catch (exception: unknown) {
      if (axios.isAxiosError(exception) && exception.response) {
        console.error('Login failed:', exception.response.status, exception.response.data);
        setErrorMessage(exception.response.data.error || 'Login failed');
      } else {
        console.error('Unexpected error:', exception);
        setErrorMessage('An unexpected error occurred');
      }
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  return (
    <Flex direction='column' align="center">
      <Text fontSize="5xl" fontWeight="bold" color="#35544f">
        Welcome to White Lotus -resort
      </Text>
      <Grid h="200px" templateRows="repeat(5, 1fr)" templateColumns="repeat(3,1fr)">
        <GridItem rowSpan={3} colSpan={2} padding="4">
          <Text fontSize="2xl">Recent threads</Text>
          <Flex bg="#f4f1bb" p="6" borderRadius="md" gap="1" direction="column" borderWidth="1" borderColor="#37371f" width="30">
            {posts
              .sort((a,b) => (new Date(b.postDateTime).getTime() - new Date(a.postDateTime).getTime()))
              .slice(0,4)
              .map(post => (
                <Flex key={post.id} bg="white" color="black" p="5" borderRadius="md" borderWidth="1" direction="column">
                  <Heading color="black">{post.title}</Heading>
                  <Text color="gray.800">{post.message}</Text>
                </Flex>
            ))}
          </Flex>
        </GridItem>

        <GridItem rowSpan={2} colSpan={1} padding="4">
          <Box p="6" gap="1" borderWidth="5" borderRadius="md" borderColor="#37371f">
            <Text>Login with user account</Text>
            <form onSubmit={handleLogin}>
              <Stack gap="4" align="flex-start" maxW="sm">
                <Field.Root>
                  <Field.Label>Username</Field.Label>
                  <Input 
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Password</Field.Label>
                  <PasswordInput 
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                  />
                </Field.Root>
                {errorMessage && <Text color="red.500">{errorMessage}</Text>}
                <Flex p="1">
                  <Button type="submit" bg="#35544f" size="lg">
                    <Text fontWeight="bold">Submit</Text>
                  </Button>
                  <Button variant="ghost" size="lg" onClick={() => navigate(`/createAccount`)}>
                    Create an account
                  </Button> 
                </Flex>  
              </Stack>
            </form>
          </Box>
        </GridItem>
      </Grid>
    </Flex>
  );
}

export default Home;
