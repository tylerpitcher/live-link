import { Card } from '@mui/material';

function StyledCard({ children }) {
  return (
    <Card variant='outlined' sx={{ p: 2 }}>
      { children }
    </Card>
  );
}

export default StyledCard;
