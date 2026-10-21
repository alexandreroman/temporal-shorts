# Script and timeline: Temporal Proxy 1.0

Subtitles are the only narration (no audio). Each subtitle lasts as long
as its text needs (`autoDur` in `src/engine.js`), plus its `after` pause.
Run `make timeline THEME=temporal-proxy` for the live values; the start
times below are a snapshot from 2026-10-21. Chapters 03 and 04 are still
to be built: their start times read `-:--` until then, and the outro's
time is the snapshot without them.

Each entry gives the subtitle start time and its exact text, then what the
animation shows.

## Audience and goal

Security teams, platform teams and developers who run Temporal Workers.
A news short: Temporal Proxy 1.0, published on October 16, 2026, is ready
for production and covered by Temporal's support policy. Technical tone,
no code or configuration on screen, apart from the two short lines a
Worker knows behind the proxy, `proxy:7233` and `payments`.

The video states the problem in one chapter (every Worker carries an
address, credentials and encryption code, and one forgotten codec sends
payloads out in clear), then shows the proxy: one gateway that adds TLS,
the credentials and the full Namespace name on the way out, encrypts every
payload with data keys wrapped by your KMS, with no Worker code change,
and fails closed when encryption is required and no key is configured.
It closes on what 1.0 means (ready for production, supported) and how
the proxy runs next to the Workers.

Running example: the security theme's transfer, Nora sends €25,000 to
Leo. One payload card carries it, the same card as in the security theme:
`from: FR76 3000 6000 0112 3456 7890 189`, `to: DE89 3704 0044 0532 0130
00`, `name: Leo Martin`, `amount: €25,000`.

Topics, in order: security in every Worker without the proxy (ch1); one
gateway, no secrets in the Workers (ch2); encryption with your keys,
failing closed (ch3); what 1.0 means and how to install it (ch4).

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
  encryption key is configured; a built-in Codec Server for the Web UI and
  the CLI; installs as a Go binary, a container image or a Helm chart.
- Docs: <https://docs.temporal.io/production-deployment/temporal-proxy>:
  "Temporal's support policy covers v1.0 and later."

## Intro

- **0:01** Meet Temporal Proxy 1.0: released on October 16, 2026, and
  ready for production.
  - Visuals: Temporal logo, kicker "PRODUCT NEWS, OCTOBER 2026", title
    "Temporal" / "Proxy 1.0", tagline "SECURITY MOVES OUT OF YOUR
    WORKERS"; on the right, on a soft violet glow, the TEMPORAL PROXY box,
    three small Workers on its left (Go, Java, TypeScript logos) whose
    lines converge into it, and one violet connection leaving it, light
    flowing along them. As the subtitle reads "1.0", a neon 1.0 badge
    slams onto the box with neon rings and a swell of its glow. At the end
    the title fades, the lines pull back into the Workers, the box shrinks
    away, and the Workers fly out into the six slots of a fleet (copies
    peel off them to a second row) as YOUR ENVIRONMENT and TEMPORAL fade in
    round them: chapter 1 opens on that frame.

## 01 Security in every Worker

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
- **0:15** Forget the codec in one Worker, and its payloads go out in
  clear.
  - Visuals: On "Forget the codec", the bottom-right Worker (Go) loses
    its CODEC chip, which drops off with a tilt and fades; the empty slot
    blinks red and stays a red dashed NO CODEC outline; its payload card
    leaves it in clear and grows into TEMPORAL, under the list, as that
    Worker, its connection and its row turn red. Dramatic beat: a solid
    red IN CLEAR tag slams onto the card, with red rings, a red flash and
    a shake, and the card turns red. At the end every remaining chip
    falls off the Workers and the connections, the list and the card go,
    leaving the bare fleet that chapter 02 opens on.

## 02 One gateway, no secrets

- **0:22** Temporal Proxy is one gateway in your network: Workers only know
  a local address.
  - Visuals: Opens on chapter 01's last frame. YOUR ENVIRONMENT widens as
    TEMPORAL narrows to the right, and the TEMPORAL PROXY box slides onto
    the environment's right edge, landing with a violet glow and rings;
    the Workers' connections converge into it, and one violet connection
    leaves it for TEMPORAL, light flowing along them. Each Worker types
    `proxy:7233` and `payments` (in violet); NO SECRETS under the Workers.
- **0:28** On the way out, it adds TLS, the credentials and the full
  Namespace name.
  - Visuals: A payload card, with a `payments` tag under it, leaves the
    top-right Worker and rides its connection into the proxy as the camera
    pushes right and in to a close shot on the proxy (the Workers and the
    zones dim). Dramatic beat, three clicks at the proxy, each with neon
    rings and a swell of its glow: the TLS tube draws to TEMPORAL (the
    card's border turns neon), an API KEY tag docks, `.a1b2c` types after
    `payments`. The card goes out through the tube into the
    payments.a1b2c Namespace in TEMPORAL, which lights up; CREDENTIALS IN
    ONE PLACE under the proxy. Before the cut the card, its tags, the
    Namespace and that tag fade out, leaving the close shot on the proxy
    and its TLS tube that chapter 03 opens on.

## 03 Encryption with your keys

- **-:--** It encrypts every payload with data keys wrapped by your KMS,
  with no Worker code change.
  - Visuals: Close on the proxy: a clear card from a Worker is sealed
    inside it (the lock snaps shut, the fields scramble, violet rings), NO
    CODE CHANGE; YOUR KMS beside the proxy (AWS KMS, Azure Key Vault, GCP
    KMS, your key server), a DATA KEY wrapped at the KMS (WRAPPED); the
    sealed card lands in TEMPORAL's stored payloads as ciphertext.
- **-:--** With encryption required, the proxy refuses to start without a
  key: it fails closed.
  - Visuals: Dramatic beat: the KMS link is cut, the proxy restarts and
    does not come up: a solid red REFUSED TO START verdict, the
    connection to TEMPORAL stays dark and no clear payload leaves. The
    link comes back and the proxy starts, neon.

## 04 Why 1.0 matters

- **-:--** Version 1.0 is ready for production, and Temporal's support
  policy covers it.
  - Visuals: The camera pulls back to a version track: the earlier 0.x
    releases dim, up to 0.10, then 1.0 lights up neon with READY FOR
    PRODUCTION and SUPPORTED tags.
- **-:--** It runs next to your Workers: a Go binary, a container image or
  a Helm chart.
  - Visuals: Three install tiles, GO BINARY, CONTAINER IMAGE and HELM
    CHART, next to the proxy inside YOUR ENVIRONMENT. At the end
    everything clears but the proxy box, wearing its 1.0 badge, as the
    camera pulls back until it sits small at the top of the frame.

## Outro

- **0:36** Credentials and encryption leave your Workers for one place you
  control.
  - Visuals: Opens on the proxy box with its 1.0 badge, small at the top;
    the end card fades in under it: title "Temporal Proxy 1.0", tagline
    "SECURITY OUT OF YOUR WORKER CODE", Temporal logo; a neon ring leaves
    the badge and the box's glow swells once.
