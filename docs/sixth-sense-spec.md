# Sixth Sense — Specifica del plugin

Fork ibrido di [obra/superpowers](https://github.com/obra/superpowers) (MIT) con innesti da [mattpocock/skills](https://github.com/mattpocock/skills) (MIT)

Versione documento: 0.2 — Aggiornato con correzioni architetturali
Stack di riferimento dell'utente: Spring Boot (Java 21, Virtual Threads), Angular, Gradle, Testcontainers, Jenkins, ArgoCD, Kubernetes

## 0. Obiettivo in una frase
Ridurre il peso statico e l'overhead di ragionamento di Superpowers senza perdere la disciplina che lo rende affidabile sui task grandi, aggiungendo controllo esplicito su quale modello/effort viene speso per ogni subagent.

## 1. Origine, licenza, attribuzione
- **Base**: fork diretto di `obra/superpowers` (main branch, v6.1.1 al momento della stesura), licenza MIT.
- **Innesti**: skill riscritte prendendo ispirazione strutturale (pattern router + skill condivisa) da `mattpocock/skills`, licenza MIT. Non è un mirror: le skill vanno riadattate dallo stack Node/TS/GitHub-issues di Pocock allo stack Java/Spring Boot/Angular dell'utente.
- Mantenere il file `LICENSE` (MIT) e aggiungere in `README.md` una sezione "Credits" che cita entrambi i repository di origine.
- Nome plugin: `sixth-sense`. Nome interno del pacchetto/skill principale: `using-sixth-sense` (sostituisce `using-superpowers`).

## 2. Struttura repository target
```plaintext
sixth-sense/
├── .claude-plugin/
│   ├── plugin.json            # Manifesto del plugin (senza array "skills")
│   └── marketplace.json
├── agents/                    # subagent-type con model/effort fissati (vedi §6)
│   ├── sonnet-low.md
│   ├── sonnet-medium.md
│   ├── sonnet-high.md
│   ├── sonnet-research.md     # unico tier con WebSearch/WebFetch, aggiunto 2026-07-13
│   └── haiku-batch.md
├── hooks/
│   ├── hooks.json
│   └── session-start          # invariato nella logica, aggiorna solo il nome della skill iniettata
├── skills/
│   ├── using-sixth-sense/       # sostituisce using-superpowers (§5.8)
│   ├── setup-sixth-sense/       # NUOVA — interview una tantum (§6.2)
│   ├── crossroad-stack/       # NUOVA — router frontend/backend (§6.1)
│   ├── writing-great-skills/  # sostituisce writing-skills (§5.1)
│   ├── implement/             # sostituisce subagent-driven-development + executing-plans (§5.2)
│   ├── grill-with-docs/       # grilling / domain-modeling / sostituiscono brainstorming (§5.3)
│   ├── tdd/              # tdd di Pocock riadattato a JUnit/Testcontainers (§5.4)
│   ├── diagnosing-bugs/       # sostituisce systematic-debugging, quasi 1:1 (§5.5)
│   ├── to-spec/               # sostituisce writing-plans (§5.6)
│   ├── code-review/           # sostituisce requesting+receiving-code-review (§5.7)
│   ├── using-git-worktrees/   # INVARIATA da Superpowers (§7)
│   ├── finishing-a-development-branch/ # INVARIATA da Superpowers (§7)
│   ├── dispatching-parallel-agents/    # MODIFICATA: aggiunta logica di batching + cap (§6.4)
│   └── verification-before-completion/ # INVARIATA da Superpowers (§7)
├── LICENSE
└── README.md
```

> [!NOTE]
> Rispetto alla bozza 0.1, le cartelle `agents/` e `hooks/` sono state spostate direttamente nella root del plugin (in precedenza `agents/` era erroneamente incapsulata in `.claude/`). Questo assicura che l'engine di Claude Code possa rilevare correttamente i componenti del plugin all'avvio.

Il file di preferenze utente/progetto verrà salvato nel repository in cui viene eseguito il plugin sotto il percorso:
```plaintext
.sixth-sense/
└── model-preferences.md       # generato da setup-sixth-sense, letto ad ogni dispatch (§6.2/6.4)
```

## 3. Analisi del manifesto plugin.json
Il file `plugin.json` di Superpowers si affida alla scansione automatica della cartella per caricare le skill. Inizialmente si era ipotizzato che l'aggiunta di un array `"skills"` esplicito nel manifesto potesse forzare la progressive disclosure riducendo i token di precaricamento.
Tuttavia, l'engine di Claude Code accetta rigorosamente solo metadati di identità standard (`name`, `description`, `version`, `author`) e ignora qualsiasi campo non standard (compreso l'array `"skills"`). La scansione di `skills/` è sempre automatica e globale.
Di conseguenza, il risparmio statico di token deriverà esclusivamente dal lavoro di snellimento e riscrittura dei contenuti dettagliato nella Sezione 5.

## 4. Principio di categorizzazione delle skill
Ogni skill va marcata esplicitamente come:
- **model-invoked** (default Superpowers): l'agente la valuta automaticamente ad ogni task.
- **user-invoked** (`disable-model-invocation: true`, pattern Pocock): raggiungibile solo con `/nome-skill`.

Regola per Sixth Sense: solo le skill del flusso core restano **model-invoked** (`tdd`, `diagnosing-bugs`, `code-review`, `dispatching-parallel-agents`). Tutto il resto (`writing-great-skills`, `setup-sixth-sense`, `crossroad-stack`, `implement`, `to-spec`) è **user-invoked**. Questo risponde all'esigenza di ridurre sia il conteggio statico sia il numero di skill che l'agente deve "considerare" ad ogni turno.

## 5. Mappa di sostituzione dei contenuti (risparmio garantito)

| # | Skill Superpowers (peso) | Sostituto Sixth Sense (peso stimato) | Note di adattamento |
|---|---|---|---|
| 5.1 | `writing-skills` — 6.607 tok | `writing-great-skills` — 2.353 tok | User-invoked. Serve solo quando si scrivono nuove skill, non ad ogni task. |
| 5.2 | `subagent-driven-development` + `executing-plans` — 6.058 tok | `implement` — 108 tok | Trade-off maggiore, vedi §9.1. Router che delega a `tdd` → typecheck (Gradle) → `code-review` → commit. Niente più subagent fresco-per-task né ledger di progresso: per task piccoli/medi va benissimo. Per refactor grossi valutare se tenere in parallelo la versione originale lunga come skill opzionale `implement-heavy`. |
| 5.3 | `brainstorming` — 2.608 tok | `grill-with-docs` + `grilling` + `domain-modeling` — 1.122 tok | Interview mirata invece di brainstorming libero + companion visuale. Aggiornamento inline di un `CONTEXT.md` di glossario/ADR. |
| 5.4 | `test-driven-development` — 2.473 tok | `tdd` — 803 tok (base) | **Va riscritta**: il tdd di Pocock parla di Vitest/npm. Sostituire i riferimenti con JUnit 5, Gradle test task, Testcontainers per gli integration test. La logica red-green-refactor e gli anti-pattern restano portabili. |
| 5.5 | `systematic-debugging` — 2.471 tok | `diagnosing-bugs` — 2.134 tok | Risparmio minore (~340 tok), quasi equivalente in profondità. Adattamento leggero (stack trace Java invece di JS). |
| 5.6 | `writing-plans` — 1.773 tok | `to-spec` — 768 tok | Si perde la parte di `to-tickets` (breakdown su issue tracker) — riaggiungibile come skill opzionale (+1.450 tok) se in futuro serve gestione ticket multi-sessione. |
| 5.7 | `requesting-code-review` + `receiving-code-review` — 2.301 tok | `code-review` — 1.685 tok | Unifica le due prospettive (chi chiede, chi riceve) in un'unica skill. |
| 5.8 | `using-superpowers` — 765 tok | `using-sixth-sense` — ~300 tok (da scrivere) | Rimuove la clausola "controlla OGNI skill contro OGNI task", che genera overhead di ragionamento ad ogni turno oltre al costo statico. Mantiene solo: nome del plugin, dove trovare `/setup-sixth-sense`, precedenza istruzioni utente > skill > default. |

**Subtotale risparmio sezione 5**: da ~25.056 tok a ~9.273 tok → **-15.783 tok** su questi 8 blocchi.

## 6. Skill e file nuovi da scrivere

### 6.1 `crossroad-stack` (router frontend/backend)
- **Tipo**: model-invoked, si attiva prima di `tdd`, `diagnosing-bugs`, `code-review`.
- **Logica**: rileva il tipo di file/percorso toccato dal task:
  - `.ts`, `.html`, `.scss`, presenza di `angular.json` → applica convenzioni Angular (stile Pocock, se in futuro si aggiunge una skill TS dedicata).
  - `.java`, `build.gradle`, `src/main/java`, `application.yml` → applica `tdd` / `diagnosing-bugs` versione Java.
- **Peso stimato**: ~250 tok (è un if/else testuale, non uno strumento).
- **Avvertenza**: se si tengono installate skill separate per i due stack, il peso statico totale sale rispetto alla sostituzione secca di §5. Il crocevia è "quasi gratis" solo se si conferma che solo la skill attivata viene presa in considerazione dal modello. Altrimenti è un trade-off correttezza-per-token da accettare consapevolmente.

### 6.2 `setup-sixth-sense` (interview una tantum)
- **Tipo**: user-invoked, si lancia una volta per progetto/macchina con `/setup-sixth-sense`.
- **Compito**: 2-3 domande dirette via ask-user-style (o testuali se non disponibile):
  1. Quali modelli sono autorizzati? (mai includere Opus se l'utente lo esclude — semplicemente non generare il file agent corrispondente)
  2. Livello di effort preferito per Sonnet su lavoro standard (low/medium/high)?
  3. I task banali vanno raggruppati su Haiku? (sì/no)
- **Output**: scrive/aggiorna `.sixth-sense/model-preferences.md` (formato libero, es. YAML front-matter + note).
- **Peso stimato**: ~600 tok.
- **Vincolo di sicurezza confermato**: Trattandosi di una skill interattiva, deve essere invocata esplicitamente dall'utente nella sessione principale. I subagent generati dal plugin non possono utilizzare tool interattivi come `AskUserQuestion`, né supportano i campi frontmatter `hooks` o `permissionMode`. Configurare le preferenze centralmente nella sessione principale evita il blocco dei subagent.

### 6.3 Agent-type dedicati (`agents/`)
Quattro file Markdown con frontmatter YAML, secondo lo schema reale di Claude Code (`model`, `effort`, `tools`, `maxTurns`).

#### `sonnet-low.md`
```yaml
---
name: sonnet-low
description: Worker per task semplici e ben definiti, poco rischio di ambiguità.
model: sonnet
effort: low
tools: Read, Edit, Bash, Grep, Glob
maxTurns: 15
---
```

#### `sonnet-medium.md`
- Stesso schema di `sonnet-low`, con `effort: medium` e `maxTurns: 25`.

#### `sonnet-high.md`
- Stesso schema di `sonnet-low`, con `effort: high` e `maxTurns: 40`.

#### `haiku-batch.md`
```yaml
---
name: haiku-batch
description: Worker per un LOTTO di task piccoli raggruppati (non uno singolo).
model: haiku
tools: Read, Edit, Bash, Grep, Glob
maxTurns: 20
---
Ricevi una LISTA di task piccoli in un solo prompt. Eseguili in sequenza nello stesso contesto, riporta un riepilogo unico a fine lotto.
```

Nessun file `opus-*.md` viene creato. Questo, di per sé, impedisce all'agente di invocare Opus per un subagent — non serve una regola di rifiuto esplicita, basta l'assenza dell'opzione dal catalogo.
**Peso stimato totale dei 4 file**: ~500 tok (registrazione separata dalle skill, via il meccanismo agent, non skill).

### 6.4 Modifiche a `dispatching-parallel-agents`
Aggiungere alla skill esistente (non riscriverla da zero — è genuinamente utile e senza equivalente in Pocock):
1. **Lettura preferenze**: prima di qualunque dispatch, leggere `.sixth-sense/model-preferences.md`.
2. **Raggruppamento**: task sotto una soglia di complessità dichiarata (es. "modifica singolo file, <20 righe, nessuna decisione architetturale") vanno accorpati in un'unica chiamata a `haiku-batch`, non dispatchati uno a uno.
3. **Instradamento per effort**: il resto dei task va a `sonnet-low/medium/high` in base a una stima di difficoltà che la skill deve fare esplicitamente (criteri: numero di file coinvolti, presenza di logica di business, necessità di decisioni non ovvie).
4. **Cap esplicito**: aggiungere una riga tipo *"non dispatchare più di N agenti Agent() nello stesso turno; N di default = 4, configurabile in model-preferences.md"*. Nelle versioni stabili di Claude Code, il tool nativo di delega `Task()` è stato deprecato e sostituito ufficialmente da `Agent()`.
- **Peso stimato dell'aggiunta**: ~300 tok sopra ai 1.661 tok originali → skill finale ~1.961 tok.

## 7. Skill lasciate invariate (nessun sostituto trovato)
Nessuna corrispondenza in `mattpocock/skills`, perché il suo flusso è sequenziale a sessione singola, non multi-agente parallelo:
- `using-git-worktrees` — 1.868 tok
- `finishing-a-development-branch` — 1.708 tok
- `verification-before-completion` — 1.050 tok

Restano copiate 1:1 dall'originale Superpowers.

## 8. Stima di risparmio complessiva

| Voce | Token |
|---|---|
| Peso Superpowers originale (14 skill) | ~31.346 |
| Dopo sostituzioni di contenuto (§5) | ~9.273 (su questi 8 blocchi, da 25.056) |
| + skill/file invariati (§7) | +6.287 |
| + aggiunta batching/cap a `dispatching-parallel-agents` (§6.4) | +300 |
| + `crossroad-stack` nuova (§6.1) | +250 |
| + `setup-sixth-sense` nuova (§6.2) | +600 |
| + 4 agent-type (§6.3) | +500 |
| **Totale Sixth Sense stimato** | **~17.210** |
| **Risparmio netto vs originale** | **~14.136 tok, ≈ 45%** |

Questo è un risparmio statico (peso del testo delle skill), misurato come `byte/4` sui file reali. Da verificare con `/context` a fork completato.

## 9. Rischi e trade-off dichiarati

### 9.1 Perdita di rigore su task grandi — RISOLTO (§13)
`implement` sostituiva un meccanismo di 6k token fatto di subagent freschi, doppia review, ledger di progresso, con un flusso a 108 token che trattava un refactor a 6 file come un fix a una riga. Chiuso in §13: `implement` ora ha uno "Scope Check" che instrada verso una Heavy Workflow (ledger `.sixth-sense/progress.md`, subagent fresco per task, protocollo di stato, gate di review per task via Dylan Dog) sopra una soglia di scope, mantenendo il flusso leggero invariato sotto quella soglia.

### 9.2 Adattamento stack non è automatico
`tdd`, `diagnosing-bugs`, `code-review` derivano da skill scritte per Node/TS. Vanno riscritte a mano sostituendo i riferimenti (Vitest → JUnit, npm scripts → task Gradle). È lavoro di editing testuale, non ingegneria, ma va fatto — non è un semplice cambio di nome file.

### 9.3 Fragilità della persistenza delle preferenze
Vedi nota in §6.2. Senza rinforzo esplicito nella skill di dispatch, il sistema "dimentica" le preferenze di modello nel tempo.

## 10. Ordine di implementazione consigliato
1. Fork su GitHub dell'utente da `obra/superpowers`.
2. Sostituzioni a basso rischio prima: `writing-skills` → `writing-great-skills` (§5.1), `code-review` unificato (§5.7), `to-spec` (§5.6).
3. Adattamento stack Java di `tdd` e `diagnosing-bugs` (§5.4, §5.5) — richiede più attenzione, fare con test manuali su un progetto reale piccolo.
4. `crossroad-stack` (§6.1) solo dopo che 3-4 sono stabili.
5. `setup-sixth-sense` + `agent-type` (§6.2, §6.3).
6. Modifica a `dispatching-parallel-agents` con batching/cap (§6.4) — per ultimo, perché dipende dal file di preferenze generato al punto 5.
7. `implement` al posto di `subagent-driven-development` (§5.2) — ultimo perché è il cambiamento più rischioso; tenerlo dietro un flag/skill opzionale finché non si è testato a sufficienza.

## 11. Criteri di verifica
- `/context` a inizio sessione, prima e dopo ogni fase, per misurare il preload reale.
- Almeno 3 task di prova per categoria (piccolo/medio/grande, Java e Angular) per confrontare il risultato qualitativo prima/dopo la sostituzione di ogni skill.
- Log manuale di quali agent-type (`sonnet-low/medium/high`, `haiku-batch`) vengono effettivamente usati su una settimana di lavoro reale, per validare se le soglie di raggruppamento/effort sono tarate bene o vanno corrette in `model-preferences.md`.

## 12. Dylan Dog — caccia agli edge case e premortem (post-fork)

Superpowers non ha alcun meccanismo dedicato alla ricerca sistematica di edge case: `brainstorming` si ferma a un self-review su placeholder/coerenza/scope, e `requesting-code-review` dispatcha un singolo revisore con un prompt generico ("edge cases handled?") che convalida la coerenza del diff più che attaccarlo. Sixth-sense erediva lo stesso limite. `dylan-dog` (`skills/dylan-dog/`, user-invoked) lo colma con due modalità che condividono una checklist euristica (`checklist.md`: SFDIPOT, CRUD, boundary/equivalence, concorrenza, fallimento/recovery, sicurezza, oracoli HICCUPPS-lite, mutation thinking):

- **Premortem** — richiamata da `domain-modeling` e da `to-spec` prima di presentare la spec finale: immagina il fallimento già avvenuto e risale alle cause, mappandole sulla checklist, invece di un brainstorming libero.
- **Hunting** — si integra in `code-review` come stadio di edge-case hunting (implementato in `agents/dylan-dog-triage.md`/`agents/dylan-dog-hunter.md`, non un singolo `agents/code-reviewer.md` come una prima stesura di questa sezione ipotizzava). Instrada su due livelli per risparmiare token: `dylan-dog-triage` (Haiku, o `sonnet-low` di fallback) classifica il rischio per file/hunk senza analisi approfondita; solo le sezioni `deep` vengono passate a `dylan-dog-hunter` (Sonnet, effort alto) per l'analisi avversariale, con verifica obbligatoria (`CONFIRMED`/`PLAUSIBLE`) di ogni finding prima che possa essere riportato. Diff piccoli (<~150 righe, un file) saltano il triage. Diff senza sezioni `deep` non arrivano mai all'hunter.
- Deliberatamente **non** multi-round debate tra agenti: al massimo due passate in sequenza, perché il dibattito iterativo alza l'accuratezza in modo marginale a fronte di un costo anche 90-100x superiore.
- Nessun nuovo agent-type Opus: `dylan-dog-hunter` usa `sonnet`/`effort: high`, coerente con la scelta di §6.3 di non introdurre Opus nel catalogo.

## 13. Chiusura dei gap superpowers vs sixth-sense (secondo giro, post-Dylan Dog)

Un audit mirato (lettura sostanziale, non solo conteggio token) ha confrontato ogni skill sixth-sense con il suo antenato superpowers, oltre a brainstorming/review già coperti da Dylan Dog. Gap chiusi:

- **`implement`** — vedi §9.1: Heavy Workflow con ledger, protocollo di stato implementer (DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED), subagent fresco per task instradato su `dispatching-parallel-agents`, gate di review per task via `/dylan-dog` Hunting.
- **`diagnosing-bugs`** — mancava il gate "3+ fix falliti → fermati, rimetti in discussione l'architettura" di `systematic-debugging`. Aggiunto alla Fase 5.
- **`tdd`** — mancava `testing-anti-patterns.md`. Aggiunta versione condensata (mock su comportamento reale, niente metodi test-only in produzione, mock senza capire le dipendenze, mock incompleti), linkata da tutte le sotto-skill di stack tramite la skill base.
- **`to-spec`** — non decomponeva in interfacce con contratti espliciti né aveva un self-review. Aggiunta richiesta di firme/tipi espliciti nella sezione Implementation (senza reintrodurre i path di file, scelta deliberata di questa skill) e un Self-Review (copertura/placeholder/coerenza tipi) prima del gate di premortem.
- **`using-sixth-sense`** — l'assenza della tabella di enforcement di `using-superpowers` era una scelta deliberata (§5.8) per tagliare l'overhead di ragionamento, non un errore da annullare in toto. Aggiunta una versione compatta (4 righe) solo per le skill model-invoked del flusso core, per non perdere l'innesco su richieste ambigue senza reintrodurre il costo pieno.
- **`hooks/session-start.js`** — scriveva markdown grezzo su stdout invece dell'envelope JSON per-piattaforma che usa la versione bash (`hookSpecificOutput.additionalContext` per Claude Code, `additional_context` per Cursor, `additionalContext` per Copilot). Riscritto con `JSON.stringify` (più robusto dell'escaping manuale bash) e la stessa logica di rilevamento piattaforma. Aggiunto un controllo automatico in `scripts/preflight.js` che esegue l'hook con le tre combinazioni di env var e verifica la chiave emessa — il rischio di regressione silenziosa su questo file era reale e ora ha una rete.
- **`code-review`** — aggiunta la nota sul reply nei thread inline di GitHub (non come commento top-level).
- **`dispatching-parallel-agents`** — aggiunta la caveat "il costo per turno batte il prezzo per token" all'Effort Routing, per non instradare tutto ciecamente sul tier più economico.

Non portato: una cartella `tests/` automatizzata in stile superpowers (~25 file). Contraddirebbe la convenzione dichiarata in `CLAUDE.md` ("test manuali"); il controllo automatico aggiunto a `scripts/preflight.js` copre il rischio concreto introdotto in questo giro (la regressione dell'hook) in modo proporzionato, senza costruire un'infrastruttura di test parallela non richiesta altrove nel repo.
