# Security with Temporal

Where your code runs, what Temporal stores, who holds the keys, and what
Temporal Proxy adds.

[Watch the video](/themes/security/)

A Workflow moves €25,000: account numbers, names, amounts. Who can see that data
on its way?

## Chapter 1: Where the data starts

[Watch from 0:10](/themes/security/#t=10)

Nora sends €25,000 to Leo. The transfer Workflow runs in a Worker, in your own
environment. Temporal never runs your code: the Worker calls out to Temporal,
with no inbound port open.

## Chapter 2: On the wire

[Watch from 0:25](/themes/security/#t=25)

On its way out, the payload travels over TLS, so nobody on the network can read
it. With Temporal Cloud, AWS PrivateLink or Google Private Service Connect can
keep it off the public internet. The Worker proves who it is: a certificate from
your own CA, or an API key. Each Namespace is isolated: the Worker reaches only
the Namespace its credentials allow.

## Chapter 3: In the Event History

[Watch from 0:52](/themes/security/#t=52)

Temporal saves the payload in the Event History: that's how a Workflow resumes
after a crash. TLS only protects the trip: once stored, the IBAN is readable by
anyone who can read the history.

## Chapter 4: Encrypted with your keys

[Watch from 1:08](/themes/security/#t=68)

A Data Converter encrypts the payload inside the Worker, with your keys, before
it leaves. Temporal stores and passes on only ciphertext: it never sees the
IBAN. Search Attributes stay in clear, so Temporal can index them: keep secrets
out of them. To read payloads in the Web UI, a Codec Server you run decrypts
them for your browser.

## Chapter 5: The same work in every Worker

[Watch from 1:34](/themes/security/#t=94)

Now repeat that in every Worker, in every language: address, credentials,
encryption code. Rotate a certificate or a key, and every Worker must pick it
up. Forget the codec in one Worker, and its payloads go out in clear.

## Chapter 6: Meet Temporal Proxy

[Watch from 1:53](/themes/security/#t=113)

Meet Temporal Proxy: one gateway in your network, between your apps and
Temporal. Workers only know a local address and a short Namespace name: no
certificate, no API key. On the way out, the proxy adds TLS, the credentials and
the full Namespace name.

## Chapter 7: Encryption without code changes

[Watch from 2:14](/themes/security/#t=134)

The proxy can also encrypt every payload on its way out, with no change to
Worker code. Payloads are sealed with short-lived data keys, wrapped by a key
you own in your KMS. Data keys rotate on their own, and the proxy never holds
your KMS key. Its built-in Codec Server lets the Web UI and the CLI show the
decrypted payloads.

## Chapter 8: Change Temporal, not your code

[Watch from 2:43](/themes/security/#t=163)

Point the proxy at Temporal Cloud instead of your own Service: Workers don't
change.

## Chapter 9: Across Namespaces with Nexus

[Watch from 2:52](/themes/security/#t=172)

With Temporal Nexus, your Workflow can call another team's service, across
Namespaces, through an Endpoint. The Endpoint lets in only the Namespaces on its
allowlist, and callers never need to know what is behind it. Calls between
Namespaces travel over mTLS, and your Data Converter still encrypts the
payloads.

## Chapter 10: Audited and certified

[Watch from 3:16](/themes/security/#t=196)

Temporal Cloud is SOC 2 Type 2 certified and compliant with HIPAA, GDPR and
CCPA. Third parties audit and pen test it every year: audit results are in the
Temporal Trust Center.

## Chapter 11: What you get

[Watch from 3:32](/themes/security/#t=212)

Your code stays home, Temporal verifies every client, your keys encrypt, Workers
need no secrets.

## Chapter 12: What you can build

[Watch from 3:40](/themes/security/#t=220)

A bank transfer is one example: any Workflow that handles sensitive data fits.
Health claims, KYC onboarding, payroll runs, AI agents on customer data: the
data stays yours.

## Outro

[Watch from 3:54](/themes/security/#t=234)

With Temporal, your code, your keys and your data stay yours.
