---
layout: post
title: "Palestra - PyData - Future proof your AI product"
date: 2026-01-09 12:00:00 -0300
description: "Talk no canal PyData sobre como reduzir fragilidade em produtos de IA usando DSPy, com foco em assinaturas tipadas, módulos, adapters, avaliação e otimização de programas em vez de walls of prompt text."
excerpt: "Apresentação no canal PyData sobre como construir produtos de IA mais robustos e preparados para mudanças rápidas no ecossistema."
content_type: media
tag:
- ai
- dspy
- presentation
comments: false
feature: /assets/generated/palestra-pydata-future-proof-your-ai-product.jpg
---

<iframe width="100%" height="500" src="https://www.youtube.com/embed/01yeO-1RUcg" title="Palestra - PyData - Future proof your AI product" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Nesta apresentação para a `PyData`, a tese central é simples: produtos de IA ficam frágeis quando são construídos como uma pilha de prompts difíceis de inspecionar, versionar e migrar entre modelos. A palestra propõe uma alternativa mais próxima de engenharia de software tradicional, usando `DSPy` para declarar tarefas, estruturar entradas e saídas e otimizar programas inteiros em vez de depender de uma parede de texto improvisada.

{% include generated/palestra-pydata-future-proof-your-ai-product-chapters.html %}

O corpo da talk passa por quatro abstrações principais do `DSPy`: `signatures`, `modules`, `adapters` e `optimizers`. A parte mais útil é que isso não fica no nível de slogan. A apresentação mostra exemplos concretos de classificação simples, extração estruturada de e-mails, uso de tipos como listas e `Literal`, troca de estratégias de inferência como `Predict`, `ChainOfThought`, `ReAct` e `BestOfN`, e inspeção explícita do que realmente entra e sai do modelo.

O fechamento também é bom porque vai além de “prompt engineering com nome novo”. A palestra argumenta que avaliação, datasets de exemplo, métricas e otimização devem fazer parte do ciclo normal de manutenção do produto. Em vez de reescrever prompt a cada modelo novo, a ideia é manter o sistema adaptável: trocar adapter, ajustar módulo, reavaliar, otimizar e seguir em frente sem perder legibilidade nem controle.

