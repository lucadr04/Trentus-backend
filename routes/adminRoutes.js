const express = require('express');
const router = express.Router();

// Controllers
const { verificaCredenziali } = require('../controllers/adminController');
const { getRichieste, confermaRichiesta } = require('../controllers/richiestaGdSController');
// Middleware 
const { usaToken, checkRuolo } = require('../middleware/authMiddleware');

router.post('/login', async (req, res) => {
  // #swagger.description = 'Login Superadmin'
  // #swagger.security = [{ "BearerAuth": ['SuperAdmin'] }]
  /* #swagger.requestBody = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/Login"
          }
        }           
      }
    }   
  */
  verificaCredenziali(req,res);
});

router.get('/confermagds/lista', usaToken, checkRuolo(['SuperAdmin']), async (req,res)=>{
  // #swagger.description = 'Ottieni richieste di registrazione per un GdS'
  // #swagger.security = [{ "BearerAuth": ['SuperAdmin'] }]
  /* #swagger.response[200] = {
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: "#/components/schemas/RichiestaGdS"
            }
          }
        }           
      }
    }   
  */
  getRichieste(req, res);
});

router.post('/confermagds/:richiesta_id', usaToken, checkRuolo(['SuperAdmin']), async (req,res)=>{
  // #swagger.description = 'Conferma la richiesta di registrazione per un GdS'
  // #swagger.security = [{ "BearerAuth": ['SuperAdmin'] }]
  /* #swagger.response[200] = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/RichiestaGdS"
          }
        }           
      }
    }   
  */
  confermaRichiesta(req, res);
});

module.exports = router;