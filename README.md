# Sasà Cars

Sito statico per la vendita auto, con identità Sasà Cars, due auto in evidenza, 16 fotografie originali, filtri esterni/interni, galleria ingrandibile e richieste di informazioni.

## Avvio

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Non servono dipendenze npm o compilazione. Per GitHub Pages usare il ramo `gh-pages`, cartella `/ (root)`.

## Personalizzazione

- `index.html`: testi e schede auto. Prezzi e disponibilità sono su richiesta; confermare modelli e dati commerciali con il titolare.
- `js/main.js`: configurazione `CONTACT` per WhatsApp (numero internazionale, solo cifre), email e indirizzo confermati. Se non sono compilati, la richiesta si scarica come file di testo e non viene inviata. Con WhatsApp/email configurati si apre il servizio per confermare l’invio. Nessun dato viene conservato dal sito.
- `img/`: tutte le 16 foto, logo e immagine promozionale originali.
- `css/style.css`: layout responsive con supporto alle preferenze di movimento ridotto.

Prima dell’uso commerciale completare recapiti e dati aziendali effettivi. Non sono presenti prezzi, garanzie, recensioni o informazioni societarie inventati.
