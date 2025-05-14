const express = require('express');
const router = express.Router();
const fs = require('fs');
const {resizeImage, upload} = require('../middleware/imageMiddleware.js');

// Controllers
const { getServizi, getServizio, modificaServizio, preferito } = require('../controllers/servizioController');
const { classifica } = require('../controllers/segnalazioneController');
// const serviziController = require(process.cwd()+'/controllers/servizi/serviziController');

// Middleware
const { checkServizioId, SIDSave, usaToken, checkRuolo, CheckDirittiServizio } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  // #swagger.description = 'Restituisce tutti i servizi'
  /* #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Servizio"
            }
          }
        }           
      }
    }   
  */
  getServizi(req,res);
});

router.get('/classifica', SIDSave, async (req,res)=>{
  // #swagger.description = 'Classifica dei servizi più problematici'
  /* #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              "servizio_id": {
                "type": "string",
                "description": "Servizio_id"
              },
              "segnalazioni": {
                "type": "int",
                "description": "nnumero ci segnalazioni del servizio"
              }
            }
          }
        }           
      }
    }   
  */
  classifica(req,res);
});

router.get('/:servizio_id', SIDSave, checkServizioId, async (req,res)=>{
  // #swagger.description = 'Restituisce servizio in base al suo id'
  /* #swagger.responses[200] = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/Servizio"
          }
        }           
      }
    }   
  */
  getServizio(req,res);
});

router.post('/:servizio_id/preferito', SIDSave, usaToken, checkServizioId, checkRuolo(['utente']), async (req,res)=>{
  // #swagger.description = 'Servizio salvato nei preferiti dell'utente'
  // #swagger.security = [{ "BearerAuth": ['utente'] }]  
  preferito(req,res);
});

router.post('/:servizio_id/modifica', SIDSave, usaToken, checkServizioId, checkRuolo(['gds','SuperAdmin']), CheckDirittiServizio, upload.single('foto'),resizeImage, async (req,res)=>{
  // #swagger.description = 'Servizio ON'
  // #swagger.security = [{ "BearerAuth": ['gds','SuperAdmin'] }]  
  modificaServizio(req,res);
});

module.exports = router;