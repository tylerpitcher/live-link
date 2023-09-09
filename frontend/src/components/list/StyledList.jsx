import { List } from '@mui/material';

import StyledListItem from './StyledListItem';

function StyledList({ items }) {
  return (
    <List sx={{ maxHeight: '50vh', overflowY: 'scroll' }}>
      {items.map((item, i) => (
        <StyledListItem key={i} disablePadding>
          {item}
        </StyledListItem>
      ))}
    </List>
  );
}

export default StyledList;
