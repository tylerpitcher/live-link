
import { ListItemText, IconButton, ListItemButton, List, TextField, InputAdornment, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import GroupsIcon from '@mui/icons-material/Groups';
import EditIcon from '@mui/icons-material/Edit';
import { useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { getContext, ENSURE_ROOM_EXISTS } from '../../operations';
import useUserStore from '../../stores/userStore';
import ModifyRoomModal from '../modals/ModifyRoomModal';
import StyledListItem from './StyledListItem';

const textInputProps = {
  startAdornment: <InputAdornment position='start'><GroupsIcon /></InputAdornment>,
};

function JoinForm() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  const [ensureRoomExists] = useMutation(ENSURE_ROOM_EXISTS, {
    ...getContext(user?.token),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    ensureRoomExists({ variables: { name: input } })
      .then(() =>  { setLoading(true); navigate(`/room/${input}`) })
      .catch(() => setLoading(false));
  };

  return (
    <form 
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(1) }} 
    >
      <TextField
        variant='outlined'
        InputProps={textInputProps}
        placeholder='Room Name' 
        onChange={(e) => setInput(e.target.value)}  
        disabled={loading}
        value={input}
      />
      <LoadingButton 
        type='submit'
        variant='contained' 
        disabled={!input.length} 
        loading={loading}
      >
        Join
      </LoadingButton>
    </form>
  );
}

function RoomsList({ title, ownedRooms, guestRooms }) {
  const [room, setRoom] = useState();

  if (!ownedRooms.length && !guestRooms.length) return (
    <JoinForm/>
  );

  return (
    <>
      <JoinForm/>

      <List subheader={title} sx={{ maxHeight: '50vh', overflowY: 'scroll' }} variant='outlined'>
        {room && <ModifyRoomModal room={room} hide={() => setRoom()}/>}
        {ownedRooms.map((room) => (
          <StyledListItem
            key={room.name}
            disablePadding
            secondaryAction={
              <IconButton onClick={() => setRoom(room)}><EditIcon/></IconButton>
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
    </>
  );
}

export default RoomsList;
