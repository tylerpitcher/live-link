import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';

import Header from '../components/base/Header';
import useUserStore from '../stores/userStore';
import VideoPanel from '../components/videos/VideoPanel';
import StyledAlert from '../components/base/StyledAlert';
import Center from '../components/base/Center';
import Loader from '../components/base/Loader';
import { getContext, ROOM } from '../operations';

function Room() {
  const { user } = useUserStore();
  const { room } = useParams();

  const { loading, error } = useQuery(ROOM, {
    variables: { room },
    ...getContext(user?.token),
  });

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
