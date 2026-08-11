---
layout: post
lang: en
title: "filepizza-cli"
date: 2026-07-03
permalink: /project/filepizza-cli/
excerpt: "Programmatic CLI for creating and seeding FilePizza uploads without driving a browser."
description: "filepizza-cli is a small TypeScript CLI for creating and seeding FilePizza uploads programmatically, with short and long share URLs, background seeding, JSON output, and local upload state."
content_type: project
tags:
- typescript
- cli
- p2p
comments: false
---

**filepizza-cli** is a **small TypeScript CLI for creating and seeding FilePizza uploads without driving a browser**.

The project is built around a simple goal: make **`file.pizza`** usable from automation and agent workflows instead of only through the website UI.

Right now the scope is intentionally narrow and practical: **single-file uploads**, **short and long share URLs**, **background seeding**, `share` / `status` / `stop` commands, **JSON output for agent consumption**, and local manifest state under **`~/.cache/filepizza-cli/uploads/`**.

What makes it interesting is that it stays close to the public FilePizza protocol surface rather than wrapping a browser session. That keeps the tool small, scriptable, and easier to compose with other terminal or autonomous workflows.

The first public commit in the repository is on **2026-07-03**, which is the date used for this project entry.

### Links
[npm Package](https://www.npmjs.com/package/filepizza-cli){: .btn .btn-info}
[GitHub Repo](https://github.com/brenorb/filepizza-cli){: .btn .btn-info}
