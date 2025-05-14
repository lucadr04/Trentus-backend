// Models
const Servizio = require('../models/servizio.model');
const Utente = require('../models/utente.model');

// Crea un servizio
exports.creaServizio = async (request, session) => {
  const servizio = new Servizio({
    titolo: request['titolo'],
    azienda: request['azienda'],
    url: request['url'],
    foto: request['foto'],
    descrizione: request['descrizione'],
    stato: "on"
  });
  const service_id = await servizio.save({session}); //salvo il servizio ottenendo l'id
  return service_id;
}

// Restituisce un servizio specifico
exports.getServizio = async (req,res) => {
  try{
    let s = await Servizio.findById(req.servizio_id);
    return res.status(200).json(s);
  } 
  catch(err){
    return res.status(500).json({message: "Errore del server"});
  }
}

// Restituisce tutti i servizi
exports.getServizi = async (req,res) => {
  try {
    // Ottengo tutti i record della collezione "service"
    const services = await Servizio.find();

    // Rispondo con i dati
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dei dati', error: error.message });
  }
}

exports.preferito = async (req, res) => {
  try {
    let utente = await Utente.findById(req.user.id);
    
    let index = utente.preferiti.indexOf(req.servizio_id);

    if (index !== -1) {
      utente.preferiti.splice(index, 1);
      await utente.save();
      return res.status(200).json({ message: "Servizio eliminato" });
    } else {
      utente.preferiti.push(req.servizio_id);
      await utente.save();
      return res.status(200).json({ message: "Servizio salvato" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Errore nel modificare lo stato", error: error.message });
  }
};

exports.modificaServizio = async (req, res) => {
  try {
    const { servizio_id } = req.params; 
    const aggiornamenti = JSON.parse(req.body.data); 

    // Se è stato postato anche un file lo includo nelle modifiche
    if(req.file){
      const filePath = "/images/" + req.file.filename; 
      aggiornamenti['foto'] = filePath
    }
    const servizio = await Servizio.findByIdAndUpdate(servizio_id, aggiornamenti, { new: true, runValidators: true });

    if (!servizio) {
      return res.status(404).json({ message: "Servizio non trovato" });
    }

    return res.status(200).json({ message: "Servizio aggiornato con successo", servizio });
  } catch (error) {
    return res.status(500).json({ message: "Errore nella modifica del servizio", error: error.message });
  }
};