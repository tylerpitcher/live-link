import { CardContent } from '@mui/material';
import { StyledCard, StyledCardHeader } from '../card';

function StyledForm({ children, title, handleSubmit }) {
  return (
    <StyledCard>
      <StyledCardHeader title={title}/>
      <CardContent>
        <form onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '5vh',
          marginBottom: '10vh' 
        }}>
          {children}
        </form>
      </CardContent>
    </StyledCard>
  );
}

export default StyledForm;