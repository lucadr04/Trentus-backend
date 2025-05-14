// Imposatzione Express 
const express = require('express');
const app = express();
const cors = require('cors');

//rendere accessibile pubblicamente le immagini
app.use(express.static("public"));

//cors
app.use(cors());

// Impostazione Database
const db = require('./models/db');

// Documentation viewer
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', /*#swagger.ignore = true*/ swaggerUi.setup(swaggerDocument)); 

const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');

// Prelevo le routes
const adminRoutes = require('./routes/adminRoutes');
const avvisiRoutes = require('./routes/avvisiRoutes');
const gdsRoutes = require('./routes/gdsRoutes');
const segnalazioniRoutes = require('./routes/segnalazioniRoutes');
const serviziRoutes = require('./routes/serviziRoutes');
const sondaggiRoutes = require('./routes/sondaggiRoutes');
const utenteRoutes = require('./routes/utenteRoutes');
const indexRouter = require('./routes/index');

// Impostazione della view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Cose dell'express-generator qui
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//impostazione frontend per il deploy
app.use('/', express.static(process.env.FRONTEND || 'static'));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname,process.env.FRONTEND,'index.html'));
// })
app.use('/', indexRouter);

// Impostazione delle routes (l'ordinamento è importante)
const { SIDSave } = require('./middleware/authMiddleware');
app.use('/servizi/:servizio_id/avvisi', SIDSave, avvisiRoutes);
app.use('/servizi/:servizio_id/sondaggi', SIDSave, sondaggiRoutes);
app.use('/servizi/:servizio_id/segnalazioni', SIDSave, segnalazioniRoutes);
app.use('/gds', gdsRoutes);
app.use('/utente', utenteRoutes);
app.use('/servizi', serviziRoutes);
app.use('/controlpanel', adminRoutes);

// Gestore errore 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Gestore degli errori (automatico)
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Apro la connessione in locale
const server = app.listen(process.env.PORT, function () {
  console.log("App attiva sulla porta " + process.env.PORT);
});

// Rotte attive
const listEndpoints = require('express-list-endpoints');
console.log(listEndpoints(app));

module.exports = app;
