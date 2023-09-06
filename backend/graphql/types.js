const { GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql');

const { getRedisKey } = require('../utils/redis');

async function gather(arr, get) {
  const objs = await Promise.all(arr.map((item) => get(item)));
  return objs.filter((item) => item);
}

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    name: { type: GraphQLString },
    ownedRooms: {
      type: GraphQLList(RoomType),
      resolve: (parent) => gather(parent.ownedRooms, (name) => getRedisKey(`room:${name}`)),
    },
    guestRooms: {
      type: GraphQLList(RoomType),
      resolve: (parent) => gather(parent.guestRooms, (name) => getRedisKey(`room:${name}`)),
    },
  }),
});

const RoomType = new GraphQLObjectType({
  name: 'Room',
  fields: () => ({
    type: { type: GraphQLString },
    name: { type: GraphQLString },
    owner: {
      type: UserType,
      resolve: async (parent, _) => {
        return await getRedisKey(`user:${parent.owner}`);
      },
    },
    guests: {
      type: GraphQLList(UserType),
      resolve: (parent) => gather(parent.guests, (name) => getRedisKey(`user:${name}`)),
    },
  }),
});

module.exports = {
  UserType,
  RoomType,
};
