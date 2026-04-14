---
sitemap: false
layout: post
title:  "Granola - Cashu-based exchange"
date:   2024-11-06
excerpt: "3rd place and Best Nostr at SatsHack 2024, a Cashu + Nostr exchange concept."
project: true
tag:
- bitcoin
- cashu
- nostr
- ecash
- project
comments: false
feature:
---

**Granola** is a **Cashu-based exchange** concept built for **SatsHack by Vinteum** in October 2024, with the final pitch presented at **Satsconf 2024**.

The public SatsHack submission lists **Breno Brito** and **Luis Schwab** as the team behind the project, and states that the entire project was built during the hacking period.

SatsHack pitch
<iframe width="560" height="315" src="https://www.youtube.com/embed/Lq_zZx2cBXk" title="Granola SatsHack pitch" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## SatsHack / Satsconf 2024

Granola was part of the second **SatsHack by Vinteum**, a hackathon tied to **Satsconf 2024**. The public event timeline scheduled the final pitches for **November 8, 2024** at Satsconf, with winners announced on **November 9, 2024**.

Public coverage after the event recorded Granola as one of the highlighted winners:

- **No Bullshit Bitcoin** listed Granola as **3rd place overall** and **Best Nostr**.
- **Livecoins** also highlighted Granola among the winning Satsconf / SatsHack projects.
- **Portal do Bitcoin** had covered the hackathon beforehand, noting that SatsHack would culminate with finalists pitching at Satsconf.

## What the project proposed

The original SatsHack submission framed the main problem as privacy on Bitcoin on- and off-ramps. The proposed solution was to combine **Cashu** with **Nostr** so peers could publish and coordinate atomic, cross-mint ecash swaps without relying on a centralized exchange.

In practice, the idea was to treat different Cashu mints as currency-specific issuers and use the same hash/preimage across both sides of the trade. That turns the exchange into a peer-to-peer, privacy-first settlement flow rather than a custodial venue.

## Proposed flow

1. Alice generates a fresh ephemeral pubkey and publishes an order on Nostr.
2. Carol sees the order, creates her own ephemeral pubkey, and sends a DM with a pay request.
3. Alice generates a secret and sends `HTLC_c`, locked to the corresponding hash.
4. Carol verifies `HTLC_c`, creates `HTLC_a` with the same hash, and subscribes to its state change.
5. Alice swaps `HTLC_a`, revealing the preimage in the process.
6. Carol learns the preimage from that state transition and uses it to swap `HTLC_c`.

## Why it is interesting

- Nostr can work as a lightweight order-discovery and messaging layer.
- The exchange flow is peer-to-peer rather than custodial.
- The original hackathon framing pushed the idea beyond BTC-only settlement and toward cross-mint, multi-currency ecash swaps.
- The same direction can evolve into broader work on atomic swaps between Cashu mints.
- Granola starts as a protocol sketch first, not as a polished product.

## Status

Granola is currently an early design note rather than a production system. The interesting part is the mechanism: combining Nostr coordination with hash-locked exchange flows for Cashu-style e-cash.

## Links
[Official SatsHack Submission](https://eventornado.com/submission/granola?s=1){: .btn .btn-info}
[GitHub Repo](https://github.com/GranolaCash/granola){: .btn .btn-info}
[Pitch Video](https://www.youtube.com/watch?v=Lq_zZx2cBXk){: .btn .btn-info}
[No Bullshit Bitcoin Coverage](https://www.nobsbitcoin.com/gm-2024-11-22/){: .btn .btn-info}
[Livecoins Coverage](https://livecoins.com.br/satsconf-2024-maior-evento-de-bitcoin-no-brasil-discute-futuro-da-moeda-digital/){: .btn .btn-info}
[Portal do Bitcoin on SatsHack](https://portaldobitcoin.uol.com.br/vinteum-anuncia-hackathon-para-desenvolvedores-de-bitcoin-e-lightning-network/){: .btn .btn-info}
