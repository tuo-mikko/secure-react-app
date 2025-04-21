import * as React from 'react'
import { PasswordInput } from "../components/ui/password-input"
import { useForm } from "react-hook-form"
import axios from 'axios'
import loginService from '../services/login'
import { 
    Field,
    Flex,
    Box,
    Input,
    Button,
    Stack,
    Text
 } from '@chakra-ui/react'

const Login = () =>  {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [user, setUser] = React.useState(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const handleLogin = async (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault()    
        console.log('logging in with', username, password)  

        try {
            const user = await loginService.login({
                username, password,
            });

            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setErrorMessage('wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    return (
        <Flex
            direction="column"
            align="center">
            <Text
                fontSize="5xl"
                fontWeight="bold"
                color="#35544f"
            >
                Log in or create an account to White Lotus
            </Text>
            <Flex>
                <Box
                    padding="4"
                    direction="column"
                    borderRadius="md"
                    borderColor="#35544f"
                    borderWidth="1px"
                    margin="2"
                    >
                    <Text>Login with user account</Text>
                    <form onSubmit={handleLogin}>
                        <Stack gap="4" align="flex-start" maxW="sm">
                            <Field.Root>
                                <Field.Label>Username</Field.Label>
                                <Input 
                                    type="username"
                                    value={username}
                                    onChange={({ target }) => setUsername(target.value)} />
                            </Field.Root>

                        <Field.Root>
                        <Field.Label>Password</Field.Label>
                        <PasswordInput 
                            type="password"
                            value={password}
                            onChange={({ target }) => setPassword(target.value)} />
                        </Field.Root>

                        <Button 
                            type="submit"
                            bg="#35544f"
                        >
                            Submit</Button>
                        </Stack>
                    </form>
                </Box>
                <Box
                    padding="4"
                    direction="column"
                    borderRadius="md"
                    borderColor="#35544f"
                    borderWidth="1px"
                    margin="2"
                    >
                    <Text>Create a new account</Text>
                </Box>
            </Flex>
        </Flex>
    )
}

export default Login;