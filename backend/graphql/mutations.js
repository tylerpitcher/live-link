const { GraphQLNonNull, GraphQLString, GraphQLObjectType, GraphQLList, GraphQLBoolean } = require('graphql');

const { ensureRoomExists, createRoom, updateRoom } = require('../controllers/roomControllers');
const { RoomType } = require('./types');

const roomMutations = {
  ensureRoomExists: {
    type: RoomType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: ensureRoomExists,
  },
  createRoom: {
    type: RoomType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      guests: { 
        type: GraphQLList(GraphQLString),
        defaultValue: [],
      },
    },
    resolve: createRoom,
  },
  updateRoom: {
    type: RoomType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
      guests: { type: GraphQLNonNull(GraphQLList(GraphQLString)) },
    },
    resolve: updateRoom,
  },
};

module.exports = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...roomMutations,
  },
});
