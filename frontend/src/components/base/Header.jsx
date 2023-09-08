import { AppBar, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { useNavigate } from 'react-router-dom';

import useUserStore from '../../stores/userStore';

function Header() {
  const { user, setUser, darkMode } = useUserStore();
  const navigate = useNavigate();

  const logout = () => {
    setUser();
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <AppBar position='fixed' elevation={0}>
      <Toolbar>
        <Typography variant='h6' component='div' {...darkMode && { color: 'primary' }}>
          LiveLink
        </Typography>
        {user && <Tooltip title='Logout'>
          <IconButton color='inherit' onClick={logout} sx={{ ml: 'auto' }}>
            <LockPersonIcon/>
          </IconButton>
        </Tooltip>}
      </Toolbar>
    </AppBar>
  );
}

export default Header;