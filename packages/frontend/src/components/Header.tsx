import React from 'react';
//import { Link } from 'react-router-dom';
import { Flex, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';


function Header() {
    //TO DO authentication 
    const navigate = useNavigate();

    return (
        <Flex height='60px' p='1' bg='#659b5e'>
            <Flex align="left">
                <Button
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
                < Button
                    variant="ghost"
                    size="lg"
                    onClick={() => navigate(`/login`)}
                >
                    <Text 
                        fontWeight="bold"
                        color='#FFF1D0'
                    >
                        Login
                    </Text>
                </Button>
            </Flex>
            <Flex justify="flex-end">
                <Button
                    variant="subtle"
                    size="lg"
                    bg="#88C380">
                    <Text 
                        fontWeight="bold"
                        color='#AE505F'
                    >Log out</Text>
                    </Button>
            </Flex>
        </Flex>
    )
}

export default Header;