import { Fade, LinearProgress } from '@mui/material';
import Header from './Header';

function Loader() {
  return (
    <Fade timeout={2000} in>
      <LinearProgress/>
    </Fade>
  );
}

export default Loader;
