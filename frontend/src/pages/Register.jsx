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

function Register() {
  const { user, darkMode, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [name, setName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    
    if (!name || !password1 || !password2) return setLoading(false);

    axios.post('/api/users/register', { name, password1, password2 })
      .catch(({ response: res }) => {
        setLoading(false);
        setError(res.data);
      })
      .then((res) => {
        setLoading(false);
        if (res?.status !== 201) return;
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        navigate('/');
      });
  };

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return (
    <StyledForm title='Register' handleSubmit={handleSubmit}>
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
        name='password1' 
        value={password1}
        variant='standard' 
        placeholder='Password' 
        type='password'
        onChange={(event) => setPassword1(event.target.value)}
        error={error.code === 2}
        helperText={error.code === 2 && error.msg}
        disabled={loading}
      />
      <TextField 
        name='password2' 
        value={password2}
        variant='standard' 
        placeholder='Password Again' 
        type='password'
        onChange={(event) => setPassword2(event.target.value)}
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
        Sign Up
      </LoadingButton>
      <Typography sx={{ mt: '-2.5vh' }}>
        Already have an account? <MuiLink component={Link} to='/login'>Login</MuiLink>
      </Typography>
    </StyledForm>
  );
}

export default Register;
