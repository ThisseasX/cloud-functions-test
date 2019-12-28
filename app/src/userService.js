import { mockServices } from './utils';

const API_URL = 'https://us-central1-firetest-eb60d.cloudfunctions.net/api';
const USERS_URL = `${API_URL}/users`;

const jsonFetch = (...fetchOptions) =>
  fetch(...fetchOptions).then(response => response.json());

const getAllUsers = () => jsonFetch(USERS_URL);

const addUser = user =>
  jsonFetch(USERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

const deleteUser = id => jsonFetch(`${USERS_URL}/${id}`, { method: 'DELETE' });

const fakeUser = id => ({
  id,
  name: `user${id}`,
  pass: '123'
    .split('')
    .map(x => +x + id)
    .join(''),
});

const mockData = {
  getAllUsers: {
    data: Array(4)
      .fill()
      .map((_, i) => fakeUser(i + 1)),
  },
  addUser: { data: fakeUser(5) },
  deleteUser: { data: fakeUser(6) },
};

const userService = mockServices(
  false,
  {
    getAllUsers,
    addUser,
    deleteUser,
  },
  mockData,
);

export default userService;
