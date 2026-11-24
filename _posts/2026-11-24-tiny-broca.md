---
layout: post
permalink: /projects/tiny-broca/
title: "tiny-broca"
date: 2026-11-24
excerpt: "Modelo aberto de texto para fala em português brasileiro, com 4,5 milhões de parâmetros e duas vozes."
description: "tiny-broca é um modelo de síntese de fala em português brasileiro treinado do zero, com duas vozes, saída a 24 kHz e execução em CPU ou no navegador."
content_type: project
tags:
- text-to-speech
- machine-learning
- portuguese
comments: false
feature: /assets/generated/tiny-broca.jpg
---

**tiny-broca** é minha adaptação do tiny-voca para português brasileiro. O modelo foi treinado do zero, tem 4,5 milhões de parâmetros, incluindo o gerador de áudio, e produz fala a 24 kHz em duas vozes. Ele roda em CPU; a [demonstração](https://tiny-broca-demo.pages.dev/) faz a síntese inteira no navegador.

A entrada usa letras e marcação de sílaba tônica, sem dicionário de pronúncia. Para o treinamento, usei cerca de 17 horas de fala sintética gerada com Qwen3-TTS, após controle de qualidade. O código, os pesos, o conjunto de dados e a receita de treinamento estão abertos.

Eric Bezzam [mencionou o projeto](https://x.com/EricBezzam/status/2125149984827818383) entre as adaptações do tiny-voca feitas pela comunidade para outros idiomas.

### Links
[Demonstração](https://tiny-broca-demo.pages.dev/){: .btn .btn-info}
[GitHub](https://github.com/brenorb/tiny-broca){: .btn .btn-info}
[Modelo e pesos](https://huggingface.co/brenorb/tiny-broca){: .btn .btn-info}
[Conjunto de dados](https://huggingface.co/datasets/brenorb/tiny-broca){: .btn .btn-info}
