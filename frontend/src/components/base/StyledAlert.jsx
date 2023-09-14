import { Alert, Grow, styled } from '@mui/material';

const StyledAlert = styled(Alert)({
  backgroundColor: 'transparent',
});

function FadeAlert(props) {
  return (
    <Grow timeout={500} in>
      <StyledAlert {...props}/>
    </Grow>
  );
}

export default FadeAlert;
