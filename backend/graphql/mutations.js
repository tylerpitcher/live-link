const { GraphQLNonNull, GraphQLString, GraphQLObjectType, GraphQLList } = require('graphql');

const { createRoom, updateRoom } = require('../controllers/roomControllers');
const { RoomType } = require('./types');

const roomMutations = {
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
