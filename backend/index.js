const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/api/graphql', require('./routes/graphqlRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.listen(process.env.PORT || 8000);
