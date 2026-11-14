---
layout: post
permalink: /projects/austrian-mistranslations-br/
title: "Austrian Mistranslations BR"
date: 2026-11-12
excerpt: "Auditoria das traduções de livros da Escola Austríaca em português do Brasil, comparadas frase por frase com os originais."
description: "Site para explorar problemas de tradução em livros austríacos publicados em português do Brasil. Cada achado tem tipo, gravidade e a fonte exata nos dois idiomas."
content_type: project
tags:
- austrian-economics
- translation
- nlp
- audit
comments: false
feature: /assets/generated/austrian-mistranslations-br.jpg
---

![Livro antigo aberto, com as duas páginas costuradas por um fio magenta solto e uma lupa que destaca uma passagem em âmbar, com os Alpes ao fundo](/assets/generated/austrian-mistranslations-br.jpg)

**Austrian Mistranslations BR** é uma auditoria das traduções de livros da Escola Austríaca em português do Brasil. O ponto de partida foi um [tweet de J. P. Mayall](https://x.com/jpmayall/status/1990067165093855457) sobre uma frase de Rothbard em que a tradução some com a palavra que sustentava o argumento.

Comparei as edições gratuitas do Mises Brasil com os originais do Mises Institute, frase por frase. Cada frase vira um vetor multilíngue (LaBSE), é alinhada à correspondente no original, e detectores procuram acréscimos sem origem, números e unidades diferentes, negações perdidas e sentidos divergentes. Todo achado publicado foi lido nos dois idiomas e conferido contra o texto inteiro do original.

O site permite filtrar por **tipo**, **gravidade** (de 1, trivial, a 5, grotesco) e livro, com um mapa tipo × gravidade. Cada card mostra os dois trechos lado a lado, com os pontos divergentes destacados, e traz a **fonte** da tradução (edição, tradutor, página do PDF) e do original (edição e capítulo).

Limites: só os livros com fonte gratuita puderam ser comparados, e o método não vê erros que mantêm o tamanho e os números da frase. A ausência de achados num livro não prova que ele é fiel. Conversões de unidade corretas (como fardos em toneladas) não contam como erro. Onde pode haver diferença entre edições, o card traz uma ressalva.

Esta entrada usa **2026-11-12**, a data do primeiro commit do repositório.

### Links
[Site](https://austrian-mistranslations.brenorb.com/){: .btn .btn-info}
[GitHub Repo](https://github.com/brenorb/austrian-mistranslations-br){: .btn .btn-info}
