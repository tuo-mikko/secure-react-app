import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Button, 
    Flex, 
    Text, 
    Heading } from '@chakra-ui/react';

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
                    bg="#37371f"
                    fontWeight="bold"
                    //TODO: pop up ikkunan avaaminen forumipostauksen luomiselle
                    onClick={() => window.open("about:blank", "hello", "width=200,height=200")}
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