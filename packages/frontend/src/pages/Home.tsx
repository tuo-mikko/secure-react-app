import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PasswordInput } from "../components/ui/password-input"
import loginService from '../services/login'
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
} from '@chakra-ui/react'

const baseUrl = 'http://localhost:3001/api/posts'
interface Post {
    title: string;
    message: string;
    postDateTime: string;
};

function Home() {
    const [post, setPost] = useState<Post[]>([]); //db posts
    const [username, setUsername] = React.useState('');
    const [user, setUser] = React.useState(null);
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    useEffect(() => {
            fetchPosts();
        }, []);

    //fetch forumposts from database
    const fetchPosts = () => {
        axios.get<Post[]>(baseUrl)
        .then(response => {
            console.log(response.data);
            setPost(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        }); 
    };

    const handleLogin = async (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault()    
        console.log('logging in with', username, password)  

        try {
            const user = await loginService.login({
                username, password,
            });

            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setErrorMessage('wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    return (
        <Flex direction='column' align="center">
            <Text
                fontSize="5xl"
                fontWeight="bold"
                color="#35544f"
            >
                Welcome to White Lotus -resort
            </Text>
            <Grid
                h="200px"
                templateRows="repeat(5, 1fr)"
                templateColumns="repeat(3,1fr)"
            >
                <GridItem rowSpan={3} colSpan={2} padding="4">
                    <Text fontSize="2xl">Recent threads</Text>
                    <Flex
                        bg="#f4f1bb"
                        p="6"
                        borderRadius="md"
                        gap="1"
                        direction = "column"
                        borderWidth="1"
                        borderColor="#37371f"
                        width="30"
                    >
                        {post
                        .sort((a,b) => (new Date(b.postDateTime).getTime() - new Date(a.postDateTime).getTime()))
                        .slice(0,4)
                        .map((post) => (
                            <Flex
                                bg="white"
                                p="5"
                                borderRadius="md"
                                borderWidth="1"
                                direction = "column"
                                >
                                <Heading>{post.title}</Heading>
                                <p>{post.message}</p>
                            </Flex>
                        ))}
                    </Flex>
                </GridItem>
                <GridItem rowSpan={2} colSpan={1} padding="4">
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
                                        type="username"
                                        value={username}
                                        onChange={({ target }) => setUsername(target.value)} />
                                </Field.Root>

                            <Field.Root>
                                <Field.Label>Password</Field.Label>
                                    <PasswordInput 
                                        type="password"
                                        value={password}
                                        onChange={({ target }) => setPassword(target.value)} />
                            </Field.Root>

                            <Button 
                                type="submit"
                                bg="#35544f"
                            >
                                Submit</Button>
                            </Stack>
                        </form>
                    </Box>
                </GridItem>
            </Grid>
        </Flex>
    )
}

export default Home;