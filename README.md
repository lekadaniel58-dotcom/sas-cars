# Sasà Cars

Sito statico in italiano per vendita e noleggio auto, basato sui file forniti nello ZIP.

## Avvio locale

Dalla cartella del repository:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Aprire il sito nel browser sulla porta 8000. Non richiede dipendenze npm o compilazione.

## Contenuti da personalizzare

- `js/main.js`: catalogo dimostrativo, prezzi e illustrazioni SVG.
- `index.html`: indirizzo, telefono, email e partita IVA sono segnaposto.
- `css/style.css`: colori, tipografia e impaginazione responsive.
- Il modulo contatti è una demo e non invia né salva i dati: collegare un servizio di invio prima di pubblicare per clienti reali.
- Il calcolatore applica uno sconto del 10% per noleggi di almeno 7 giorni, inclusi gli extra.

Per pubblicare, caricare `index.html`, `css/` e `js/` su un hosting statico. I font Google sono opzionali: in assenza di rete vengono usati i font di sistema.
