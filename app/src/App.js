import React, { useState, useEffect } from 'react';
import userService from './userService';
import Loader from './Loader';
import './App.css';

const { getAllUsers, addUser, deleteUser } = userService;

const initialFormData = {
  name: '',
  pass: '',
};

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const refreshUsers = async () => {
    const users = await getAllUsers();
    setUsers(users.data);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshUsers();
      setLoading(false);
    })();
  }, []);

  const updateForm = e => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData(oldFormData => ({
      ...oldFormData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const submitForm = async () => {
    setLoading(true);

    const user = { ...formData };
    setFormData(initialFormData);

    console.log(`Adding user: ${JSON.stringify(user)}`);
    const addedUser = await addUser(user);
    console.log(addedUser.data);

    await refreshUsers();

    setLoading(false);
  };

  const handleDelete = id => async () => {
    setLoading(true);

    console.log(`Deleting user with id: ${id}`);
    const deletedUser = await deleteUser(id);
    console.log(deletedUser.data);

    await refreshUsers();

    setLoading(false);
  };

  return (
    <div className={'app'}>
      <div className={'container'}>
        {loading && (
          <div className={'loading'}>
            <Loader />
          </div>
        )}
        <div className={'form'}>
          <label htmlFor={'name'}>Name</label>
          <input
            autoComplete={'off'}
            id={'name'}
            onChange={updateForm}
            name={'name'}
            value={formData.name}
          />
          <label htmlFor={'pass'}>Pass</label>
          <input
            autoComplete={'off'}
            id={'pass'}
            onChange={updateForm}
            name={'pass'}
            value={formData.pass}
          />
          <div className={'buttonContainer'}>
            <button
              onClick={submitForm}
              className={`
              button
              ${Object.values(formData).some(v => !v) ? 'disabled' : ''}
            `}
            >
              Submit
            </button>
            <button onClick={resetForm} className={'button'}>
              Reset
            </button>
          </div>
        </div>
        <ul className={'users'}>
          {users.map(user => (
            <User key={user.id} user={user} handleDelete={handleDelete(user.id)} />
          ))}
        </ul>
      </div>
    </div>
  );
};

const User = ({ user, handleDelete }) => (
  <div className={'user'}>
    <div className={'user-info'}>
      <div>{user.name}</div>
      <div>{user.pass}</div>
    </div>
    <button className={'delete'} onClick={handleDelete}>
      Delete
    </button>
  </div>
);

export default App;
