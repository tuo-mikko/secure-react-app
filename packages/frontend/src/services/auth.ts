import API from './api';

// shape of data
export type Credentials = { username: string; password: string };
export type LoggedUser  = { id: string; username: string; name: string };

// login: returns user data
export const login = async (creds: Credentials): Promise<LoggedUser> => {
  const { data } = await API.post<LoggedUser>('/login', creds);
  return data;
};

// logout: clears cookies
export const logout = async (): Promise<void> => {
  await API.post('/logout');
};

// token refresh
export const refresh = async (): Promise<void> => {
  await API.post('/refresh');
};

// check current user session
export const whoAmI = async (): Promise<LoggedUser> => {
  const { data } = await API.get<LoggedUser>('/me');
  return data;
};

export default { login, logout, refresh, whoAmI };
