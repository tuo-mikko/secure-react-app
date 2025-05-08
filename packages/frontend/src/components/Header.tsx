import React from 'react';
import { Flex, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { LoggedUser } from '../services/auth';

interface HeaderProps {
  user: LoggedUser | null;
  onLogout: () => void;
}

function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <Flex height='60px' p='1' bg='#659b5e'>
      <Flex align="left">
        <Button variant="ghost" size="lg" onClick={() => navigate(`/home`)}>
          <Text fontWeight="bold" color='#FFF1D0'>Home</Text>
        </Button>
        <Button variant="ghost" size="lg" onClick={() => navigate(`/forum`)}>
          <Text fontWeight="bold" color='#FFF1D0'>Forum</Text>
        </Button>
        <Button variant="ghost" size="lg" onClick={() => navigate(`/profile`)}>
          <Text fontWeight="bold" color='#FFF1D0'>Profile</Text>
        </Button>
      </Flex>
      <Flex justify="flex-end" flex="1">
        {user && (
          <Button variant="subtle" size="lg" bg="#88C380" onClick={onLogout}>
            <Text fontWeight="bold" color='#AE505F'>Log out</Text>
          </Button>
        )}
      </Flex>
    </Flex>
  );
}

export default Header;
