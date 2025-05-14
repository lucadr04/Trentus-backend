const mongoose = require('mongoose');

// Model
const Sondaggio = require('../models/sondaggio.model');

// Restituisce i sondaggi di uno specifico servizio
exports.getSondaggi = async (req,res) => {
  try{
    let sondaggi = await Sondaggio.find({ servizio_id: req.servizio_id });
    if(!sondaggi){
      return res.status(404).json({message:'Sondaggi non trovati'});
    }
    return res.status(200).json(sondaggi);
  }
  catch(err){
    return res.status(500).json({message:'Errore del server'});
  }
}

// Restituisce un sondaggio specifico
exports.getSondaggioById = async (req,res) => {
  try{
    let sondaggio = await Sondaggio.findById(req.params.sondaggio_id);
    if(!sondaggio){
      return res.status(404).json({message:'Sondaggi non trovati'});
    }
    if(sondaggio.servizio_id != req.servizio_id){
      return res.status(400).json({message:'Il sondaggio non è del servizio corretto'});
    }
    return res.status(200).json(sondaggio);
  }
  catch(err){
    return res.status(500).json({message:'Errore del server'});
  }
}

// Crea un sondaggio per uno specifico servizio
exports.creaSondaggio = async (req,res) => {
  //recupero l'array di opzioni (stringhe)
  const { titolo, opzioni } = req.body;
  if(!opzioni){
    return res.status(400).json({message: "La form non è stata compilata"});
  }
  try {
    const opzioniOggetto = opzioni.map(opz => {
      const { type, ...rest } = opz;
      switch (type) {
        case 'singola':
          return { type: 'singola', opzione: rest.opzione };
        case 'raccolta':
          const opzioniRaccolta = rest.opzioni.map(ops => {
            return { opzione: ops.opzione };
          });
          return { type: 'raccolta', domanda: rest.domanda, opzioni: opzioniRaccolta, tipo: rest.tipo };
        case 'aperta':
          return { type: 'aperta', domanda: rest.domanda };
        default:
          throw new Error(`Tipo di opzione non valido: ${type}`);
      }
    });
    const sondaggio = new Sondaggio({
      titolo: titolo,
      corpo: opzioniOggetto,
      servizio_id: req.servizio_id
    });
    // infine lo salvo
    const help = await sondaggio.save({ validateBeforeSave: false });
    console.log(help);
    return res.status(201).json({message: 'Sondaggio creato con successo'});
  }
  catch(err){
    console.log(err.message);
    return res.status(500).json({message: 'Errore del server'});
  }
}