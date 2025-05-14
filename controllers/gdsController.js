const mongoose = require('mongoose');

// Model
const GdS = require('../models/gds.model');

// Middleware
const { generaToken } = require('../middleware/authMiddleware');
 
// Valida le credenziali del gds a login
exports.validaCredenziali = async (req,res) => {
  const { email, password } = req.body;
  try {
    const gds = await GdS.findOne({ email });
    if (!gds) {
      return res.status(400).json({ message: 'GdS inesistente' });
    }

    const isMatch = await gds.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'passwordErrata' });
    }
    const token = generaToken(gds,'gds');
    res.json({ message: 'Login effettuato', token });
  } catch (err) {
    res.status(500).json({ message: 'Errore del server', error: err.message });
  }
}
