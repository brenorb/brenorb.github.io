---
layout: post
title: "fast-transcript"
date: 2026-05-03
permalink: /projects/fast-transcript/
excerpt: "Fast local transcription for large lectures."
description: "fast-transcript is a local CLI for transcribing large lecture audio quickly with NVIDIA Parakeet ONNX, automatic audio normalization, and default chunking tuned for long runs."
content_type: project
tags:
- ai
- audio
- transcription
comments: false
---

**fast-transcript** is a local CLI for **transcribing large lectures quickly on a laptop**.

On the development machine, it handled **almost 30 minutes of lecture audio in a little over 2 minutes**: **29m47s** transcribed in about **2m14s** (**13.38x real-time**).

The project packages an ONNX Parakeet workflow behind a very short command:

```bash
fscript lecture.mp3
```

Or install it with Homebrew:

```bash
brew install brenorb/fast-transcript/fast-transcript
```

That command is enough to:

- fetch the default model if needed
- normalize the audio with `ffmpeg` when the input is not already in the expected format
- transcribe with long-audio defaults tuned for unattended runs
- write a JSON transcript next to the source audio

### Why I built it

I wanted a tool for **30-minute to 2-hour classes and lectures** that could run locally, stay fast, and avoid the usual friction of manual conversion steps and fragile command lines.

In local benchmarks on the same development machine, **fast-transcript** outperformed the other workflows I tested for this specific use case, including `mlx-whisper`, `insanely-fast-whisper`, and the tuned `parakeet-mlx` path.

### What shaped the implementation

This project was strongly informed by:

- [Handy](https://github.com/cjpais/Handy)
- [GLaDOS](https://github.com/dnhkng/GLaDOS)
- [transcribe-rs](https://github.com/cjpais/transcribe-rs)

The core direction came from the ONNX Parakeet path used in Handy and the packaging ideas surfaced in both Handy and GLaDOS.

### Links
[GitHub Repo](https://github.com/brenorb/fast-transcript){: .btn .btn-info}
