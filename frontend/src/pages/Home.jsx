import { Box, Button, CardContent } from '@mui/material';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { StyledCard, StyledCardHeader } from '../components/cards';
import CreateRoomModal from '../components/modals/CreateRoomModal';
import { getContext, USER_ROOMS } from '../operations';
import Header from '../components/base/Header';
import Loader from '../components/base/Loader';
import useUserStore from '../stores/userStore';
import { RoomsList } from '../components/lists';

function Home() {
  const [show, setShow] = useState(false);
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(USER_ROOMS, {
    ...user && { pollInterval: 10000 },
    ...getContext(user?.token),
  });

  if (loading) return (
    <Box>
      <Header/>
      <Loader/>
    </Box>
  );

  if (error?.networkError.statusCode === 401) {
    setUser();
    localStorage.removeItem('user');
    navigate(`/livelink/login`);
  }

  const ownedRooms = data?.user?.ownedRooms || [];
  const guestRooms = data?.user?.guestRooms || [];

  return (
    <StyledCard>
      <Header/>
      {show && <CreateRoomModal hide={() => setShow(false)}/>}
      <StyledCardHeader 
        title='Rooms'
        action={
          <Button onClick={() => setShow(true)}>Create Room</Button>
        }
      />
      <CardContent>
        <RoomsList ownedRooms={ownedRooms} guestRooms={guestRooms}/>
      </CardContent>
    </StyledCard>
  );
}

export default Home;
