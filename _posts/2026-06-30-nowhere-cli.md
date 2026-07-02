---
layout: post
title: "nowhere-cli"
date: 2026-06-30
permalink: /projects/nowhere-cli/
excerpt: "CLI counterpart to Nowhere for creating, signing, and automating relay-backed sites."
description: "nowhere-cli is a CLI counterpart to Nowhere that covers fragment inspection, signing, encryption, site creation and updates, persisted signer sessions, and relay-backed store, petition, fundraiser, message, and forum flows."
content_type: project
tags:
- nostr
- cli
- agents
comments: false
feature: /assets/generated/nowhere-cli.jpg
---

**nowhere-cli** is a **CLI counterpart to Nowhere**.

It covers the full fragment lifecycle from the terminal: generate Nostr keys, inspect links, sign fragments, encrypt and decrypt them, create all eight Nowhere site types from structured JSON, and import, patch, or republish existing sites.

The more interesting part is that it goes beyond static authoring. The CLI also includes **relay-backed runtime flows** for store orders and checkout, petition signatures, fundraiser donations, message tips, forum activity, torrent publishing, moderation checks, and persisted **NIP-46 signer** sessions.

Commands meant for automation expose **`--json`** output, which makes the project especially useful for agentic and scripting workflows instead of only human-driven terminal use.

This project entry uses **2026-06-30**, the date of the first public commit in the repository.

### Links
[GitHub Repo](https://github.com/brenorb/nowhere-cli){: .btn .btn-info}
