import { ListItemButton, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

import StyledList from './StyledList';

function StyledLinkList({ items }) {
  return (
    <StyledList items={items.map((item) => (
      <ListItemButton component={Link} to={item.to} key={item.text}>
        <ListItemText>{item.text}</ListItemText>
      </ListItemButton>
    ))}/>
  );
}

export default StyledLinkList;
