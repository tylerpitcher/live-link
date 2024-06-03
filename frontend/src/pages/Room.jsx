import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import { useEffect } from 'react';

import Header from '../components/base/Header';
import useUserStore from '../stores/userStore';
import VideoPanel from '../components/videos/VideoPanel';
import StyledAlert from '../components/base/StyledAlert';
import Center from '../components/base/Center';
import Loader from '../components/base/Loader';
import { getContext, ROOM } from '../operations';

function Room() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { room } = useParams();

  const { loading, error } = useQuery(ROOM, {
    variables: { room },
    pollInterval: 10000,
    ...getContext(user?.token),
  });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (loading) return (
    <Center>
      <Loader/>
    </Center>
  );

  if (error) return (
    <Center>
      <StyledAlert severity='error'>{error.message}</StyledAlert>
      <Header transparent/>
    </Center>
  );

  return (
    <Box>
      <VideoPanel roomName={room}/>
      <Header transparent/>
    </Box>
  );
}

export default Room;
