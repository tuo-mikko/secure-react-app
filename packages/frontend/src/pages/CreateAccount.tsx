import * as React from 'react'
import { PasswordInput, PasswordStrengthMeter } from "../components/ui/password-input"
import { PasswordStrengthService } from '../services/PasswordStrengthService'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'
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
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [passwordStrength, setPasswordStrength] = React.useState<number>(0);
    const service = new PasswordStrengthService();
    const baseUrl = 'http://localhost:3001/api/users'
    
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>();

    type FormData = {
        username: string;
        name: string;
        password: string;
    };

    const onSubmit: SubmitHandler<FormData> = (data) => {
        axios.post(baseUrl, {
            username: data.username,
            name: data.name,
            password: data.password,
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })
    };

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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack gap="4" align="flex-start">
                            <Field.Root>
                                <Field.Label>Username</Field.Label>
                                <Input 
                                    {...register('username', { required: 'Username is required'})} />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Name</Field.Label>
                                <Input 
                                    {...register('name', { required: 'Name is required'})} />
                            </Field.Root>

                            <Field.Root maxWidth="xl">
                                <Stack>
                                    <Field.Label>Password</Field.Label>
                                    <Text 
                                        fontStyle="italic"
                                        textStyle="sm">Minimum length 8 characters, please use numbers and capitalized letters</Text>
                                    <PasswordInput 
                                        {...register('password', { required: 'Password is required'})}
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