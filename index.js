const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const error = require('./errors/erros');

const app = express();

// setup middlewares

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

// api

app.use(error);
// docs

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;

app.listen(PORT, _ => console.log(`Escutando em ${PORT}`));
