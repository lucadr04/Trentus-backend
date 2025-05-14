const express = require('express');
const router = express.Router();

// Controllers
const { getSondaggi, creaSondaggio, getSondaggioById } = require('../controllers/sondaggioController');
const { getFeedback, creaFeedback } = require('../controllers/feedbackController');

// Middleware
const { checkRuolo, usaToken, checkServizioId, CheckDirittiServizio } = require('../middleware/authMiddleware');

router.get('/', checkServizioId, usaToken, checkRuolo(['gds', 'utente']), async (req, res) => {
  // #swagger.description = 'Restituisce i sondaggi compilabili del servizio'
  // #swagger.security = [{ "BearerAuth": ['gds', 'utente'] }]
  /* #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Sondaggio"
            }
          }
        }           
      }
    }   
  */
  getSondaggi(req, res);
});

router.post('/', checkServizioId, usaToken, checkRuolo(['gds']), CheckDirittiServizio, async (req, res) => {
  // #swagger.description = 'Crea un sondaggio'
  // #swagger.security = [{ "BearerAuth": ['gds'] }]
  /* #swagger.requestBody = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/Sondaggio"
          }
        }           
      }
    }   
  */
  creaSondaggio(req, res);
});

router.get('/:sondaggio_id', checkServizioId, usaToken, checkRuolo(['gds', 'utente']), async (req, res) => {
  // #swagger.description = 'Restituisce un sondaggio'
  // #swagger.security = [{ "BearerAuth": ['gds', 'utente'] }]
  /* #swagger.responses[200] = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/Sondaggio"
          }
        }           
      }
    }   
  */
  getSondaggioById(req, res);
});

router.post('/:sondaggio_id', checkServizioId, usaToken, checkRuolo(['utente']), async (req, res) => {
  // #swagger.description = 'Rilascia un feedback'
  // #swagger.security = [{ "BearerAuth": ['utente'] }]
  /* #swagger.requestBody = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/Feedback"
          }
        }           
      }
    }   
  */
  creaFeedback(req, res);
});

router.get('/:sondaggio_id/risultati', checkServizioId, usaToken, checkRuolo(['gds']), CheckDirittiServizio, async (req, res) => {
  // #swagger.description = 'Restituisce i risultati di un sondaggio'
  // #swagger.security = [{ "BearerAuth": ['gds'] }]
  /* #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Feedback"
            }
          }
        }           
      }
    }   
  */
  getFeedback(req, res);
});

module.exports = router;