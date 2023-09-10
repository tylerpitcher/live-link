import { Box, CardContent, Typography } from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { StyledCard, StyledCardHeader } from '../components/cards';
import StyledLinkList from '../components/lists/StyledButtonList';
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
    fetchPolicy: 'no-cache',
    pollInterval: 10000,
    context: {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    },
  });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

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
        {rooms.length 
          ? <StyledLinkList items={rooms.map((room) => ({ text: room.name, to: `/room/${room.name}` }))}/>
          : <Typography>You have no rooms.</Typography>
        }
      </CardContent>
    </StyledCard>
  );
}

export default Home;
