# Script and timeline: Security

Subtitles are the only narration (no audio). Each subtitle lasts as long
as its text needs (`autoDur` in `src/engine.js`), plus its `after` pause.
Run `make timeline THEME=security` for the live values; the start
times below are a snapshot from 2026-10-15.

Each entry gives the subtitle start time and its exact text, then what the
animation shows.

## Audience and goal

Tech leads, platform and security teams, CISOs evaluating Temporal: they
know TLS, certificates, API keys and KMS, and want to know where their code
runs, what Temporal can see, who holds the keys, and how to keep secrets out
of application code. Technical tone, no code or configuration on screen.

The video follows one payload on its way, from the Worker that creates it
to the Event History that stores it and the Web UI that shows it, and
reveals one security layer at each stage: where the code runs, the wire,
the history, encryption with the customer's keys. Then it shows the cost of
doing all that in every Worker, and Temporal Proxy as the answer: one
gateway that carries credentials and encryption, with no change to Worker
code.

Running example: Nora sends €25,000 to Leo. One payload card carries it
everywhere, the same in every chapter: `from: FR76 3000 6000 0112 3456
7890 189`, `to: DE89 3704 0044 0532 0130 00`, `name: Leo Martin`,
`amount: €25,000`. The euro sign goes with the IBANs.

Topics, in order: the Worker runs in your environment and calls out to
Temporal (ch1); TLS, identity, Namespace isolation (ch2); the Event History
stores payloads, readable without more (ch3); the Data Converter encrypts
with your keys, Search Attributes stay in clear, a Codec Server decrypts
for the Web UI (ch4); the same work in every Worker (ch5); Temporal Proxy,
a gateway that holds the connection settings and credentials (ch6);
encryption by the proxy (ch7); switching upstreams with no code change
(ch8).

Out of scope: SSO, roles, audit logs and certifications (they govern
people's access, not the payload's way), and the pre-release status of
Temporal Proxy, which the video does not mention.

### The journey lane

A horizontal lane shared by the chapters, left to right: YOUR ENVIRONMENT
(a dashed slate zone holding the Worker), the wire, TEMPORAL (the Event
History, then the Web UI beside it). Each chapter frames one stage of the
lane; the payload card is the moving element. From ch6, a TEMPORAL PROXY
box sits at the right edge of YOUR ENVIRONMENT, and every connection
leaves through it.

Within a chapter the camera travels one way; when the story needs
something from elsewhere, the content comes to the camera. From the intro
to ch8, and from ch9 to ch10, each chapter ends on the next one's first
frame (a match cut): a whip carries the card from ch2 into ch3, and a
rewind whip carries it from ch3 back to the Worker for ch4.

### Sources

- Temporal Cloud security model:
  <https://docs.temporal.io/evaluate/cloud/security>: Temporal "does not
  run or manage your applications or Workers"; the Data Converter encrypts
  data before it leaves, "Temporal Cloud cannot see or decrypt your data";
  a Codec Server lets the Web UI decrypt without sharing keys; TLS 1.3 on
  every connection; mTLS certificates from your CA or API keys; the
  Namespace is the unit of isolation.
- Workers poll Temporal over outbound connections, no inbound port:
  <https://temporal.io/blog/10-reasons-your-ciso-will-love-temporal-cloud>
  ("No inbound connectivity, ever").
- Search Attributes are not encrypted, so the service can index them:
  <https://docs.temporal.io/production-deployment/temporal-proxy/encrypt-payloads>.
- Temporal Proxy: <https://docs.temporal.io/production-deployment/temporal-proxy>
  and <https://github.com/temporalio/temporal-proxy>: a gRPC proxy between
  Workers, SDK clients, the Web UI and one or more upstream Temporal
  Services; Workers connect to one local endpoint with a short Namespace
  name, the proxy attaches TLS, credentials (API key or mTLS) and the
  upstream's Namespace name; routing by Namespace, `routing.default`
  fallback; built-in Codec Server for the Web UI and the CLI.
- Proxy encryption:
  <https://docs.temporal.io/production-deployment/temporal-proxy/encrypt-payloads>:
  no Worker or Client code change; short-lived data keys encrypt payloads
  with AES-256-GCM, wrapped by a KMS key you own (AWS KMS, Azure Key Vault,
  GCP KMS, or your own key server); "The proxy never holds key material";
  DEK rotation is automatic; fail-closed: if the KMS is unavailable, the
  request fails rather than falling back to plaintext.

## Intro

- **0:01** A Workflow moves €25,000: account numbers, names, amounts. Who
  can see that data on its way?
  - Visuals: Temporal logo, kicker "AN EXPLAINER FOR SECURITY TEAMS",
    title "Who can see your Workflow data?", tagline "SECURITY WITH
    TEMPORAL"; on the right, the large PAYLOAD card of the transfer (the
    four fields) on a soft violet glow, a lock badge on its top edge: on a
    slow loop keyed to the ambient clock, the lock snaps shut with neon
    ripples and the two IBANs scramble into ciphertext, then back. At the
    end the card clears, the title fades, and the card flies on a low arc,
    shrinking, to the Worker's place on the lane, faint violet outlines
    trailing it.

## 01 Where the data starts

- **0:10** Nora sends €25,000 to Leo. The transfer Workflow runs in a
  Worker, in your own environment.
  - Visuals: Opens on the card alone where the intro left it. The journey
    lane draws in stroke by stroke: a violet outline closes round the card
    into a WORKER panel (a gear turning, RUNNING, `workflow
    TransferWorkflow`), then the dashed YOUR ENVIRONMENT edge, the wire
    out to an arrow, TEMPORAL with its logo and an EMPTY EVENT HISTORY
    card. The camera leans slowly toward your environment as YOUR CODE
    RUNS HERE swells in under the Worker.
- **0:17** Temporal never runs your code: the Worker calls out to Temporal,
  with no inbound port open.
  - Visuals: TEMPORAL's caption NEVER YOUR CODE; violet poll pulses run
    outward only along the wire, an OUTBOUND ONLY tag above it, and a
    closed door appears on the environment's edge. Dramatic beat: a red
    probe flies in from outside, hits the door (red ripples) and bounces
    off; NO INBOUND PORTS slams in beside the door and shakes the frame.
    At the end the camera pushes in on the Worker and the wire's start,
    the zones dimming at the frame's edges.

## 02 On the wire

- **0:25** On its way out, the payload travels over TLS, so nobody on the
  network can read it.
  - Visuals: The same close framing, the door gone. A neon glass tube
    labelled TLS draws from the Worker into TEMPORAL around the wire,
    light flowing toward Temporal; the card lifts out of the Worker,
    shrinks into the tube and rides it, the camera following it right.
    Dramatic beat: an EAVESDROPPER tile rises under the wire, LISTENING;
    its red beam searches the tube and locks on the card: a red scan line,
    ciphertext glyphs pouring down the beam into its readout, which fills
    with base64 noise; the beam lets go and UNREADABLE pops.
- **0:32** The Worker proves who it is: a certificate from your own CA, or
  an API key.
  - Visuals: In the held tube shot, an IDENTITY badge (two tabs: mTLS
    CERTIFICATE · YOUR CA, and API KEY) leaves the Worker, grows on its
    way and lands above the tube's end; a neon scan line checks it and it
    turns VERIFIED. Dramatic beat: an UNKNOWN CLIENT (no credentials)
    rises under the tube; its request hits a red barrier at TEMPORAL's
    edge with a red flash and a shake: REJECTED.
- **0:38** Each Namespace is isolated: the Worker reaches only the
  Namespace its credentials allow.
  - Visuals: The camera moves right onto TEMPORAL; a light sweep splits it
    into three Namespace bands, support, payments (around the Event
    History, level with the tube) and analytics; payments lights violet,
    the other two dim and a padlock snaps shut on each; the card enters
    payments. At the end the camera whips right toward the Event History.

## 03 In the Event History

- **0:45** Temporal saves the payload in the Event History: that's how a
  Workflow resumes after a crash.
  - Visuals: The whip lands close on the EVENT HISTORY with a violet
    ripple, and the Namespace bands fade. The card docks as the payload
    chip under row 2 "Activity completed: debitAccount", its fields shown
    in full, between rows 1 "Workflow started: transfer" and 3 "Activity
    scheduled: creditAccount"; each row gets a SAVED tag.
- **0:52** TLS only protects the trip: once stored, the IBAN is readable by
  anyone who can read the history.
  - Visuals: The tube fades and, with no camera move, the content comes to
    the camera: the history slides left and a column comes in on the
    right, a TEMPORAL WEB UI window showing row 2 with the IBAN and the
    name in clear, over two viewers, OPERATOR and WEB UI USER. Dramatic
    beat: a red READABLE tag slams onto the chip (red rings, a flash, a
    shake), the Web UI's IBAN turns red, eyes open on both viewers, and a
    red lens sweeps the chip's IBAN, its digits magnified. At the end the
    frame stutters (jitter, a red and violet split), then a copy of the
    card streaks back along the wire into the Worker, ghost outlines
    trailing, as the camera whips left: a rewind.

## 04 Encrypted with your keys

- **1:00** A Data Converter encrypts the payload inside the Worker, with
  your keys, before it leaves.
  - Visuals: A close shot of the Worker, the card back in it in clear. A
    DATA CONVERTER tile (a key, YOUR KEYS) pops in beside it and lowers a
    violet light gate on a stem. Dramatic beat: the key spins once, the
    card passes through the gate and each value turns into ciphertext as
    it crosses, violet glyphs raining off the gate; the lock snaps shut
    with violet rings, and the ciphertext stays fixed.
- **1:07** Temporal stores and passes on only ciphertext: it never sees the
  IBAN.
  - Visuals: The camera tracks the sealed card along the wire back to the
    close layout of the Event History, where it lands as row 2's chip, now
    in ciphertext; READABLE flips over into a violet NEVER SEES YOUR
    PAYLOADS, and the Web UI comes back in the right column showing the
    same ciphertext.
- **1:12** Search Attributes stay in clear, so Temporal can index them:
  keep secrets out of them.
  - Visuals: Under the Web UI, a SEARCH ATTRIBUTES panel in clear:
    `TransferStatus = DEBITED` and `Region = EU`, a light sweep across
    them, then a slate INDEXED, NOT ENCRYPTED tag; a red dashed
    `iban = FR76` slides in beside them and is struck out.
- **1:18** To read payloads in the Web UI, a Codec Server you run decrypts
  them for your browser.
  - Visuals: The camera pulls back to the whole lane; the Worker, the wire
    and the converter step aside, and the Web UI window flies into YOUR
    ENVIRONMENT, growing into YOUR BROWSER · WEB UI. A CODEC SERVER (the
    same key, YOUR KEYS) appears under it: the IBAN goes down to it in
    ciphertext and comes back up in clear, and the browser shows the IBAN
    and the name, its border flashing neon. KEYS NEVER SHARED sits between
    the zones; TEMPORAL's side, dimmed, stays sealed. At the end the
    chapter clears to the bare lane, the Worker back, and the camera pulls
    back a little further.

## 05 The same work in every Worker

- **1:26** Now repeat that in every Worker, in every language: address,
  credentials, encryption code.
  - Visuals: The lane opens into a fleet: YOUR ENVIRONMENT widens and five
    copies peel off the Worker, six Worker tiles in three columns and two
    rows, each with a language tag and its logo (Go, Java, TypeScript);
    four chips drop into each in step with the words: ADDRESS,
    CERTIFICATE, API KEY, CODEC. Each Worker draws its own connection
    through the channel between the rows to TEMPORAL, where a CONNECTIONS
    list adds one VERIFIED row per Worker (worker-1 · Go, and so on).
- **1:33** Rotate a certificate or a key, and every Worker must pick it up.
  - Visuals: A ROTATE pill sweeps across the fleet; each Worker flashes
    neon as it passes, an UPDATE panel flipping over its CERTIFICATE and
    API KEY chips.
- **1:38** Forget the codec in one Worker, and its payloads go out in
  clear.
  - Visuals: The sixth Worker's CODEC slot blinks into a red dashed NO
    CODEC outline; its border and connection turn red, and a payload card
    leaves it in clear and grows on its way into TEMPORAL, where its row
    turns red. Dramatic beat: a red IN CLEAR tag slams onto the card, with
    a red flash, a shake and red rings. At the end every chip falls off
    every Worker.

## 06 Meet Temporal Proxy

- **1:45** Meet Temporal Proxy: one gateway in your network, between your
  apps and Temporal.
  - Visuals: YOUR ENVIRONMENT widens and an SDK CLIENT and a WEB UI tile
    join the fleet in a fourth column; a TEMPORAL PROXY box slides in onto
    the environment's right edge and lands with a violet glow and rings.
    The eight connections draw one after the other, converging into the
    proxy, and one violet connection leaves it for TEMPORAL, light
    flowing through.
- **1:51** Workers only know a local address and a short Namespace name: no
  certificate, no API key.
  - Visuals: Each Worker types two lines only, `proxy:7233` and
    `payments`; a NO SECRETS tag appears under the Workers.
- **1:58** On the way out, the proxy adds TLS, the credentials and the full
  Namespace name.
  - Visuals: A payload card, its `payments` tag on its edge, rides from a
    Worker into the proxy as the camera pushes right and in. Dramatic
    beat, three clicks at the proxy, each a swell with neon rings: the TLS
    tube draws out to TEMPORAL, an API KEY tag docks under the card, and
    `.a1b2c` types after `payments`. The card goes out through the tube
    into a payments.a1b2c Namespace risen in TEMPORAL; CREDENTIALS IN ONE
    PLACE. At the end the camera pushes into the proxy box.

## 07 Encryption without code changes

- **2:07** The proxy can also encrypt every payload on its way out, with no
  change to Worker code.
  - Visuals: Close on the proxy box, TEMPORAL sliding into the shot beyond
    the TLS tube. A card rides in from a Worker in clear and is sealed
    inside the proxy: the lock snaps shut, the fields scramble, violet
    rings; NO CODE CHANGE. The sealed card goes out through the tube and
    becomes the first row of STORED PAYLOADS in TEMPORAL: ciphertext and
    WRAPPED 1 behind a lock.
- **2:13** Payloads are sealed with short-lived data keys, wrapped by a key
  you own in your KMS.
  - Visuals: YOUR KMS pops in beside the proxy (a KMS KEY; AWS KMS · AZURE
    KEY VAULT / GCP KMS · YOUR KEY SERVER), linked to a DATA KEY 1 under
    the proxy's name. The data key seals the next card (AES-256-GCM); a
    DATA KEY 1 tag travels along the link to the KMS, comes back as
    WRAPPED KEY 1 and docks on the card, which goes out with it to row 2.
    The KMS key never moves.
- **2:20** Data keys rotate on their own, and the proxy never holds your KMS
  key.
  - Visuals: The data key flips over to DATA KEY 2, then 3, sealing cards
    from other Workers into rows 3 and 4 (WRAPPED 2, WRAPPED 3); NEVER
    LEAVES appears beside the KMS key, and the two rows sealed with key 1
    glow: old payloads keep their own.
- **2:26** If the KMS can't be reached, the call fails: nothing leaves in
  clear.
  - Visuals: Dramatic beat: the link to YOUR KMS snaps (red halves,
    sparks, a red cross, a shake) and the data key dims; a red
    hazard-striped gate drops across the tube's mouth. The next card, in
    clear, slams into the gate (a red flash, a shake) and turns red: CALL
    FAILED; the tube goes dark and FAIL CLOSED stamps across it.
- **2:33** Its built-in Codec Server lets the Web UI and the CLI show the
  decrypted payloads.
  - Visuals: The link heals, the gate lifts and the failed card goes back
    to its Worker. The camera pulls back to the whole lane: CODEC SERVER /
    BUILT IN appears in the proxy box, and a TEMPORAL CLI and a TEMPORAL
    WEB UI window open over the client tiles, showing row 2 in ciphertext.
    Row 2 travels from TEMPORAL into the proxy, and both windows decrypt
    it, the IBAN and Leo Martin in clear, while TEMPORAL's STORED PAYLOADS
    stay in ciphertext: CIPHERTEXT ONLY.

## 08 Change Temporal, not your code

- **2:42** Moving from your own Temporal Service to Temporal Cloud is a
  proxy setting: Workers don't change.
  - Visuals: The same wide shot. TEMPORAL narrows into the upper of two
    upstreams, the official logo above "Self-hosted" (a server icon), the
    proxy's connection bending up to it; Temporal Cloud rises in under it,
    the logo above "Cloud" (a cloud icon), dim; a ROUTING switch docks
    under the proxy box, its knob on SELF-HOSTED. Dramatic beat: the
    switch flips to CLOUD with neon rings, the connection tears off the
    self-hosted service in sparks and redraws down to Temporal Cloud,
    which lights up, while the Workers and their two lines stay still;
    WORKERS UNCHANGED.

## 09 What you get

- **2:51** Your code stays home, every connection is verified, Temporal
  sees only ciphertext, Workers hold no secrets.
  - Visuals: 4 tall benefit tiles drop in one at a time across the frame
    as the subtitle names them, each lighting up as it lands while the
    padlock badge on its top edge snaps shut with neon ripples: NO INBOUND
    PORTS (closed door) / VERIFIED CONNECTIONS (badge) / YOUR KEYS ONLY
    (key) / NO SECRETS IN WORKERS (a key struck through).

## 10 What you can build

- **3:00** Nora's transfer is one example: any Workflow that handles
  sensitive data fits.
  - Visuals: Opens on the recap row, padlocks shut; one at a time, each
    tile flips over in 3D into a use-case tile, the row every theme's use
    cases share, with an example in slate under the label: HEALTH CLAIMS
    (medical cross) "a diagnosis stays sealed" / KYC ONBOARDING (ID card)
    "passport scans, encrypted" / PAYROLL RUNS (calendar) "salaries never
    in clear" / AI AGENTS ON CUSTOMER DATA (robot) "prompts and replies
    sealed".
- **3:06** Health claims, KYC onboarding, payroll runs, AI agents on
  customer data: the data stays yours.
  - Visuals: The full row; each tile lights up in turn as the subtitle
    names it.

## Outro

- **3:14** With Temporal, your code, your keys and your data stay yours.
  - Visuals: A shield draws itself and fills above the title "Security",
    a padlock pops in and snaps shut with neon ripples; tagline "YOUR
    CODE, YOUR KEYS, YOUR DATA", Temporal logo.
