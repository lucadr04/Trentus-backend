const express = require('express');
const router = express.Router();

// Controllers
const { creaAvviso, getAvvisi, getAvvisoById } = require('../controllers/avvisoController');

// Middleware
const { checkRuolo, usaToken, checkServizioId, CheckDirittiServizio } = require('../middleware/authMiddleware');

router.get('/', checkServizioId, async (req, res) => {
  // #swagger.description = 'Restituisce tutti gli avvisi'
  /* #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Avviso"
            }
          }
        }           
      }
    }   
  */
  getAvvisi(req, res)
});

router.post('/', usaToken, checkServizioId, checkRuolo(['gds']), CheckDirittiServizio, async (req, res) => {
  // #swagger.description = 'Crea un avviso e invia una mail a tutti gli utenti interessati'
  // #swagger.security = [{ "BearerAuth": ['gds'] }]
  /* #swagger.requestBody = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/Avviso"
          }
        }           
      }
    }   
  */
  creaAvviso(req, res);
});

router.get('/:avviso_id', checkServizioId, async (req, res) => {
  // #swagger.description = 'Restituisce un avviso in base all'id'
  /* #swagger.responses[200] = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/Avviso"
          }
        }           
      }
    }   
  */
  getAvvisoById(req, res)
});

module.exports = router;