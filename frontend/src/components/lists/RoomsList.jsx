
import { ListItemText, IconButton, ListItemButton, List, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

import StyledListItem from './StyledListItem';

function RoomsList({ title, ownedRooms, guestRooms }) {
  if (!ownedRooms.length && !guestRooms.length) return (
    <Typography>You have no rooms.</Typography>
  );

  return (
    <List subheader={title} sx={{ maxHeight: '50vh', overflowY: 'scroll' }} variant='outlined'>
      {ownedRooms.map((room) => (
        <StyledListItem
          key={room.name}
          disablePadding
          secondaryAction={
            <IconButton><EditIcon/></IconButton>
          }
        >
          <ListItemButton component={Link} to={`/room/${room.name}`}>
            <ListItemText>{room.name}</ListItemText>
          </ListItemButton>
        </StyledListItem>
      ))}
      {guestRooms.map((room) => (
        <StyledListItem
          key={room.name}
          disablePadding
        >
          <ListItemButton component={Link} to={`/room/${room.name}`}>
            <ListItemText>{room.name}</ListItemText>
          </ListItemButton>
        </StyledListItem>
      ))}
    </List>
  );
}

export default RoomsList;
