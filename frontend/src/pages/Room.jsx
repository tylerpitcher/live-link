import { useNavigate, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { Box, Grid } from '@mui/material';
import { useEffect } from 'react';

import Header from '../components/base/Header';
import useUserStore from '../stores/userStore';
import VideoPanel from '../components/video/VideoPanel';
import Loader from '../components/base/Loader';

const query = gql`
  query getRoom($room: String!) {
    room(name: $room) {
      name
      owner {
        name
      }
      guests {
        name
      }
    }
  }
`;

function Room() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { room } = useParams();

  const { loading, error, data } = useQuery(query, {
    variables: { room },
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
    <Grid position='fixed' justifyContent='center' alignItems='center' sx={{ height: 1 }} container>
      <Grid md={5} sm={8} xs={11} item>
        <Loader/>
      </Grid>
    </Grid>
  );

  return (
    <Box>
      <VideoPanel roomName={room}/>
      <Header transparent/>
    </Box>
  );
}

export default Room;
