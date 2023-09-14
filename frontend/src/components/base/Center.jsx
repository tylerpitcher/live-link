import { Grid } from '@mui/material';

function Center({ children }) {
  return (
    <Grid 
      position='fixed' 
      justifyContent='center' 
      alignContent='center' 
      sx={{ height: 1 }} 
      container
    >
      <Grid md={5} sm={8} xs={11} item>
        {children}
      </Grid>
    </Grid>
  );
}

export default Center;
