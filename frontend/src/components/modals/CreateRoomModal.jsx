import { useMutation } from '@apollo/client';

import { getContext, CREATE_ROOM, USER_ROOMS } from '../../operations';
import useUserStore from '../../stores/userStore';
import RoomModal from './RoomModal';

function CreateRoomModal({ hide }) {
  const { user } = useUserStore();

  const [createRoom] = useMutation(CREATE_ROOM, {
    ...getContext(user?.token),
    update(cache, { data: { createRoom } }) {
      const { user } = cache.readQuery({ query: USER_ROOMS });

      cache.writeQuery({
        query: USER_ROOMS,
        data: {
          user: {
            name: String(user?.name),
            ownedRooms: user?.ownedRooms.concat(createRoom) || [createRoom],
            guestRooms: user?.guestRooms || [],
            __typename: 'User',
          },
        },
      });
    },
  });

  return (
    <RoomModal
      title='Create Room' 
      msg={user ? 'Create a new room with a unique name.' : 'Unauthenticated user rooms are temporary.'}
      severity={user ? 'info' : 'warning'}
      mutation={createRoom}
      hide={hide}
    />
  );
}

export default CreateRoomModal;
