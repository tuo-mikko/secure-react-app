import React from 'react';
import { Flex, Text } from '@chakra-ui/react'

function Profile() {
    return (
        <Flex direction='column' align="center">
            <Text
                fontSize="5xl"
                fontWeight="bold"
                color="#35544f"
            >
                Profile
            </Text>
        </Flex>
    )
}

export default Profile;