import API from './api';

// shape of data
export type Credentials = { username: string; password: string };
export type LoggedUser  = { id: string; username: string; name: string };

// api calls
export const login = async (creds: Credentials): Promise<LoggedUser> => {
  const { data } = await API.post<LoggedUser>('/login', creds);
  return data;                        // { id, username, name }
};

// clear cookies
export const logout = async (): Promise<void> => {
  await API.post('/logout');
};
// refresh
export const refresh = async (): Promise<void> => {
  await API.post('/refresh');
};

export default { login, logout, refresh };
