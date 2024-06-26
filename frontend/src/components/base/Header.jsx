import { AppBar, IconButton, Toolbar, Tooltip, Link as MuiLink } from '@mui/material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import PasswordIcon from '@mui/icons-material/Password';
import { Link, useNavigate } from 'react-router-dom';

import useUserStore from '../../stores/userStore';

function Header({ transparent }) {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  const logout = () => {
    setUser();
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <AppBar position='fixed' elevation={0} {...transparent && { color: 'transparent' }}>
      <Toolbar>
        <MuiLink 
          color={'inherit'}
          variant='h6' 
          underline='none'
          component={Link} 
          to='/'
        >
          Live Link
        </MuiLink>
        {user
          ? <Tooltip title='Logout'>
              <IconButton color='inherit' onClick={logout} sx={{ ml: 'auto' }}>
                <LockPersonIcon/>
              </IconButton>
            </Tooltip> 
          : <Tooltip title='Login'>
            <IconButton component={Link} to='/login' color='inherit' sx={{ ml: 'auto' }}>
              <PasswordIcon/>
            </IconButton>
          </Tooltip>}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
