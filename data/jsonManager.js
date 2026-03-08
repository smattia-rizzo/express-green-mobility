//Import moduli
const abbonamento = require("./../model/abbonamento");
const fs = require("fs").promises;


//Variabili statiche
/**
 * Il file contiene una lista di abbonamenti
 */
const filePath = "./abbonamenti.json"


/**
 * Funzione per effettuare il parsing degli abbonamenti
 * @returns {abbonamento.Abbonamento[]} lista
 */
async function parseAbbonamenti() {
    //Recupero il contenuto del file
    let json = await fs.readFile(filePath, "utf-8");
    let abbonamenti = JSON.parse(json);


    let lista = []
    //Parsing in oggetti
    abbonamenti.forEach(a => {
        lista.push(new abbonamento.Abbonamento(
            a.nome, a.cognome, new Date(a.dataNascita), a.tipoAbbonamento, a.isExtraurbano, a.isStudente));
    });

    return lista;

    
}


/**
 * Funzione per effettuare il salvataggio degli abbonamenti
 * @param {abbonamento.Abbonamento[]} lista
 */
function saveAbbonamenti(lista) {
    
}



module.exports = {parseAbbonamenti, saveAbbonamenti}