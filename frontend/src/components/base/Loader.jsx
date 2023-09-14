import { Fade, LinearProgress } from '@mui/material';

function Loader() {
  return (
    <Fade timeout={2000} in>
      <LinearProgress/>
    </Fade>
  );
}

export default Loader;
