const express = require('express');
const router = express.Router();
const multer = require('multer');
const {resizeImage, upload} = require('../middleware/imageMiddleware.js');



// Controllers
const { validaCredenziali } = require('../controllers/gdsController');
const { creaRichiesta } = require('../controllers/richiestaGdSController');

// Middleware 
const { usaToken, checkRuolo, CheckDirittiServizio } = require('../middleware/authMiddleware');

// Routes

// Login Route
router.post('/login', async (req, res) => {
  // #swagger.description = 'Login GdS'
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
  validaCredenziali(req, res);
});

// Registration Route (upload image)
router.post('/registrazione', upload.single('foto'), resizeImage, async (req, res) => {
  // #swagger.description = 'Invia una richiesta di registrazione per un GdS'
  /* #swagger.requestBody = {
      content: {
        "application/json": {
          schema:{
            $ref: "#/components/schemas/RichiestaGdS"
          }
        }           
      }
    }   
  */
  // Now you can handle the 'foto' file here and save it in the database.
  creaRichiesta(req, res);
});

// Get the service associated with the GdS
router.get('/servizio', usaToken, checkRuolo(['gds']), async (req, res) => {
  // #swagger.description = 'Restituisce il servizio associato al GdS'
  // #swagger.security = [{ "BearerAuth": ['gds'] }]
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
  return res.status(200).json({ servizio_id: req.user.servizio_id });
});

module.exports = router;
