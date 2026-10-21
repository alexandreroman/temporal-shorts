# Script and timeline: Temporal Proxy 1.0

Subtitles are the only narration (no audio). Each subtitle lasts as long
as its text needs (`autoDur` in `src/engine.js`), plus its `after` pause.
Run `make timeline THEME=temporal-proxy` for the live values; the start
times below are a snapshot from 2026-10-21.

Each entry gives the subtitle start time and its exact text, then what the
animation shows.

## Audience and goal

Security teams, platform teams and developers who run Temporal Workers.
A news short: Temporal Proxy 1.0, published on October 16, 2026, is ready
for production and covered by Temporal's support policy. Technical tone,
no code or configuration on screen, apart from the two short lines a
Worker knows behind the proxy, `proxy:7233` and `payments`.

The video states the problem in one chapter (every Worker carries an
address, credentials and encryption code, and with many teams, each
wires its own, with no central control), then shows the proxy: one
gateway that adds TLS, the credentials and the full Namespace name on
the way out, and encrypts your payloads with data keys wrapped by your
KMS, with no Worker code change. Then it shows governance at company
scale: a
central platform team runs the proxy as a shared service for every team,
with one policy for all. It closes on what 1.0 means: ready for
production, and supported.

Running example: the security theme's transfer, Nora sends €25,000 to
Leo. One payload card carries it, the same card as in the security theme:
`from: FR76 3000 6000 0112 3456 7890 189`, `to: DE89 3704 0044 0532 0130
00`, `name: Leo Martin`, `amount: €25,000`.

Topics, in order: security in every team without the proxy (ch1); one
gateway, no secrets in the Workers (ch2); encryption with your keys
(ch3); the proxy as a shared service run by a platform
team, one policy for all (ch4); what 1.0 means (ch5).

Wording: the video says "ready for production" and "supported", never
"Public Preview", "GA" or "generally available". A news short ends on its
last topic chapter, then the outro: no "What you get" recap and no "What
you can build" chapter.

### Sources

- Release: <https://github.com/temporalio/temporal-proxy/releases/tag/v1.0.0>,
  Temporal Proxy v1.0.0, published on GitHub on 2026-10-16.
- README: <https://github.com/temporalio/temporal-proxy>: "Starting with
  version 1.0, Temporal Proxy is suitable for production use cases." A
  gRPC gateway between SDK Clients, Workers, the Web UI and upstream
  Temporal Services (self-hosted or Temporal Cloud); Namespace
  translation; TLS termination; per-upstream credentials (API key or mTLS),
  so clients carry none; envelope encryption, AES-256-GCM data keys wrapped
  by a key in your KMS (AWS KMS, Azure Key Vault, GCP KMS, or your own key
  server through an extension server), data keys rotating automatically;
  encryption fails closed (a failed wrap or unwrap fails the request), and
  `--require-encryption` stops the proxy from starting unless an
  encryption key is configured; encryption settings per Namespace
  (`encryption.overrides`); optional client authentication on the gateway
  (a static token or JWKS); Prometheus metrics; a built-in Codec Server for
  the Web UI and the CLI; installs as a Go binary, a container image or a
  Helm chart.
- Docs: <https://docs.temporal.io/production-deployment/temporal-proxy>:
  "Temporal's support policy covers v1.0 and later."

## Intro

- **0:01** Meet Temporal Proxy 1.0: released on October 16, 2026, and
  ready for production.
  - Visuals: Temporal logo, kicker "PRODUCT NEWS, OCTOBER 2026", title
    "Temporal" / "Proxy 1.0", tagline "SECURE EVERY WORKFLOW FROM ONE
    PLACE"; on the right, on a soft violet glow, the TEMPORAL PROXY box,
    three small Workers on its left (Go, Java, TypeScript logos) whose
    lines converge into it, and one violet connection leaving it, light
    flowing along them. As the subtitle reads "1.0", a neon 1.0 badge
    slams onto the box with neon rings and a swell of its glow. At the end
    the title fades, the lines pull back into the Workers, the box shrinks
    away, and the Workers fly out into the six slots of a fleet (copies
    peel out from under the flying Workers down to a second row) as YOUR
    ENVIRONMENT and TEMPORAL fade in round them: chapter 1 opens on that
    frame.

## 01 Security in every team

- **0:09** Without it, every Worker carries an address, credentials and
  encryption code.
  - Visuals: Opens on the intro's last frame: six Worker tiles (Go, Java,
    TypeScript logos) in YOUR ENVIRONMENT, TEMPORAL on the right, in a
    camera that holds still. A neon light sweeps over the Workers' borders
    as the subtitle reads "every Worker"; the chips ADDRESS, CERTIFICATE,
    API KEY and CODEC drop into each of the six Workers in step with the
    words; each Worker draws its own connection to TEMPORAL, light flowing
    along it, and TEMPORAL lists the six connections (worker-1 to
    worker-6, each with its language and VERIFIED).
- **0:15** With many teams, each wires its own: security varies from one
  Worker to the next.
  - Visuals: On "With many teams", a violet team tag pops onto each
    Worker's top right corner, one column after the other: PAYMENTS,
    ORDERS, FRAUD, two Workers each. On "each wires its own", every
    Worker's CODEC chip flips, down each column, to its own codec: CODEC
    V1, CODEC V2 or CUSTOM CODEC. On "security varies from one Worker to
    the next", four more chips flip and turn red, one Worker after the
    next: two CERT EXPIRING, two KEY IN ENV VAR; no two Workers match.
    Dramatic beat: a solid red NO CENTRAL CONTROL verdict slams in under
    the Workers, with red rings, a red flash and a shake. At the end every
    chip falls off the Workers and the team tags, the verdict, the
    connections and the list go, leaving the bare fleet that chapter 02
    opens on.

## 02 One gateway, no secrets

- **0:23** Temporal Proxy is one gateway in your network: Workers only know
  a local address.
  - Visuals: Opens on chapter 01's last frame. YOUR ENVIRONMENT widens as
    TEMPORAL narrows to the right, and the TEMPORAL PROXY box slides onto
    the environment's right edge, landing with a violet glow and rings;
    the Workers' connections converge into it, and one violet connection
    leaves it for TEMPORAL, light flowing along them. Each Worker types
    `proxy:7233` and `payments` (in violet); NO SECRETS under the Workers.
- **0:29** On the way out, it adds TLS, the credentials and the full
  Namespace name.
  - Visuals: A payload card, with a `payments` tag under it, leaves the
    top-right Worker and rides its connection into the proxy as the camera
    pushes right and in to a close shot on the proxy (the Workers and the
    zones dim, the Workers clipped to the content frame, their top row's
    headings fading). Dramatic beat, three clicks at the proxy, each with neon
    rings and a swell of its glow: the TLS tube draws to TEMPORAL (the
    card's border turns neon), an API KEY tag docks, `.a1b2c` types after
    `payments`. The card goes out through the tube into the
    payments.a1b2c Namespace in TEMPORAL, which lights up; CREDENTIALS IN
    ONE PLACE under the proxy. Before the cut the card, its tags, the
    Namespace and that tag fade out, leaving the close shot on the proxy
    and its TLS tube that chapter 03 opens on.

## 03 Encryption with your keys

- **0:37** It encrypts your payloads with data keys wrapped by your KMS,
  with no Worker code change.
  - Visuals: Opens on chapter 02's last frame, and the camera holds the
    close shot on the proxy. YOUR KMS (KMS KEY; AWS KMS, Azure Key Vault,
    GCP KMS, your key server) pops in on the proxy's left, at the top of
    the shot over the dimmed Workers, and its link draws from the KMS's
    bottom edge down and into the proxy's side, under its name. A payload
    card rides in from the bottom-right Worker, in clear, dropping under
    the KMS and its link; a dashed DATA KEY 1 tag pops in the proxy, its
    key flies onto the card's lock, the lock snaps shut and the fields
    scramble into ciphertext, with violet rings; NO CODE CHANGE under the
    proxy, where chapter 02 shows CREDENTIALS IN ONE PLACE. The DATA KEY travels along the link to the KMS's
    bottom edge, whose key swells and glows, and comes back as WRAPPED
    KEY 1, behind a lock, to dock on the card. The card goes out through
    the TLS tube and lands in TEMPORAL as a row of STORED PAYLOADS:
    ciphertext and WRAPPED 1, never a key Temporal could use. Before the
    cut the KMS, its link, NO CODE CHANGE and the stored payloads fade
    out, leaving the close shot on the proxy that chapter 04 opens on.

## 04 Security as a shared service

- **0:45** A central platform team can run the proxy as a shared service
  for every team.
  - Visuals: Opens on chapter 03's last frame; the camera pulls back, left
    and out, to the whole environment as the fleet regroups: YOUR
    ENVIRONMENT moves to hold the proxy inside it, TEMPORAL widens, a
    PLATFORM TEAM zone forms round the proxy, the six Workers travel into
    three team zones stacked on the left, PAYMENTS, ORDERS and FRAUD, two
    Workers side by side in each; on the way each Worker tile turns
    compact, keeping WORKER and its Namespace line while its language tag
    and `proxy:7233` fade out, and the Workers of ORDERS and FRAUD type
    their team's Namespace over `payments`. Each team's connection draws into the
    proxy, light flowing along it, and TEMPORAL shows one Namespace band
    per team: payments.a1b2c, orders.a1b2c, fraud.a1b2c.
- **0:50** One policy for all: per-Namespace encryption, client
  authentication, encryption required, metrics.
  - Visuals: A POLICY panel docks under the proxy, in the PLATFORM TEAM
    zone; its four rules, PER-NAMESPACE ENCRYPTION, CLIENT
    AUTHENTICATION, ENCRYPTION REQUIRED and METRICS, tick on with a neon
    check as the subtitle names them. Dramatic beat: the policy sweeps out
    from the proxy along every team's connection, a neon trail with a
    spark at its head; each team zone it reaches lights up neon, with neon
    rings and a COVERED tag. Chapter 05 opens on that frame.

## 05 Why 1.0 matters

- **0:59** Version 1.0 is ready for production, and Temporal's support
  policy covers it.
  - Visuals: Opens on chapter 04's last frame; the camera pulls back on,
    left and out, as everything but the proxy box fades, until the box
    sits small at the top of the frame. Under it a version track draws:
    ten dim dots for the 0.x releases, labelled 0.1 under the first and
    0.10 under the last, then an empty 1.0 slot. Dramatic beat: 1.0 lights
    up neon with rings; READY FOR PRODUCTION under it, its right edge on
    the badge's, then SUPPORTED as the subtitle reads "support policy",
    stacked under it, right-aligned on the same edge. The 1.0 badge rises
    up a faint dashed line onto the proxy box as the track and its tags
    drop away, leaving the box alone, wearing its badge: the outro's first
    frame.

## Outro

- **1:06** Credentials and encryption leave your Workers for one place you
  control.
  - Visuals: Opens on the proxy box with its 1.0 badge, small at the top;
    the end card fades in under it: title "Temporal Proxy 1.0", tagline
    "SECURE EVERY WORKFLOW FROM ONE PLACE", Temporal logo; a neon ring
    leaves the badge and the box's glow swells once.
