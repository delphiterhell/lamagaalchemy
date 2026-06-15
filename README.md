# La Maga Alchemy — sito web

Sito statico (HTML/CSS/JS scritti a mano, nessun generatore) per il brand
"La Maga Alchemy", ospitato su Netlify.

## Come Magalì aggiorna i contenuti

Magalì può aggiornare da sola, senza scrivere codice e senza un account
GitHub:

- **Collezioni** (I Piccolini, I Chokers, Pezzi Unici): nome, descrizione,
  categoria, foto, "in evidenza"
- **Mercatini & Eventi**: nome evento, data, luogo, note

tramite un pannello di amministrazione visuale all'indirizzo:

```
https://<il-tuo-sito>.netlify.app/admin
```

Il pannello è basato su **Decap CMS**, con autenticazione gestita da
**DecapBridge** (gratuito, sostituisce Netlify Identity che è stato
deprecato).

I contenuti vengono salvati in due file nel repository:

- `content/collezioni.json`
- `content/eventi.json`

Il sito li legge automaticamente e genera le card — non serve nessun
passaggio di "build" o pubblicazione separata: appena Magalì salva dal
pannello, il sito si aggiorna.

---

## ⚠️ Passaggi manuali da fare TU (una tantum)

Questi passaggi NON possono essere fatti da Claude: richiedono un account
personale, email, e click su interfacce web di terze parti. Vanno fatti
una sola volta, con calma.

### 1. Crea un account su DecapBridge

1. Vai su **https://decapbridge.com** e clicca su "Sign up" / "Get started".
2. Registrati (puoi usare il tuo account GitHub per accedere più
   velocemente).

### 2. Collega il repository del sito

1. Nella dashboard di DecapBridge clicca su **"Create site"** / **"Add
   site"**.
2. Scegli **GitHub** come provider Git.
3. Seleziona il repository **`delphiterhell/lamagaalchemy`**.
4. Quando richiesto, indica:
   - **Decap CMS login URL**: `https://<il-tuo-sito>.netlify.app/admin/index.html`
   - **Branch**: `main`
5. Scegli il tipo di autenticazione (va benissimo **Classic**, con
   email/password — più semplice per Magalì).
6. Al termine, DecapBridge ti mostrerà un **Site ID** (qualcosa come
   `abcd1234-...`).

### 3. Aggiorna il file di configurazione del CMS

1. Apri il file [`admin/config.yml`](admin/config.yml) in questo
   repository.
2. Trova la riga:
   ```yaml
   identity_url: https://auth.decapbridge.com/sites/INSERISCI-SITE-ID
   ```
3. Sostituisci `INSERISCI-SITE-ID` con il Site ID che ti ha dato
   DecapBridge al passo precedente.
4. Salva e fai il commit/push della modifica (o chiedi a Claude di farlo
   per te, indicandogli il Site ID).

### 4. Invita Magalì

1. Sempre dalla dashboard di DecapBridge, nella sezione del sito che hai
   creato, cerca **"Invite user"** / **"Add collaborator"**.
2. Inserisci l'email di Magalì.
3. Magalì riceverà un'email con un link per impostare la password e
   accedere al pannello su `/admin`.

### 5. Verifica su Netlify (di solito non serve nulla)

- L'**Image CDN** di Netlify (usata per ottimizzare le foto caricate da
  Magalì) è **già attiva di default** su tutti i siti Netlify: non serve
  alcuna configurazione aggiuntiva.
- Assicurati solo che il sito sia collegato al repository GitHub e che il
  branch di produzione sia **`main`** (Site settings → Build & deploy →
  Branches).

### 6. Primo test

1. Vai su `https://<il-tuo-sito>.netlify.app/admin`.
2. Accedi con le credenziali create da Magalì (o le tue, per testare).
3. Apri **"Collezioni"** o **"Mercatini & Eventi"**, modifica una voce e
   clicca su **"Publish"**.
4. Dopo qualche minuto (tempo di deploy Netlify) la modifica sarà visibile
   sul sito pubblico.

---

## Struttura dei contenuti

### `content/collezioni.json`

```json
{
  "pezzi": [
    {
      "nome": "Nome del pezzo",
      "categoria": "piccolini",   // piccolini | chokers | pezzi-unici
      "descrizione": "Testo descrittivo",
      "foto": "/images/uploads/foto.jpg",
      "in_evidenza": false
    }
  ]
}
```

- Se `foto` è vuoto, la card mostra un placeholder grafico "inserisci
  foto" (coerente con lo stile del sito).
- `in_evidenza` è salvato ma per ora non ha ancora un effetto visivo sul
  sito.

### `content/eventi.json`

```json
{
  "eventi": [
    {
      "nome": "Nome evento",
      "data": "2026-07-12",
      "luogo": "Piazza ..., Città",
      "note": "Testo opzionale"
    }
  ]
}
```

- Gli eventi vengono mostrati in ordine cronologico.
- Il primo evento con data futura riceve automaticamente l'etichetta
  "Prossimo".

## Note tecniche

- Le foto caricate da Magalì tramite il CMS vengono salvate in
  `images/uploads/` nel repository.
- Le immagini vengono servite tramite **Netlify Image CDN**
  (`/.netlify/images?url=...&w=...&q=...`), quindi anche foto pesanti
  caricate da telefono vengono ottimizzate automaticamente — Magalì non
  deve ridimensionare nulla.
