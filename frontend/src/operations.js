import { gql } from '@apollo/client';

function getContext(token) {
  return {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

const USER_ROOMS = gql`
  query GetUserRooms {
    user {
      name
      ownedRooms {
        name
        whitelist
        guests {
          name
        }
      }
      guestRooms {
        name
      }
    }
  }
`;

const ROOM = gql`
  query GetRoom($room: String!) {
    room(name: $room) {
      name
      owner {
        name
      }
      whitelist
      guests {
        name
      }
    }
  }
`;

const ENSURE_ROOM_EXISTS = gql`
  mutation EnsureRoomExists($name: String!) {
    ensureRoomExists(name: $name) {
      name
    }
  }
`;

const CREATE_ROOM = gql`
  mutation CreateRoom($name: String!, $guests: [String]!) {
    createRoom(name: $name, guests: $guests) {
      name
    }
  }
`;

const UPDATE_ROOM = gql`
  mutation UpdateRoom($name: String!, $guests: [String]!) {
    updateRoom(name: $name, guests: $guests) {
      name
    }
  }
`;

export { getContext, USER_ROOMS, ROOM, ENSURE_ROOM_EXISTS, CREATE_ROOM, UPDATE_ROOM };
