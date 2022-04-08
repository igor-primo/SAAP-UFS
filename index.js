const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

const auth = require('./routers/auth');
const error = require('./middlewares/error');

const app = express();

// setup middlewares

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({extended:false}));

// api

app.use('/api/v1/auth', auth);
app.use(error);

// docs

/*
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, _ => console.log(`Escutando em ${PORT}`));
