const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Models
const richiestaGdS = require('../models/richiestaGdS.model');
const GdS = require('../models/gds.model');
const { creaServizio } = require('./servizioController');

// Crea una richiesta di accettazione della creazione del gds ed il suo servizio
exports.creaRichiesta = async (req,res) => {
  const { email, password, titolo, azienda, url, descrizione } = JSON.parse(req.body.data);

  console.log(email);

  try {
    // Verifica se il GdS esiste già, devo verificare sia se c'è già un utente registrato, sia se c'è una richiesta
    const existingGdS = await GdS.findOne({email});
    const existingRequest = await richiestaGdS.findOne({email});
    if (existingGdS || existingRequest) {
      return res.status(400).json({ message: 'Richiesta già spedita' });
    }

    // Hash della password con un "salt" di 10 round
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Path immagine
    const filePath = "/images/" + req.file.filename; 
    console.log(filePath);

    // Crea richesta
    const richiesta = new richiestaGdS({ 
      email, 
      passwordHash: hashedPassword, // Salva l'hash della password
      titolo,
      azienda,
      url,
      foto: filePath, 
      descrizione
    });
    console.log(richiesta);

    // Salva l'utente nel database
    await richiesta.save();

    res.status(201).json({ message: 'Richiesta inviata con successo' });

  } catch (err) {
    res.status(500).json({ message: 'Errore del server', error: err.message });
  }
}

// Conferma la creazione di un nuovo gds ed il suo servizio associato
exports.confermaRichiesta = async (req, res) => { 
  const requestID = req.params.richiesta_id;
  if (!mongoose.Types.ObjectId.isValid(requestID)) {
    return res.status(400).json({ message: 'ID non valido' });
  }
  const session = await mongoose.startSession(); // faccio partire una sessione per usare le transazioni
  try {
    //trovo i dati della richiesta corrispondente
    session.startTransaction(); //faccio partire il transazione, visto che devo modificare due entità, in questo modo sono sicuro che entrambe o nessuna vengano modificate 
    const request = await richiestaGdS.findOne({ _id: requestID, confermata: false});
    if (!request) {
      session.abortTransaction();
      return res.status(404).json({ message: 'Richiesta non trovata' });
    }
    const service_id = await creaServizio(request,session);
    //ora devo creare il gds con il servizio corrispondente
    console.log(request);
    const gds = new GdS({
      email: request['email'],
      passwordHash: request['passwordHash'],
      servizio: service_id
    });
    await gds.save({session}); // salvo il gds
    request.confermata = true; //confermo la richiesta
    await request.save({session});

    //confermo la transazione
    await session.commitTransaction();

    res.status(201).json({ message: 'GdS creato con successo'});
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Errore del server', error: err.message });
  } 
  finally{
    session.endSession();
  }
}

// Ottieni le richeste fatte al gds
exports.getRichieste = async (req, res) => { 
  try {
      let richieste = await richiestaGdS.find({ confermata: false });
      return res.status(201).json(richieste);
    }
    catch(err){
      console.log(err.message);
      return res.status(500).json({message: 'Errore del server'});
    }
}