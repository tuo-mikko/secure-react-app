import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Spacer, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';


function Header() {
    //TO DO authentication 
    const navigate = useNavigate();

    return (
        <Flex alignItems='left' height='60px' p='1' bg='#659b5e'>
            < Button
                variant="ghost"
                size="lg"
                
                onClick={() => navigate(`/home`)}
            >
                <Text 
                    fontWeight="bold"
                    color='#FFF1D0'
                    >
                    Home
                </Text>
            </Button>
            < Button
                variant="ghost"
                size="lg"
                onClick={() => navigate(`/forum`)}
            >
                <Text 
                    fontWeight="bold"
                    color='#FFF1D0'
                >
                    Forum
                </Text>
            </Button>
            < Button
                variant="ghost"
                size="lg"
                onClick={() => navigate(`/profile`)}
            >
                <Text 
                    fontWeight="bold"
                    color='#FFF1D0'
                >
                    Profile
                </Text>
            </Button>
        </Flex>
    )
}

export default Header;