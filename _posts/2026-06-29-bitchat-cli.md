---
layout: post
title: "bitchat-cli"
date: 2026-06-29
permalink: /projects/bitchat-cli/
excerpt: "Clean-room Python CLI for BitChat over Bluetooth LE."
description: "bitchat-cli is a clean-room Python CLI for BitChat over Bluetooth LE, focused on public mesh chat, direct messaging, geohash-scoped Nostr channels, file transfer, and a background daemon."
content_type: project
tags:
- python
- bluetooth
- nostr
comments: false
feature: /assets/generated/bitchat-cli.jpg
---

**bitchat-cli** is a **clean-room Python CLI for BitChat over Bluetooth LE**.

The project is intentionally focused on **interoperable peer-to-peer communication**: public mesh chat, direct messages over **Noise XX**, local file transfer, and **geohash-scoped Nostr channels** for location-aware communication.

It also includes a background daemon so nearby traffic can keep being received and persisted even when no interactive chat session is open.

What makes the project interesting is that it stays grounded in **physical proximity**. The core surface is not a cloud chat app disguised as local-first software, but a real Bluetooth mesh workflow with offline-friendly behavior and explicit fallback paths where they make sense.

The first published tag in the repository is **`v0.1.0` on 2026-06-29**, which is the date used for this project entry.

### Links
[PyPI Package](https://pypi.org/project/bitchat4agents/){: .btn .btn-info}
