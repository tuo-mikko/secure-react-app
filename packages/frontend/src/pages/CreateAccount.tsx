import * as React from 'react'
import { PasswordInput, PasswordStrengthMeter } from "../components/ui/password-input"
import { PasswordStrengthService } from '../services/PasswordStrengthService'
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

const CreateAccount = () =>  {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [user, setUser] = React.useState(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [passwordStrength, setPasswordStrength] = React.useState<number>(0);
    const service = new PasswordStrengthService();

    //TODO: Edit to handle registering new account
    const handleLogin = async (event: React.FormEvent<HTMLElement>) => {
        event.preventDefault()    
        console.log('logging in with', username, password)  
        console.log('password strength', passwordStrength)

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
                Create an account to White Lotus
            </Text>
            <Flex>
                <Box
                    padding="4"
                    direction="column"
                    borderRadius="md"
                    borderColor="#35544f"
                    borderWidth="1px"
                    margin="2"
                    width="xl"
                    >
                    <form onSubmit={handleLogin}>
                    <Stack gap="4" align="flex-start">
                        <Field.Root>
                            <Field.Label>Username</Field.Label>
                            <Input 
                                type="username"
                                value={username}
                                onChange={({ target }) => setUsername(target.value)} />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Name</Field.Label>
                            <Input 
                                type="name"
                                value={name}
                                onChange={({ target }) => setUsername(target.value)} />
                        </Field.Root>

                        <Field.Root maxWidth="xl">
                            <Stack>
                                <Field.Label>Password</Field.Label>
                                <Text 
                                    fontStyle="italic"
                                    textStyle="sm">Minimum length 8 characters, please use numbers and capitalized letters</Text>
                                <PasswordInput 
                                    type="password"
                                    value={password}
                                    onChange={({ target }) => {
                                        setPassword(target.value);
                                        setPasswordStrength(service.checkPasswordStrength(target.value));
                                    }}
                                        />
                                 <PasswordStrengthMeter value={passwordStrength}/>
                            </Stack>
                        </Field.Root>
                    <Button 
                        type="submit"
                        bg="#35544f"
                    >
                        Submit</Button>
                    </Stack>
                </form>
                </Box>
            </Flex>
        </Flex>
    )
}

export default CreateAccount;