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
History, then the Web UI beside it). Each chapter zooms on one stage of
the lane; the payload card is the moving element. From ch6, a TEMPORAL
PROXY box sits at the right edge of YOUR ENVIRONMENT, and every connection
leaves through it.

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
    TEMPORAL"; on the right, the large payload card of the transfer (the
    four fields), a neon lock on its top edge: the lock snaps shut and the
    IBAN lines scramble into ciphertext, then back, on a slow loop keyed to
    the ambient clock.

## 01 Where the data starts

- **0:10** Nora sends €25,000 to Leo. The transfer Workflow runs in a
  Worker, in your own environment.
  - Visuals: The journey lane draws in: YOUR ENVIRONMENT on the left with a
    WORKER panel running the TransferWorkflow (a gear turning), the wire,
    TEMPORAL on the right with an empty EVENT HISTORY. The payload card
    appears inside the Worker, in clear; caption YOUR CODE RUNS HERE.
- **0:18** Temporal never runs your code: the Worker calls out to Temporal,
  with no inbound port open.
  - Visuals: Violet poll pulses run from the Worker to TEMPORAL, outward
    only, an OUTBOUND ONLY tag on the wire; on the environment's edge, a
    closed door icon with NO INBOUND PORTS; TEMPORAL's caption NEVER YOUR
    CODE.

## 02 On the wire

- **0:27** On its way out, the payload travels over TLS, so nobody on the
  network can read it.
  - Visuals: Zoom on the wire: the payload card leaves the Worker and rides
    the connection inside a neon tube labelled TLS; a red EAVESDROPPER tile
    under the wire sees only noise.
- **0:34** The Worker proves who it is: a certificate from your own CA, or
  an API key.
  - Visuals: The card pauses at TEMPORAL's edge; an identity badge slides
    from the Worker (two tabs: mTLS CERTIFICATE · YOUR CA, and API KEY),
    is checked and turns VERIFIED; a second, unknown client is turned away,
    REJECTED.
- **0:42** Each Namespace is isolated: the Worker reaches only the
  Namespace its credentials allow.
  - Visuals: TEMPORAL splits into three Namespace boxes, payments (lit),
    support and analytics (dim); the card enters payments only, a lock
    on each of the other two.

## 03 In the Event History

- **0:51** Temporal saves the payload in the Event History: that's how a
  Workflow resumes after a crash.
  - Visuals: Zoom on TEMPORAL: the payload card lands in the EVENT HISTORY
    as row 2 "Activity completed: debitAccount", its fields shown in full
    in a payload chip; rows 1 "Workflow started: transfer" and 3 "Activity
    scheduled: creditAccount" around it.
- **0:59** TLS only protects the trip: once stored, the IBAN is readable by
  anyone who can read the history.
  - Visuals: The TLS tube fades out behind; the Web UI window appears
    beside the history and shows the same row with the IBAN and the name in
    clear; a red READABLE tag pops on the chip; two viewers stand by the
    window, OPERATOR and WEB UI USER.

## 04 Encrypted with your keys

- **1:08** A Data Converter encrypts the payload inside the Worker, with
  your keys, before it leaves.
  - Visuals: Back to YOUR ENVIRONMENT: a DATA CONVERTER block, with a key
    and YOUR KEYS, sits between the Worker and the wire; the payload card
    passes through it, the lock snaps shut and its fields scramble once
    into ciphertext, then stay fixed.
- **1:16** Temporal stores and passes on only ciphertext: it never sees the
  IBAN.
  - Visuals: The sealed card crosses the wire and lands in the EVENT
    HISTORY: row 2's chip now shows ciphertext; the Web UI shows the same
    ciphertext; the READABLE tag becomes a violet NEVER SEES YOUR PAYLOADS.
- **1:24** Search Attributes stay in clear, so Temporal can index them:
  keep secrets out of them.
  - Visuals: Under the history, a SEARCH ATTRIBUTES strip in clear:
    `TransferStatus = DEBITED`, `Region = EU`; a slate INDEXED, NOT
    ENCRYPTED tag.
- **1:31** To read payloads in the Web UI, a Codec Server you run decrypts
  them for your browser.
  - Visuals: A CODEC SERVER block appears in YOUR ENVIRONMENT, with the same
    key; the Web UI window becomes a browser in your environment: the
    ciphertext travels from the browser to the CODEC SERVER and comes back
    in clear, IBAN visible; TEMPORAL's side stays sealed, KEYS NEVER
    SHARED.

## 05 The same work in every Worker

- **1:41** Now repeat that in every Worker, in every language: address,
  credentials, encryption code.
  - Visuals: The single Worker multiplies into six Worker panels in three
    languages (Go, Java, TypeScript tags), each one stacked with the same
    four chips: ADDRESS, CERTIFICATE, API KEY, CODEC.
- **1:49** Rotate a certificate or a key, and every Worker must pick it up.
  - Visuals: A ROTATE pill sweeps across the Workers, each one flashing
    UPDATE as it passes.
- **1:55** Forget the codec in one Worker, and its payloads go out in
  clear.
  - Visuals: One Worker's CODEC chip is missing: its payload card goes out
    in clear along the wire, a red IN CLEAR tag on it.

## 06 Meet Temporal Proxy

- **1:59** Meet Temporal Proxy: one gateway in your network, between your
  apps and Temporal.
  - Visuals: The Workers' chips fall away; a TEMPORAL PROXY box slides into
    the right edge of YOUR ENVIRONMENT; every Worker, an SDK client and the
    Web UI connect to it, and one connection leaves it for TEMPORAL.
- **2:07** Workers only know a local address and a short Namespace name: no
  certificate, no API key.
  - Visuals: Each Worker shows two lines only, `proxy:7233` and
    `payments`; NO SECRETS tag under the Workers.
- **2:15** On the way out, the proxy adds TLS, the credentials and the full
  Namespace name.
  - Visuals: The payload card leaves a Worker in a plain connection to the
    proxy, then gets, one by one, the TLS tube, the identity badge (API KEY)
    and the Namespace rewritten from `payments` to
    `payments.a1b2c` before it goes out to TEMPORAL; CREDENTIALS IN ONE
    PLACE.

## 07 Encryption without code changes

- **2:25** The proxy can also encrypt every payload on its way out, with no
  change to Worker code.
  - Visuals: The CODEC chips are gone from every Worker; the payload card
    leaves a Worker in clear and is sealed inside TEMPORAL PROXY: the lock
    snaps shut and the fields scramble; NO CODE CHANGE.
- **2:33** Payloads are sealed with short-lived data keys, wrapped by a key
  you own in your KMS.
  - Visuals: Inside the proxy, a small DATA KEY seals the card
    (AES-256-GCM); a YOUR KMS block (AWS KMS · AZURE KEY VAULT · GCP KMS)
    beside the proxy wraps the data key, which leaves with the payload.
    The KMS key never moves.
- **2:41** Data keys rotate on their own, and the proxy never holds your KMS
  key.
  - Visuals: The data key ticks over twice, DATA KEY 1, 2, 3, old payloads
    keeping their own; the KMS key stays put in YOUR KMS, NEVER LEAVES.
- **2:48** If the KMS can't be reached, the call fails: nothing leaves in
  clear.
  - Visuals: The link to YOUR KMS breaks (red); the next payload card stops
    at the proxy, red CALL FAILED, nothing on the wire; FAIL CLOSED.
- **2:55** Its built-in Codec Server lets the Web UI and the CLI show the
  decrypted payloads.
  - Visuals: The link heals; the Web UI and a CLI window connect through the
    proxy and show row 2 with the IBAN in clear, while TEMPORAL still
    stores ciphertext.

## 08 Change Temporal, not your code

- **3:05** Moving from your own Temporal Service to Temporal Cloud is a
  proxy setting: Workers don't change.
  - Visuals: On the right, two upstreams: SELF-HOSTED (lit) and the
    official logo followed by "Cloud"; a ROUTING switch in the proxy flips
    from SELF-HOSTED to CLOUD; the connection redraws to Temporal Cloud
    while the Workers and their two lines stay still; WORKERS UNCHANGED.

## 09 What you get

- **3:14** Your code stays home, every connection is verified, Temporal
  sees only ciphertext, Workers hold no secrets.
  - Visuals: 4 tall benefit tiles land one at a time across the frame,
    each lighting up as it lands: NO INBOUND PORTS (closed door) /
    VERIFIED CONNECTIONS (badge) / YOUR KEYS ONLY (key) / NO SECRETS IN
    WORKERS (lock).

## 10 What you can build

- **3:24** Nora's transfer is one example: any Workflow that handles
  sensitive data fits.
  - Visuals: 4 tall use-case tiles, the row every theme's use cases share,
    pop in one at a time, each with an example in slate under the label:
    HEALTH CLAIMS (medical cross) "a diagnosis stays sealed" / KYC
    ONBOARDING (ID card) "passport scans, encrypted" / PAYROLL RUNS
    (calendar) "salaries never in clear" / AI AGENTS ON CUSTOMER DATA
    (robot) "prompts and replies sealed".
- **3:31** Health claims, KYC onboarding, payroll runs, AI agents on
  customer data: the data stays yours.
  - Visuals: The full row; each tile lights up in turn as the subtitle
    names it.

## Outro

- **3:40** With Temporal, your code, your keys and your data stay yours.
  - Visuals: A shield with a neon lock above the title "Security", tagline
    "YOUR CODE, YOUR KEYS, YOUR DATA", Temporal logo.
