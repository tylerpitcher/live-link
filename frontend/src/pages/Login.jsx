import { TextField, Typography, Link as MuiLink } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { Link, useNavigate } from 'react-router-dom'; 
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useEffect } from 'react';
import axios from 'axios';

import StyledForm from '../components/base/StyledForm';
import Header from '../components/base/Header';
import useUserStore from '../stores/userStore';

function Login() {
  const { user, darkMode, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    
    if (!name || !password) return setLoading(false);

    axios.post('/api/users/login', { name, password })
      .catch(({ response: res }) => {
        setLoading(false);
        setError(res.data);
      })
      .then((res) => {
        setLoading(false);
        if (res?.status !== 200) return;
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        navigate('/');
      });
  };

  useEffect(() => {
    if (user) navigate('/');
  }, [user]);

  return (
    <StyledForm title='Login' handleSubmit={handleSubmit}>
      <Header/>
      <TextField 
        name='name'
        value={name}  
        variant='standard' 
        placeholder='Username' 
        onChange={(event) => setName(event.target.value)}
        error={error.code === 1}
        helperText={error.code === 1 && error.msg}
        disabled={loading}
      />
      <TextField 
        name='password' 
        value={password}
        variant='standard' 
        placeholder='Password' 
        type='password'
        onChange={(event) => setPassword(event.target.value)}
        error={error.code === 2}
        helperText={error.code === 2 && error.msg}
        disabled={loading}
      />
      <LoadingButton 
        variant={darkMode ? 'outlined' : 'contained'} 
        {...darkMode ? { startIcon: <LoginIcon/> } : { endIcon: <LoginIcon/> }}
        type='submit'
        loading={loading}
      >
        Login
      </LoadingButton>
      <Typography sx={{ mt: '-2.5vh' }}>
        Don't have an account? <MuiLink component={Link} to='/register'>Sign Up</MuiLink>
      </Typography>
    </StyledForm>
  );
}

export default Login;
