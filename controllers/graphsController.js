const mongoose = require('mongoose');

// Model
const Segnalazione = require('../models/segnalazione.model');

exports.graficoLinee = async (req, res) => {
  try {
    const limit = new Date();
    limit.setDate(limit.getDate() - 10);
    let servizioId = new mongoose.Types.ObjectId(req.servizio_id);
    let data = await Segnalazione.aggregate([
      {
        // Filtro le segnalazioni negli ultimi 10 giorni e con un servizio specifico
        $match: {
          servizio_id: servizioId,
          createdAt: { $gte: limit },
        },
      },
      {
        // Raggruppo per giorno
        $group: {
          _id: { 
            month: { $month: "$createdAt" }, 
            day: { $dayOfMonth: "$createdAt" } 
          },
          count: { $sum: 1 }, // Conta il numero di segnalazioni
        },
      },
      {
        // Ordino i risultati per data
        $sort: { "_id.month": 1, "_id.day": 1 },
      }
    ]);

  // Formattazione dei dati per comodità
  data = data.map(item => ({
    date: `${item._id.month}-${item._id.day}`,
    count: item.count,
  }));
  
  return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Errore nel recupero grafico", error: error.message });
  }
};

exports.graficoTorta = async (req, res) => {
  try {
    const limit = new Date();
    limit.setDate(limit.getDate() - 2);
    let servizioId = new mongoose.Types.ObjectId(req.servizio_id);
    let data = await Segnalazione.aggregate([
      {
        // Filtro per servizio specifico e segnalazioni degli ultimi 10 giorni
        $match: {
          servizio_id: servizioId,
          createdAt: { $gte: limit },
        },
      },
      {
        // Scompongo l'array "risposte" in documenti singoli
        $unwind: "$risposte",
      },
      {
        // Raggruppo per risposta e conto le occorrenze
        $group: {
          _id: "$risposte", // Il testo della risposta diventa il criterio di raggruppamento
          count: { $sum: 1 }, // Conta quante volte appare questa risposta
        },
      },
      {
        // Calcolo il totale delle risposte
        $group: {
          _id: null,
          total: { $sum: "$count" }, // Totale delle risposte
          details: { $push: { risposta: "$_id", count: "$count" } }, // Salvo i dettagli per calcolare la percentuale
        },
      },
      {
        // Aggiungo la percentuale a ogni risposta
        $unwind: "$details",
      },
      {
        $addFields: {
          "details.percentage": {
            $multiply: [
              { $divide: ["$details.count", "$total"] }, // count / total
              100,
            ],
          },
        },
      },
      {
        // Ristrutturo il risultato
        $replaceRoot: { newRoot: "$details" },
      },
    ]);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Errore nel recupero grafico", error: error.message });
  }
};