---
layout: post
title:  "Podcast - Fountain - Stealth"
date:   2026-04-08 12:00:00 -0300
description: "Participação no Freedom Tech Friday sobre o Stealth, ferramenta open source para auditar vazamentos de privacidade em carteiras Bitcoin a partir de descriptors públicos e heurísticas inspiradas em chain analysis."
category: podcast
tags: [bitcoin, privacy, hackathon]
comments: false
share: true
content_type: media
excerpt: "Episódio na Fountain sobre o projeto Stealth, focado em auditoria de privacidade para carteiras Bitcoin."
feature: /assets/generated/stealth.png
---

<video controls preload="none" width="100%" poster="https://assets.podhome.fm/df3c7f87-bdab-41fe-1438-08dbf068e250/639090529728929923ftf-33.jpg">
  <source src="https://assets.podhome.fm/df3c7f87-bdab-41fe-1438-08dbf068e250/alt_639090539395515589_2bb2be89-a822-49bf-acbc-ef45291ae0da.mp4" type="video/mp4">
</video>

Este episódio do `Freedom Tech Friday`, publicado na `Fountain`, é uma conversa sobre o [Stealth](https://github.com/stealth-bitcoin/stealth), ferramenta open source criada para colocar nas mãos do usuário uma parte do poder analítico que normalmente fica com empresas de `chain analysis`. A ideia é simples e forte: você cola o `public descriptor` da sua carteira, roda tudo localmente e recebe um relatório de vazamentos de privacidade com sugestões de correção.

{% include generated/podcast-stealth-fountain-chapters.html %}

Boa parte do valor da conversa está em explicar o problema com exemplos concretos. O episódio passa por `address reuse`, `common input ownership`, `dust attacks`, detecção de troco, consolidação de `UTXOs`, padrões temporais de recebimento, origem em exchanges e outras heurísticas comportamentais que podem transformar transações aparentemente soltas em um mapa cada vez mais legível da vida financeira de alguém. A distinção importante aqui é que o `Stealth` não promete bala de prata; ele ajuda a enxergar os trade-offs que já existem.

Também ficou bem documentada a origem do projeto. O `Stealth` nasceu num hackathon do `Bitcoin++` voltado a exploits, foi montado como `proof of concept` em menos de 24 horas e, naquele estágio, rodava em `regtest` justamente para permitir a criação controlada de carteiras com falhas conhecidas. A conversa entra nesse ponto, no papel do `BitDevs Brasília`, na colaboração com o George e no plano de evoluir a arquitetura para algo mais robusto, possivelmente com `Floresta` embutido.

O trecho final é útil porque discute distribuição, não só técnica. Em vez de imaginar o projeto apenas como app isolado, aparece ali a possibilidade de transformar o núcleo de detecção em biblioteca reutilizável por outras carteiras. Isso me interessa bastante porque muda o lugar do projeto: de demo boa de hackathon para peça de infraestrutura prática de privacidade no ecossistema Bitcoin.
