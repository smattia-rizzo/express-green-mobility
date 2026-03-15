const express = require("express")
const path = require("path")
const fs = require("fs").promises
const abbonamento = require("./model/abbonamento.js");
const jsonManager = require("./data/jsonManager.js")
const favicon = require("serve-favicon")
const morgan = require("morgan")
const { createWriteStream } = require("fs")
const helmet = require("helmet")

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


    let listaAbbonamenti = await jsonManager.parseAbbonamenti();
    const getLatestId = () => {
        let id = 0;
        for (let i = 0; i < listaAbbonamenti.length; i++) {
            if (listaAbbonamenti[i].id > id) {
                id = listaAbbonamenti[i].id
            }
        }
        return id + 1;
    }


    const app = express()
    app.use(express.urlencoded({ extended: true }))


    const accessLogStream = createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
    app.use(morgan('short', {stream: accessLogStream}));

    app.use(helmet());






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


    app.post("/sottoscrivi", (req, res) => {
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
                error: `${validateNome ? "" : "Il nome non è stato compilato correttamente. "}
                ${validateCognome ? "" : "Il cognome non è stato compilato correttamente. "}
                ${validateData ? "" : "La data di nascita non è stata compilata correttamente. "}
                ${validateTipoAbbonamento ? "" : "Il tipo di abbonamento non è stato selezionato correttamente. "}
                ${validateExtraurbano ? "" : "Manomissione rilevata sul campo extraurbano. "}
                ${validateStudente ? "" : "Manomissione rilevata sul campo studente. "}
                ${validatePrivacy ? "" : "È necessario accettare l'informativa sulla privacy."}`
            })
        } else {
            //Creo oggetto abbonamento
            const a = new abbonamento.Abbonamento(getLatestId(), nome, cognome, new Date(dataNascita), tipoAbbonamento, (isExtraurbano == "on" ? true : false), (isStudente == "on" ? true : false))
            /*
            //Aggiungo l'oggetto alla lista
            jsonManager.saveAbbonamenti(listaAbbonamenti);
            //Salvo l'oggetto
            jsonManager.saveAbbonamenti(listaAbbonamenti);
            */
            listaAbbonamenti.push(a);
            //Salvo la lista contenente il nuovo oggetto
            jsonManager.saveAbbonamenti(listaAbbonamenti);
            //Risposta
            res.render("success", {
                title: 'Registrato!',
                id: a.id
            })
        }



    })

    app.get("/abbonamenti", (req, res) => {
        res.render('abbonamenti', {
            title: 'Abbonamenti',
            abbonamenti: listaAbbonamenti
        })

    })

    app.get('/abbonamento/:id', (req, res) => {
        const id = req.params.id;
        console.log(`Ricercando l'abbonamento con ID: ${id}`);
        let a = listaAbbonamenti.find((abbonamento) => abbonamento.id == id);
        let prezzo = a.getPrezzo();
        console.log(a)
        console.log(prezzo)
        
        //Controllo compleanno
        let oggi = new Date();
        let isCompleanno = oggi.getMonth() == a.dataNascita.getMonth() && oggi.getDate() == a.dataNascita.getDate()

        res.render("abbonamento_dettaglio",{
            title: `Dettaglio abbonamento id ${id}`,
            abbonamento: listaAbbonamenti.find((abbonamento) => abbonamento.id == id),
            prezzo: prezzo,
            isCompleanno: isCompleanno


        })
    });

    app.get('/dashboard', (req,res) => {
        //Calcolo gli abbonamenti totali
        let abbonamentiTotali = listaAbbonamenti.length;

        //Totale abbonamenti extraurbani
        let extraurbani = listaAbbonamenti.filter((abbonamento) => abbonamento.isExtraurbano).length;

        const impattoAmbientale = {
            "Urbani": abbonamentiTotali-extraurbani,
            "Extra-urbani": extraurbani
        }


        //Calcolo per tipologia
        let tipologia = {}
        //Inizializzo l'oggetto
        Object.keys(abbonamento.prezzi).forEach((t) => {
            tipologia[t] = 0
        })
        listaAbbonamenti.forEach((a) => {
            tipologia[a.tipoAbbonamento] = tipologia[a.tipoAbbonamento]+1;
        })
        





        res.render('dashboard', {
            title: 'Dashboard',
            totali: abbonamentiTotali,
            impatto: impattoAmbientale,
            tipologia: tipologia
        })
    })






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