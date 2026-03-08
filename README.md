# Esercizio: Portale Abbonamenti "Green Mobility" (Versione Server-Side)
L'azienda Green Mobility vuole evolvere il suo calcolatore di abbonamenti in una vera applicazione gestionale. Il sistema deve permettere l'iscrizione degli utenti, il calcolo del preventivo basato su tariffe dinamiche e la generazione di report statistici sulle scelte ecologiche dei cittadini.
#### Struttura dell'Applicazione
L'applicazione deve essere sviluppata con Node.js, Express e il motore di templating Pug, strutturata sui seguenti endpoint:

## 1. Registrazione Abbonamento (POST /sottoscrivi)
Il server riceve i dati da un form di iscrizione (gestito in una rotta GET /).
Dati richiesti:
- Nome e Cognome (Minimo 2 caratteri, solo lettere).
- Data di Nascita (Input di tipo data).
- Tipo Abbonamento (Mensile, Trimestrale, Annuale).
- Zona di Copertura (Urbana, Extra-urbana).
- Status Studente (Checkbox per lo sconto).
- Consenso Privacy (Obbligatorio).
- Logica del Server:
- Validazione: Eseguire la validazione lato server (Regex per i nomi, verifica presenza campi). Se i dati non sono validi, restituire un errore specifico.
- Consenso Privacy deve essere selezionato per proseguire
- Calcolo Prezzo: Il server deve calcolare il costo finale partendo dai prezzi base:
- Mensile: 40€ | Trimestrale: 100€ | Annuale: 350€.
- Maggiorazione Extra-urbana: +20% sul costo base.
- Sconto Studente: -25% sul totale (Base + Zona).
- Salvataggio: Se valido, salvare l'abbonamento in un archivio (database o file JSON) e generare un ID univoco.

## 2. Riepilogo e Analisi Data (GET /abbonamento/:id)
Attraverso l'ID univoco, il server recupera l'abbonamento e genera la pagina di riepilogo.

Elaborazione sulle Date: * Il server deve calcolare l'età esatta dell'utente partendo dalla data di nascita fornita nel form.

Se l'utente compie gli anni lo stesso giorno che richiede il riepilogo aggiungere un messaggio di: "Buon compleanno! Green Mobility ti fa gli auguri".

Contenuto Pagina: Mostrare i dati anagrafici, l'età calcolata, il dettaglio del piano (es. "Annuale Extra-urbano") e il prezzo finale formattato in Euro.

## 3. Dashboard Statistiche (GET /dashboard)
Un endpoint che analizza tutti gli abbonamenti venduti finora e restituisce:
- Impatto Ambientale: Distribuzione percentuale tra abbonamenti "Urbani" ed "Extra-urbani".
- Popolarità: Il tipo di abbonamento (Mensile/Trimestrale/Annuale) più acquistato.

## Tecnologie Utilizzate
- Lato Server: Node.js con Express.js per la gestione delle richieste.
- Persistenza Dati: File system per la memorizzazione delle risposte.
- Lato Client: HTML, CSS, JavaScript.
- Template Engine: Pug per la costruzione dei layout dinamici.

