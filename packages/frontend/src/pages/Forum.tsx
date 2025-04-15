import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "../components/NewPostPopUp"
import { 
    Button, 
    Box,
    Flex, 
    Text, 
    Heading,
    Input,
    Field,
    Textarea } from '@chakra-ui/react';

const baseUrl = 'http://localhost:3001/api/posts'

const Forum = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetchPosts();
    }, []);

    //fetch forumposts from database
    const fetchPosts = () => {
        axios.get(baseUrl)
        .then(response => {
            console.log(response.data);
            setPosts(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        }); 
    };

    //Popup prop
    const [isOpen, setIsOpen] = useState<boolean>(false);

    //TODO: create a new forumposts
    const postPost = () => {
        axios.post(baseUrl)
    }

    return (
        <Flex 
            direction='column' 
            align="center"
            justify="center"
            gap="4">
            <Text
                fontSize="5xl"
                fontWeight="bold"
                color="#35544f"
            >
                FORUM
            </Text>
            <Flex
                align="center"
                justify="center"
                direction="column"
                maxW="l"
            >
                <Button
                    bg="brand.brown"
                    fontWeight="bold"
                    marginX="2"
                    marginY="2"
                    onClick={() => setIsOpen(true)}
                    >
                    New Post
                </Button>

                {isOpen && (
                    <Popup onClose={() => setIsOpen(false)}>
                        <Box
                            padding="4"
                            direction="column"
                            borderRadius="md"
                            borderColor="brand.brown"
                            borderWidth="1px"
                        >
                            <p>Start a new thread</p>
                            <Field.Root>
                            <Field.Label>Threat title</Field.Label>
                            <Input 
                                placeholder="Thread title"
                                variant="outline"
                                margin="1">
                            </Input>
                            
                                <Textarea
                                    placeholder=""
                                    variant="outline"
                                    margin="1">
                                </Textarea>
                            </Field.Root>
                            <Button
                                bg="#37371f"
                                fontWeight="bold"
                                marginX="2"
                                marginY="2">
                                Publish
                            </Button>
                        </Box>
                    </Popup>
                )}

            </Flex>
            <Flex
                bg="#f4f1bb"
                p="6"
                borderRadius="md"
                gap="1"
                direction = "column"
                borderWidth="1"
                borderColor="#37371f"
                >
                {posts.map((post) => (
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
        </Flex>
    )
}

export default Forum;