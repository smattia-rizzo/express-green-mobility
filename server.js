const express = require("express")
const path = require("path")
const fs = require("fs").promises
const abbonamento = require("./model/abbonamento.js");
const jsonManager = require("./data/jsonManager.js")
const favicon = require("serve-favicon")

//Variabili statiche
const PORT = 3000
const APPLICATION_NAME = "Green Mobility"

//Validazione
const regexNome = /^[A-Za-z]{3,}$/;
const regexCognome = /^[A-Za-z]{3,}$/
const isValidDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
};



async function start() {


    let listaAbbonamenti = jsonManager.parseAbbonamenti();

    const app = express()
    app.use(express.urlencoded({ extended: true }))







    //Template
    app.set('view engine', 'pug');
    app.set('views', './views');

    //Middleweare favicon: gestisce il favicon del sito Web
    app.use(favicon(path.join(__dirname, 'public','favicon.ico')))
    //Middleware logger
    app.use((req, res, next) => {
        console.log(req.method + " " + req.url)
        //console.log("Query: " + req.query)
        console.log("Body: " + req.body)
        next()
    })

    //Rotte statiche
    app.use(express.static('public'));


    //Rotte

    app.get("/", (req, res) => {
        res.render("home", {
            title: "Home"
        })
    })
    app.get("/sottoscrivi", (req, res) => {
        res.render('sottoscrivi', {
            title: "Sottoscrivi",
            error: false
        })
    })


    app.post("sottoscrivi", (req, res) => {
        //Recupero campi form
        const nome = req.body.nome;
        const cognome = req.body.cognome;
        const dataNascita = req.body.dataNascita;
        const tipoAbbonamento = req.body.tipoAbbonamento;
        const isExtraurbano = req.body.isExtraurbano;
        const isStudente = req.body.isStudente;
        const privacyAccepted = req.body.privacy;
        
        //Validazione
        const validateNome = regexNome.test(nome)
        const validateCognome = regexCognome.test(cognome)
        const validateData = isValidDate(dataNascita)
        const validateTipoAbbonamento = (abbonamento.prezzi[tipoAbbonamento] != undefined)
        const validateExtraurbano = (isExtraurbano == "on" || isExtraurbano === undefined)
        const validateStudente = (isStudente == "on" || isStudente === undefined)
        const validatePrivacy = (privacyAccepted == "on")



        if (!validateNome || !validateCognome || !validateData || !validateTipoAbbonamento || !validateExtraurbano || !validateStudente || !validatePrivacy) {
            res.status(422).render('sottoscrivi', { 
                title: 'Sottoscrivi',
                //Messaggio personalizzato in base alla validazione
                error: `${validateNome ? "" : "Il nome non è stato compilato correttamente.\n"}
                ${validateCognome ? "" : "Il cognome non è stato compilato correttamente.\n"}
                ${validateData ? "" : "La data di nascita non è stata compilata correttamente.\n"}
                ${validateTipoAbbonamento ? "" : "Il tipo di abbonamento non è stato selezionato correttamente.\n"}
                ${validateExtraurbano ? "" : "Manomissione rilevata sul campo extraurbano.\n"}
                ${validateStudente ? "" : "Manomissione rilevata sul campo studente.\n"}
                ${validatePrivacy ? "" : "È necessario accettare l'informativa sulla privacy."}`
            })
        } else {
            //Creo oggetto abbonamento
            listaAbbonamenti.push(new abbonamento.Abbonamento(nome, cognome, new Date(dataNascita), tipoAbbonamento, isExtraurbano, isStudente));
            //Salvo l'oggetto
            jsonManager.saveAbbonamenti(listaAbbonamenti);
        }



    })

    app.get("abbonamenti", (req, res) => {
        res.render('abbonamenti', {
            title: 'Abbonamenti',
            listaAbbonamenti: listaAbbonamenti
        })

    })

    app.get('/abbonamento/:id', (req, res) => {
        const id = req.params.id;
        console.log(`Ricercando l'abbonamento con ID: ${id}`);
        let a = listaAbbonamenti.find((abbonamento) => abbonamento.id == id);
        let prezzo = a.getPrezzo();
        console.log(a)
        console.log(prezzo)


        res.render("abbonamento_dettaglio",{
            title: `Dettaglio abbonamento id ${id}`,
            abbonamento: listaAbbonamenti.find((abbonamento) => abbonamento.id == id),
            prezzo: prezzo


        })
    });




    //404 Not Found
    app.use((req,res,next) =>{
        res.render('404', {
            title: "404 Not Found"
        })
    })



    app.listen(PORT, () => [
        console.log("L'applicazione " + APPLICATION_NAME + " è stata avviata\n" +
            "Per raggiungerlo: http://127.0.0.1:" + PORT
        )
    ])
}


start()