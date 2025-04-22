import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Flex, 
    Text,
    Grid, 
    Heading,
    GridItem } from '@chakra-ui/react'

const baseUrl = 'http://localhost:3001/api/posts?limit=2&sort=desc'
interface Post {
    title: string;
    message: string;
};

function Home() {
    const [posts, setPosts] = useState([]); //db posts
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
                templateRows="repeat(3, 1fr)"
                templateColumns="repeat(3,1fr)"
            >
                    <GridItem rowSpan={3} colSpan={2}>
                    <Text>Recent threads</Text>
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
                        {posts
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
            </Grid>
        </Flex>
    )
}

export default Home;