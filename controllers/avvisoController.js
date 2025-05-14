const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Model
const Avviso = require('../models/avviso.model');
const User = require('../models/utente.model');

// Crea un avviso
exports.creaAvviso = async (req,  res) => {
  // creo il servizio
  const { titolo, corpo, tipo, inizio, fine } = req.body;
  const avviso = new Avviso({
    titolo,
    corpo,
    tipo,
    inizio: new Date(inizio),
    fine: new Date(fine),
    servizio_id: req.servizio_id
  });
  try {
    await avviso.save();  // Salva l'avviso nel database
    console.log("Avviso creato e salvato");
    
    // Dopo aver creato l'avviso, invia l'email agli utenti interessati
    await inviaEmailInteressati(req, res);
    res.status(200).send('Avviso creato e email inviata!');
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).send('Errore nella creazione dell\'avviso');
  }
}

// Restituisce tutti gli avvisi di un servizio
exports.getAvvisi = async (req,  res) => {
  try {
    const avvisi = await Avviso.find({ servizio_id: new mongoose.Types.ObjectId(req.servizio_id) });
    res.status(200).json(avvisi);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dei dati', error: error.message });
  }
}

// Restituisce un avviso
exports.getAvvisoById = async (req,  res) => {
  try {
    const avviso = await Avviso.findById(req.params.avviso_id);
    if(avviso.servizio_id != req.servizio_id){
      return res.status(400).json({message:'L\'avviso non è del servizio corretto'});
    }
    return res.status(200).json(avviso);
  } catch (error) {
    return res.status(500).json({ message: 'Errore nel recupero dei dati', error });
  }
}

// Invio la mail a tutti gli utenti che hanno questo servizio nei preferiti
const inviaEmailInteressati = async (req, res) => {
  try {
    const utenti = await User.find({ preferiti: req.servizio_id });

    if (utenti.length === 0) {
      console.log("Nessun utente trovato con questo servizio nei preferiti");
      return;
    }

    const transporter = nodemailer.createTransport({ sendmail: true });

    const emailPromises = utenti.map(user => {
      const mailOptions = {
        from: "no-reply@trentus.it",
        to: user.email,
        subject: 'Avviso servizio: '+ req.servizio_id,
        html: `<p>Ciao ${user.nome},</p>
               <p>È stato creato un nuovo avviso per il tuo servizio preferito. Ecco i dettagli:</p>
               <p><strong>Titolo:</strong> ${req.body.titolo}</p>
               <p><strong>Descrizione:</strong> ${req.body.corpo}</p>
               <p><strong>Periodo:</strong> ${new Date(req.body.inizio).toLocaleDateString()} - ${new Date(req.body.fine).toLocaleDateString()}</p>`
      };
      
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises); // Attende tutte le email

    console.log("Email inviate con successo a tutti gli utenti");
  } catch (err) {
      console.error("Errore durante l'invio delle email:", err);
  }
};