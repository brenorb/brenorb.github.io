---
layout: post
title: "Palestra - Plone - Alinhamento de LLMs: O Que É e Principais Técnicas"
date: 2024-12-10 12:00:00 -0300
description: "Apresentação no Plone sobre o que significa alinhar LLMs, os principais riscos de segurança e viés e as técnicas mais usadas hoje, de prompt engineering e fine-tuning a RLHF, guardrails e sparse autoencoders."
excerpt: "Apresentação no canal Plone sobre alinhamento de LLMs, técnicas principais e riscos no comportamento dos modelos."
content_type: media
tag:
- ai
- alignment
- presentation
comments: false
feature: /assets/generated/palestra-plone-alinhamento-de-llms.jpg
---

<iframe width="100%" height="500" src="https://www.youtube.com/embed/-pgSr8PIf38" title="Palestra - Plone - Alinhamento de LLMs: O Que É e Principais Técnicas" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Esta apresentação foi pensada como um sobrevoo rápido, não como um curso completo. O objetivo é dar vocabulário e mapa mental suficientes para alguém que já está construindo sistemas com LLMs perceber que "fazer o modelo funcionar" e "fazer o modelo responder de forma útil, segura e previsível" são problemas diferentes. Esse segundo problema é justamente o alinhamento.

{% include generated/palestra-plone-alinhamento-de-llms-chapters.html %}

Na fala eu começo definindo alinhamento da maneira mais pragmática possível: dado que existem muitas respostas aceitáveis para a mesma pergunta, como forçar o modelo a responder do jeito que interessa ao sistema, ao produto ou ao usuário? A partir daí, a palestra percorre os principais riscos que aparecem em produção, como vazamento de informação, respostas perigosas, inconsistência, viés e comportamentos absurdos que destroem a confiança no sistema.

O valor prático do vídeo está em organizar as técnicas por famílias. Eu passo por `prompt engineering`, `prompt learning`, `parameter-efficient fine-tuning`, `instruction tuning`, `continued pre-training`, `representation engineering`, `sparse autoencoders`, `guardrails`, `human in the loop` e `RLHF`. A ideia não é provar que uma delas resolve tudo, mas mostrar quando cada abordagem atua fora do modelo, quando mexe nos pesos, quando cria uma camada de policiamento e quando tenta intervir direto na representação interna do conceito.

Também tem uma parte boa de exemplos concretos de falha, incluindo respostas perigosas ou absurdas e casos de viés em geração de imagem. Isso ajuda a manter a conversa no terreno correto: alinhamento não é só um detalhe acadêmico ou um "acabamento" de UX, mas uma parte do trabalho de segurança, produto e responsabilidade de quem põe modelos no mundo.

