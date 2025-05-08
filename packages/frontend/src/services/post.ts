import API from './api';

export interface Post {
  id: string;
  title: string;
  message: string;
  postDateTime: string;
}

const getAll = async (): Promise<Post[]> => {
  const { data } = await API.get<Post[]>('/posts');
  return data;
};

const create = async (title: string, message: string): Promise<Post> => {
  const payload = { title, message };
  const { data } = await API.post<Post>('/posts', payload);
  return data;
};

export default { getAll, create };
