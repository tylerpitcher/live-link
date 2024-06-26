import { useMutation } from '@apollo/client';

import { getContext, UPDATE_ROOM, USER_ROOMS } from '../../operations';
import useUserStore from '../../stores/userStore';
import RoomModal from './RoomModal';

function ModifyRoomModal({ room, hide }) {
  const { user } = useUserStore();

  const [updateRoom] = useMutation(UPDATE_ROOM, {
    ...getContext(user?.token),
    refetchQueries: [{ 
      query: USER_ROOMS,
      ...getContext(user?.token),
    }],
  });

  return (
    <RoomModal
      modify
      title='Update Room' 
      msg='Modify existing room.'
      severity='info'
      room={room}
      mutation={updateRoom}
      hide={hide}
    />
  );
}

export default ModifyRoomModal;
