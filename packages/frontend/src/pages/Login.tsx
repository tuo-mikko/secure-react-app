import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

function Login()  {
    return (
        <Flex direction='column' align="center">
            <Text
                fontSize="5xl"
                fontWeight="bold"
                color="#35544f"
            >
                Log in to White Lotus -forum
            </Text>
        </Flex>
    )
}

export default Login;