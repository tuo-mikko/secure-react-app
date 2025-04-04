import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/posts'

const Forum = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetchPosts();
    }, []);

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

    return (
        <Flex 
            direction='column' 
            align="center"
            gap="4">
            <Text
                fontSize="5xl"
                fontWeight="bold"
                color="#35544f"
            >
                FORUM
            </Text>
            <Flex>
                <Button
                    onClick={() => console.log("new post")}
                    >
                    New Post
                </Button>
            </Flex>
            <Flex
                bg="#f4f1bb"
                p="6"
                borderRadius="md"
                gap="1"
                direction = "column"
                >
                {posts.map((post) => (
                    <Flex
                        bg="white"
                        p="5"
                        borderRadius="md"
                        borderWidth="1"
                        
                        >
                        <h3>{post.title}</h3>
                        <h4>{post.message}</h4>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    )
}

export default Forum;