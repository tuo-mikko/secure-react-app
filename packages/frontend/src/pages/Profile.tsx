import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { LoggedUser } from '../services/auth';

interface ProfileProps {
  user: LoggedUser | null;
}

function Profile({ user }: ProfileProps) {
// Not logged in
  if (!user) {
    return (
      <Flex direction="column" align="center">
        <Text fontSize="5xl" fontWeight="bold" color="#35544f">
          Please log in to view your profile.
        </Text>
      </Flex>
    );
  }
// Logged in
  return (
    <Flex direction="column" align="center" gap="4">
      <Text fontSize="5xl" fontWeight="bold" color="#35544f">
        Profile
      </Text>
      <Text fontSize="xl">Username: {user.username}</Text>
      <Text fontSize="xl">Name: {user.name}</Text>
      <Text fontSize="sm" color="gray.500">
        ID: {user.id}
      </Text>
    </Flex>
  );
}

export default Profile;
