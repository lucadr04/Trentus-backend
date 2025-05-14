const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Model
const Utente = require('../models/utente.model');

// Middleware
const { generaToken } = require('../middleware/authMiddleware');

// Crea un utente
exports.creaUtente = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Verifica se l'utente esiste già
    const existingUser = await Utente.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email già registrata' });
    }

    // Hash della password con un "salt" di 10 round
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea il nuovo utente con la password hashata
    const user = new Utente({ 
      email, 
      passwordHash: hashedPassword, // Salva l'hash della password
    });

    // Salva l'utente nel database
    await user.save();
    res.status(201).json({ message: 'Utente registrato con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore del server', error: err.message });
  }
}

// Verifica le credenziali dell'utente
exports.verificaCredenziali = async (req,res) => {
  const { email, password } = req.body;

  try {
    const user = await Utente.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email non corretta' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password errata' });
    }
    let token = generaToken(user,'utente'); //genero il token
      
    res.json({ message: 'Login effettuato', token });
  } catch (err) {
    res.status(500).json({ message: 'Errore del server', error: err.message });
  }
}

// Restituisce i preferiti dell'utente
exports.getPreferiti = async (req,res) => {
  id = req.user.id;
  try {
    const user = await Utente.findById(id).select('preferiti');
    console.log(user.preferiti);
    res.status(200).json({preferiti: user.preferiti});
  } catch (err) {
    res.status(500).json({ message: 'Errore del server', error: err.message });
  }
}

// Restituisce un utente
exports.getUtente = async (req,res) => {
  //trovo l'utente con l'id
  id = req.user.id;
  const user = await Utente.findById(id).select('_id email preferiti');
  console.log(user);
  return res.status(200).json(user);
}