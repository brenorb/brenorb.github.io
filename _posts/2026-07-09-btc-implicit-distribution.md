---
layout: post
permalink: /projects/btc-implicit-distribution/
redirect_from:
  - /project/btc-implicit-distribution/
  - /btc-implicit-distribution/
lang: en
title: "btc-implicit-distribution - Bitcoin implied price distribution explorer"
date: 2026-07-09
excerpt: "Explore the market-implied BTC price distribution derived from Deribit options."
description: "btc-implicit-distribution is a static browser-based explorer that derives a risk-neutral BTC price distribution from live Deribit option quotes using Python and Pyodide."
content_type: project
tags:
- bitcoin
- options
- python
- finance
comments: false
feature: /assets/generated/btc-implicit-distribution.jpg
---

**btc-implicit-distribution** is a **static browser-based explorer for the market-implied future price distribution of Bitcoin**.

It fetches live BTC option quotes from **Deribit** and uses finite-difference butterflies to estimate a risk-neutral distribution for a selected expiry. The interface exposes the main assumptions so it is possible to inspect how smoothing, strike range, bid/ask envelopes, and the choice of puts or calls affect the result.

The project runs entirely in the browser: the pricing engine is written in **Python** and executed with **Pyodide**, while the chart is rendered with Plotly. There is no backend, and a short-lived local cache prevents repeated refreshes from hammering the public API.

This is a market-implied distribution, not a price oracle or a forecast. The first public commit was published on **2026-07-09**, which is the date used for this project entry.

### Links
[Live Site](https://btc-implicit-distribution.brenorb.com/){: .btn .btn-info}
[GitHub Repo](https://github.com/brenorb/btc-implicit-distribution){: .btn .btn-info}
