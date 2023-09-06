const { graphqlHTTP } = require('express-graphql');
const express = require('express');

const authHandler = require('../middleware/authHandler');
const schema = require('../graphql');

const router = express.Router();

router.use(authHandler);
router.use(graphqlHTTP({ schema }));

module.exports = router;
