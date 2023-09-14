import { CardContent, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { StyledCard, StyledCardHeader } from '../cards';

function StyledForm({ children, title, handleSubmit, hide }) {
  return (
    <StyledCard>
      <StyledCardHeader 
        title={title} 
        {...hide && {
          action: (
            <Tooltip title='Close'>
              <IconButton onClick={hide}>
                <CloseIcon/>
              </IconButton>
            </Tooltip>
          )
        }}
      />
      <CardContent>
        <form onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '3vh',
          marginBottom: '10vh' 
        }}>
          {children}
        </form>
      </CardContent>
    </StyledCard>
  );
}

export default StyledForm;
