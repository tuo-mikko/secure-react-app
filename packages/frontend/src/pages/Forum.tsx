import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import Popup from "../components/NewPostPopUp";
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
    Textarea, } from '@chakra-ui/react';


const postsUrl = 'http://localhost:3001/api/posts'
const usersUrl = 'http://localhost:3001/api/users'

type PostData = {
    title: string;
    message: string;
    userId: string;
    postDateTime: string;
};

interface User {
    id: string;
    username: string;
}

const Forum = () => {
    const [posts, setPost] = useState<PostData[]>([]); //db posts
    const [postCreatorUN, setPostCreatorUN] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<PostData>();

    const onSubmit: SubmitHandler<PostData> = (data) => {
        axios.post(postsUrl, {
            title: data.title,
            userId: "67eee4122f3ab3d170f71666", 
            message: data.message,
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    //fetch forumposts from database
    const fetchPosts = () => {
        axios.get<PostData[]>(postsUrl)
        .then(response => {
            console.log(response.data);
            setPost(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        }); 
    };

    //fetch username based on userID
    const fetchUsername = (userID: string): Promise<string | null> => {
        //userURL.concat(usersUrl, userID)
        return axios.get<{ username: string }>('${usersUrl}/${userID}')
        .then(response => { 
            return response.data.username;
        })
    }

    //Popup prop
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Flex 
            direction='column' 
            align="center"
            justify="center"
            gap="4"

            >
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
            >
                <Button
                    bg="#37371f"
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
                            borderColor="#37371f"
                            borderWidth="1px">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <p>Start a new thread</p>
                                <Field.Root>
                                <Field.Label>Threat title</Field.Label>
                                <Input 
                                    placeholder="Thread title"
                                    variant="outline"
                                    margin="1"
                                    {...register('title', { required: 'Title is required'})}>
                                </Input>
                                <Textarea
                                    placeholder=""
                                    variant="outline"
                                    margin="1"
                                    {...register('message', { required: 'Message is required'})}
                                    >
                                </Textarea>
                                </Field.Root>
                                <Button
                                bg="#37371f"
                                fontWeight="bold"
                                marginX="2"
                                marginY="2"
                                type="submit">
                                    Publish
                                </Button>
                            </form>
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
                width="30"
                >
                {posts.map((post) => (
                    <Flex
                        bg="white"
                        p="5"
                        borderRadius="md"
                        borderWidth="1"
                        direction = "column"
                        >
                        <Grid
                            w="500"
                            templateColumns="repeat(6, 1fr)"
                            templateRows="repeate(4, 1fr)"
                            gap={2}>
                            <GridItem rowSpan={1} colSpan={4}>
                                <Heading>{post.title}</Heading>
                            </GridItem>
                            <GridItem rowSpan={1} colSpan={4}>
                                <p>{post.message}</p>
                            </GridItem>
                            <GridItem rowSpan={1} colSpan={4}>
                                <Text textStyle="xs">{post.postDateTime}</Text>
                                <Text textStyle="xs">{post.userId}</Text>
                            </GridItem>
                        </Grid>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    )
}

export default Forum;