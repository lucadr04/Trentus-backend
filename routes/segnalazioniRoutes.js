const express = require('express');
const router = express.Router();

// Controllers
const { getForm, generaForm } = require('../controllers/formController');
const { compilaForm, getCommenti } = require('../controllers/segnalazioneController');
const { graficoTorta, graficoLinee } = require('../controllers/graphsController');

// Middleware
const { checkRuolo, usaToken, checkServizioId, CheckDirittiServizio } = require('../middleware/authMiddleware');

router.get('/form', checkServizioId, async (req, res) => {
  // #swagger.description = 'Restituisce la form di segnalazione compilabile per un servizio'
  /* #swagger.responses[200] = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/Servizio/properties/Form"
          }
        }           
      }
    }   
  */
  getForm(req, res);
});

router.post('/form', checkServizioId, usaToken, checkRuolo(['gds','SuperAdmin']), CheckDirittiServizio, async (req, res) => {
  // #swagger.description = 'Genera la form di segnalazione compilabile per un servizio'
  // #swagger.security = [{ "BearerAuth": ['gds','SuperAdmin'] }]
  /* #swagger.requestBody = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/Servizio/properties/Form"
          }
        }           
      }
    }   
  */
  generaForm(req, res);
});

router.post('/compila', checkServizioId, usaToken, checkRuolo(['utente']), async (req, res) => {
  // #swagger.description = 'Salva i dati del form di segnalazione del servizio compilato dall'utente'
  // #swagger.security = [{ "BearerAuth": ['utente'] }]
  /* #swagger.requestBody = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/Segnalazione"
          }
        }           
      }
    }   
  */
  compilaForm(req, res);
});

router.get('/commenti', checkServizioId, async (req, res) => {
  // #swagger.description = 'Restituisce i commenti delle segnalazioni di un servizio'
  /* #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Segnalazione/properties/utente_id",
              $ref: "#/components/schemas/Segnalazione/properties/Commento"
            }
          }
        }           
      }
    }   
  */
  getCommenti(req, res);
});

// Restituisce dati per la creazione del grafico di frequenza segnalazioni
router.get('/istogramma', checkServizioId, async (req, res) => {
  // #swagger.description = 'Restituisce dati per la creazione del grafico di frequenza segnalazioni'
  /* #swagger.responses[200] = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/Segnalazione/properties/Grafico"
          }
        }           
      } 
    }   
  */
  graficoLinee(req, res)
});

router.get('/areogramma', checkServizioId, async (req, res) => {
  // #swagger.description = 'Restituisce dati per la creazione del grafico di problemi riscontrati'
  /* #swagger.responses[200] = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/Segnalazione/properties/Grafico"
          }
        }           
      }
    }   
  */
  graficoTorta(req, res)
});

module.exports = router;