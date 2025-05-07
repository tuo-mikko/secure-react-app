import react from 'react'
import axios from 'axios'

const baseUrl = '/api/login'

type Credentials = {
    username: string;
    password: string;
};

const login = async (credentials: Credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }