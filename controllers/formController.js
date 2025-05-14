const mongoose = require('mongoose');

// Model
const Servizio = require('../models/servizio.model');

// Crea una form compilabile per rilasciare una segnalazione
exports.generaForm = async (req,res) => {
  //recupero l'array di opzioni (stringhe)
  const { opzioni } = req.body;
  if(!opzioni){
    return res.status(400).json({message: "Opzioni non presenti; impossibile creare la form"});
  }

  try{
    let servizio = await Servizio.findById(req.servizio_id);
    // creo le opzioni (se esistono già le sovrascrivo)
    const opzioniForm = opzioni.map(testo => ({
      opzione: testo
    }));
    // ora lo metto nel campo 'opzioniForm' del servizio
    servizio.form = opzioniForm;
    // infine lo salvo
    await servizio.save();
    return res.status(201).json({message: 'Form creata con successo'});
  }
  catch(err){
    console.log(err.message);
    return res.status(500).json({message: 'Errore del server'});
  }
}

// Restituisce una form
exports.getForm = async (req,res) => {
  // ottengo la form di uno specifico servizio
  try{
    let form = await Servizio.findById(req.servizio_id).select("form");
    if(!form){
      return res.status(404).json({message:'Form non trovata'});
    }
    return res.status(200).json(form);
  }
  catch(err){
    return res.status(500).json({message:'Errore del server'});
  }
}