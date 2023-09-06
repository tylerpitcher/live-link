const { GraphQLObjectType } = require('graphql');

const { UserType } = require('./types');

const userQueries = {
  user: {
    type: UserType,
    resolve: (parent, args, context) => context.user,
  },
};

module.exports = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...userQueries,
  },
});
