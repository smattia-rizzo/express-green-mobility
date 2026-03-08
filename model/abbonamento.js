/**
 * Prezzi per abbonamento
 */
const prezzi = {
    "mensile": 40, 
    "trimestrale": 100,
    "annuale": 350
}

/**
 * Sconti in percentuale
 */
const sconti = {
    "extraurbano": -20,
    "studente": 25
}

/**
 * Calcola il prezzo di un abbonamento
 * @param {string} tipoAbbonamento 
 * @param {boolean} isStudente 
 * @param {boolean} isExtraurbano 
 */

function calcolaPrezzo(tipoAbbonamento, isStudente, isExtraurbano) {
    let prezzo = prezzi[tipoAbbonamento];
    if (prezzo == undefined) {
        return "Tipo di abbonamento non valido";
    }
    if (isStudente) {
        prezzo += prezzo * sconti["studente"] / 100
    }
    if (isExtraurbano) {
        prezzo += prezzo * sconti["extraurbano"] / 100
    }
    return prezzo;

}


/**
 * Classe Abbonamento
 */
class Abbonamento {
    /**
     * Costruttore di abbonamento
     * @param {number} id 
     * @param {string} nome 
     * @param {string} cognome 
     * @param {Date} dataNascita 
     * @param {string} tipoAbbonamento 
     * @param {string} isExtraurbano 
     * @param {boolean} isStudente 
     */
    constructor(id, nome, cognome, dataNascita, tipoAbbonamento, isExtraurbano, isStudente) {
        this.id = id;
        this.nome = nome;
        this.cognome = cognome;
        this.dataNascita = dataNascita;
        this.tipoAbbonamento = tipoAbbonamento;
        this.isExtraurbano = isExtraurbano;
        this.isStudente = isStudente;
    }

    /**
     * @returns {number}
     */
    getPrezzo() {
        return calcolaPrezzo(this.tipoAbbonamento, this.isStudente)
    }
}

module.exports = {prezzi, sconti, calcolaPrezzo, Abbonamento}