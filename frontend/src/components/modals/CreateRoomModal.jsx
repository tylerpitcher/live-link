import { useMutation } from '@apollo/client';

import { getContext, CREATE_ROOM, USER_ROOMS } from '../../operations';
import useUserStore from '../../stores/userStore';
import RoomModal from './RoomModal';

function CreateRoomModal({ hide }) {
  const { user } = useUserStore();

  const [createRoom] = useMutation(CREATE_ROOM, {
    ...getContext(user?.token),
    refetchQueries: [{ 
      query: USER_ROOMS,
      ...getContext(user?.token),
    }],
  });

  return (
    <RoomModal
      title='Create Room' 
      msg='Create a new room with a unique name.'
      mutation={createRoom}
      hide={hide}
    />
  );
}

export default CreateRoomModal;
