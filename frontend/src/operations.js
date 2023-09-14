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
      guests {
        name
      }
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

export { getContext, USER_ROOMS, ROOM, CREATE_ROOM };
