import { Box, CardContent } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { StyledCard, StyledCardHeader } from '../components/card';
import StyledLinkList from '../components/list/StyledButtonList';
import Header from '../components/base/Header';
import Loader from '../components/base/Loader';
import useUserStore from '../stores/userStore';

const query = gql`
  query getUserRooms {
    user {
      ownedRooms {
        name
      }
      guestRooms {
        name
      }
    }
  }
`;

function Home() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(query, {
    pollInterval: 10000,
    context: {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    },
  });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  if (loading) return (
    <Box>
      <Header/>
      <Loader/>
    </Box>
  );

  const rooms = data.user.ownedRooms.concat(data.user.guestRooms);

  return (
    <StyledCard>
      <Header/>
      <StyledCardHeader title='Rooms'/>
      <CardContent>
        <StyledLinkList items={rooms.map((room) => ({ text: room.name, to: `/room/${room.name}` }))}/>
      </CardContent>
    </StyledCard>
  );
}

export default Home;
