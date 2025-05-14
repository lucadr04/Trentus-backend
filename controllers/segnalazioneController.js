const mongoose = require('mongoose');

// Model
const Segnalazione = require('../models/segnalazione.model');

exports.compilaForm = async (req,res) => {
  //recupero l'array di opzioni (stringhe)
  const { risposte, commento } = req.body;
  if(!risposte){
    return res.status(400).json({message: "La form non è stata compilata"});
  }
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingSegnalazione = await Segnalazione.findOne({
      utente_id: req.user.id,
      servizio_id: req.servizio_id,
      createdAt: { $gte: today } 
    });

    if (existingSegnalazione) {
      return res.status(400).json({ message: "Hai già compilato una segnalazione oggi." });
    }

    const risposteOggetto = risposte.map(testo => ({
      risposta: testo
    }));
    const segnalazione = new Segnalazione({
      risposte: risposteOggetto,
      commento,
      utente_id: req.user.id,
      servizio_id: req.servizio_id
    });
    // infine lo salvo
    await segnalazione.save();
    return res.status(201).json({message: 'Segnalazione creata con successo'});
  }
  catch(err){
    console.log(err.message);
    return res.status(500).json({message: 'Errore del server'});
  }
}

exports.getCommenti = async (req,res) => {
  try {
    let commenti = await Segnalazione.find({ servizio_id: req.servizio_id }).select("commento utente_id").populate("utente_id", "utente_id email").lean();
    commenti = commenti.filter(comment => comment.commento && comment.commento.trim() !== "");
    return res.status(201).json(commenti);
  }
  catch(err){
    console.log(err.message);
    return res.status(500).json({message: 'Errore del server'});
  }
}

exports.classifica = async (req, res) => {
  try {
    const giorno = new Date();
    giorno.setHours(giorno.getHours() - 24);

    const classifica = await Segnalazione.aggregate([
      {
        $match: { createdAt: { $gte: giorno } } 
      },
      {
        $group: {
          _id: "$servizio_id",
          segnalazioni: { $sum: 1 } 
        }
      },
      {
        $sort: { segnalazioni: -1 } 
      },
      {
        $limit: 5 // Limita il risultato ai primi 5 servizi
      },
      {
        $project: {
          _id: 0,
          servizio_id: "$_id",
          segnalazioni: 1
        }
      }
    ]);

    return res.status(200).json(classifica);
  } catch (error) {
    return res.status(500).json({ message: "Errore nel recupero della classifica", error: error.message });
  }
};

