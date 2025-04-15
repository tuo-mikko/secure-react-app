import React from 'react'
import { PasswordInput } from "../components/ui/password-input"
import { useForm } from "react-hook-form"
import { 
    Field,
    Flex,
    Box,
    Input,
    Button,
    Stack,
    Text
 } from '@chakra-ui/react'

 interface LoginValues {
    username: string
    password: string
 }

const Login = () =>  {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>()

    const onSubmit = handleSubmit((data) => console.log(data))
    return (
        <Flex
            direction="column"
            align="center">
            <Text
                fontSize="5xl"
                fontWeight="bold"
                color="brand.brown"
            >
                Log in or create an account to White Lotus
            </Text>
            <Flex>
                <Box
                    padding="4"
                    direction="column"
                    borderRadius="md"
                    borderColor="brand.brown"
                    borderWidth="1px"
                    margin="2"
                    >
                    <Text>Login with user account</Text>
                    <form onSubmit={onSubmit}>
                        <Stack gap="4" align="flex-start" maxW="sm">
                            <Field.Root invalid={!!errors.username}>
                                <Field.Label>Username</Field.Label>
                                <Input {...register("username")} />
                                <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
                            </Field.Root>

                        <Field.Root invalid={!!errors.password}>
                        <Field.Label>Password</Field.Label>
                        <PasswordInput {...register("password")} />
                        <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                        </Field.Root>

                        <Button 
                            type="submit"
                            bg="brand.brown"
                        >
                            Submit</Button>
                        </Stack>
                    </form>
                </Box>
            </Flex>
        </Flex>
    )
}

export default Login;