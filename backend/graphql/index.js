const { GraphQLSchema } = require('graphql');

const mutation = require('./mutations');
const query = require('./queries');

module.exports = new GraphQLSchema({
  mutation,
  query,
});
