# Temporal Proxy 1.0

Temporal Proxy 1.0 is ready for production: one gateway that keeps credentials
and payload encryption out of your Temporal Workers.

[Watch the video](/themes/temporal-proxy/)

Meet Temporal Proxy 1.0: released on October 16, 2026, and ready for production.

## Chapter 1: Security in every team

[Watch from 0:09](/themes/temporal-proxy/#t=9)

Without it, every Worker carries an address, credentials and encryption code.
With many teams, each wires its own: security varies from one Worker to the
next.

## Chapter 2: One gateway, no secrets

[Watch from 0:23](/themes/temporal-proxy/#t=23)

Temporal Proxy is one gateway in your network: Workers only know a local
address. On the way out, it adds TLS, the credentials and the full Namespace
name.

## Chapter 3: Encryption with your keys

[Watch from 0:38](/themes/temporal-proxy/#t=38)

It encrypts your payloads with data keys wrapped by your KMS, with no Worker
code change.

## Chapter 4: Security as a shared service

[Watch from 0:45](/themes/temporal-proxy/#t=45)

A central platform team can run the proxy as a shared service for every team.
One policy for all: per-Namespace encryption, client authentication, encryption
required, metrics.

## Chapter 5: Why 1.0 matters

[Watch from 1:00](/themes/temporal-proxy/#t=60)

Version 1.0 is ready for production, and Temporal's support policy covers it.

## Outro

[Watch from 1:07](/themes/temporal-proxy/#t=67)

Credentials and encryption leave your Workers for one place you control.
