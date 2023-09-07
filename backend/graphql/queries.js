const { GraphQLObjectType, GraphQLNonNull, GraphQLString } = require('graphql');

const { getRoom } = require('../controllers/roomControllers');
const { UserType, RoomType } = require('./types');

const userQueries = {
  user: {
    type: UserType,
    resolve: (parent, args, context) => context.user,
  },
};

const roomQueries = {
  room: {
    type: RoomType,
    args: {
      name: { type: GraphQLNonNull(GraphQLString) },
    },
    resolve: getRoom,
  },
};

module.exports = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...userQueries,
    ...roomQueries,
  },
});
