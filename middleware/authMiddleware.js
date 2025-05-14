const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Preleva la chiave 
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET

// Model
const Servizio = require('../models/servizio.model');

// Genera un token JWT dalla durata di 3h
exports.generaToken = (user, ruolo) => {
  const payload = { 
    id: user._id, 
    email: user.email, 
    role: ruolo 
  };
  
  // Aggiungi il servizio al payload se il ruolo è "gds"
  if (ruolo === 'gds') {
    payload.servizio_id = user.servizio; // Assumi che "servizio" sia una proprietà di "user"
  }

  return jwt.sign(payload, SECRET_KEY, { expiresIn: '3h' });
};

// Verifico la correttezza di un token JWT e ne salvo i dati
exports.usaToken = (req, res, next) => {
  const token = req.headers['authorization'];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Aggiunge i dati dell'utente alla richiesta
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token non valido' });
  }
};

// Funzione per mantenere il :service_id tra le routes
exports.SIDSave = (req, res, next) => {
  req.servizio_id = req.params.servizio_id;
  next();
};

// Verifico l'esistenza del servizio
exports.checkServizioId = (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.servizio_id)){
    return res.status(400).json({ message: 'Servizio inesistente' });
  }
  next();
}

// Controlla che il ruolo dell'utente che cerca di accedere sia quello specificato
exports.checkRuolo = (roles) => { 
  return (req, res, next) => {
    if (req.user.role == "SuperAdmin") {}
    else if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accesso negato. Non hai i permessi per questa azione.' });
    }
    next(); // Passa al prossimo middleware o al controller della rotta
  };
};

// Verifico che il GdS sia il possessore del servizio utilizzato
exports.CheckDirittiServizio = async (req, res, next) => {
  if(req.user.role !== "SuperAdmin"){
    console.log(req.user.servizio_id)
    console.log(req.servizio_id)
    if (req.user.servizio_id != req.servizio_id) {
      return res.status(403).json({ message: 'Accesso negato. Non gestisci questo servizio.' });
    }
  }
  next();
};