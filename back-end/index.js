const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

const auth = require('./routers/auth');
const disciplina = require('./routers/disciplina');
const projeto = require('./routers/projeto');
const grupo = require('./routers/grupo');
const formulario = require('./routers/formulario');
const error = require('./middlewares/error');

const app = express();

// setup middlewares

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({extended:false}));

// api

app.use(express.static('../'));

app.use('/api/v1/auth', auth);
app.use('/api/v1/disciplina', disciplina);
app.use('/api/v1/projeto', projeto);
app.use('/api/v1/grupo', grupo);
app.use('/api/v1/formulario', formulario);
app.use(error);

app.use('/', (req, res) => res.redirect('/front-end/View/Login.html'));
// docs

/*
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, _ => console.log(`Escutando em ${PORT}`));
