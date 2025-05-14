const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Model
const Utente = require('../models/utente.model');

// Middleware
const { generaToken } = require('../middleware/authMiddleware');

// Verifica le credenziali del SuperAdmin
exports.verificaCredenziali = async (req,res) => {
  const { email, password } = req.body;

  try {
    const user = await Utente.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email non corretta' });
    }
    if (!user.checkSuperAdmin) {
      return res.status(400).json({ message: 'You shouldn\'t be here...' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password errata' });
    }
    let token = generaToken(user,'SuperAdmin'); //genero il token
      
    res.json({ message: 'Login effettuato', token });
  } catch (err) {
    res.status(500).json({ message: 'Errore del server', error: err.message });
  }
}