const express = require('express');
const router = express.Router();

// Controllers
const { creaUtente, verificaCredenziali, getPreferiti, getUtente } = require('../controllers/utenteController');
// const utentiController = require(process.cwd()+'/controllers/utente/utenteController');

// Middleware 
const { usaToken, checkRuolo } = require('../middleware/authMiddleware');

router.post('/login', async (req, res) => {
  // #swagger.description = 'Login Utente'
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

router.get('/', usaToken, checkRuolo(['utente']), (req, res) => {
  // #swagger.description = 'Restituisce i dati di un utente'
  // #swagger.security = [{ "BearerAuth": ['utente'] }]
  /* #swagger.responses[200] = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/Utente"
          }
        }           
      }
    }   
  */
  getUtente(req,res);
});

router.post('/registrazione', async (req, res) => {
  // #swagger.description = 'Registra un nuovo utente'
  /* #swagger.requestBody = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/Utente"
          }
        }           
      }
    }   
  */
  creaUtente(req,res);
});

router.get('/preferiti', usaToken, checkRuolo(['utente']), (req,res)=>{
  // #swagger.description = 'Restituisce i preferiti di un utente'
  // #swagger.security = [{ "BearerAuth": ['utente'] }]
  /* #swagger.responses[200] = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/Utente/properties/Preferiti"
          }
        }           
      }
    }   
  */
  getPreferiti(req,res);
});

module.exports = router;