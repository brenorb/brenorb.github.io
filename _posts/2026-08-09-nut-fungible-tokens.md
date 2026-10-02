---
layout: post
permalink: /projects/nut-fungible-tokens/
lang: en
title: "Nut Fungible Tokens (NutFT)"
date: 2026-08-09
excerpt: "A draft Cashu extension for collectible cards, credentials, and other identifiable bearer assets."
description: "Nut Fungible Tokens is a draft application-level extension for Cashu proofs that preserves asset identity across transfers, with a trading-card application profile."
content_type: project
tags:
- bitcoin
- cashu
- ecash
- collectibles
comments: false
feature: /assets/generated/nut-fungible-tokens.jpg
---

**Nut Fungible Tokens (NutFT)** is a proposal I developed for representing **individually identifiable bearer assets with Cashu proofs**.

Cashu already provides the primitives for issuing and transferring ecash. NutFT explores how those same primitives can represent a collectible card, an entitlement, or a credential whose identity must survive a change of owner.

## Preserving the asset

An ordinary Cashu swap can replace a proof without preserving application-specific information. For an identifiable asset, that would mean losing what the token represents.

NutFT binds each proof to a **collection identifier**, an **asset identifier**, and a **catalog location**. A NutFT-aware mint validates this binding and preserves it when issuing a replacement proof. Ownership keys and proof-specific data can change while the represented asset stays the same.

Each asset proof has an amount of **one**. Artwork, attributes, and descriptions live in the application's catalog, keeping the token's asset reference small.

## Trading cards as an application

The repository includes a **trading-card demo specification** built on the general proposal. It describes cards represented by separate proofs, a signed catalog, and wallet verification of catalog signatures and artwork hashes.

The broader idea is to reuse Cashu's mint and wallet model for application assets, with explicit rules for issuance, transfers, and catalog migrations.

## Status and privacy

The specification is an **exploratory draft**. Its working designation, **NUT-31**, is not an official Cashu NUT assignment, and ordinary Cashu wallets and mints cannot be assumed to preserve NutFT assets during swaps.

The mint can see asset identity and metadata. Optional blinded recipient keys can reduce key-based linkability, but they do not hide which asset is being transferred from the mint.

### Links
[GitHub Repo](https://github.com/brenorb/NutFT){: .btn .btn-info}
[Draft Specification](https://github.com/brenorb/NutFT/blob/main/31.md){: .btn .btn-info}
[Trading-card Demo Specification](https://github.com/brenorb/NutFT/blob/main/docs/demo-spec.md){: .btn .btn-info}
