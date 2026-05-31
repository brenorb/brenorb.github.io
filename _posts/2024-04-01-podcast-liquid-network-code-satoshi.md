---
layout: post
title:  "Podcast - Liquid Network - LLMs for Bitcoin Development with Spirit of Satoshi"
date:   2024-04-01 12:00:00 -0300
description: "Conversa no canal Liquid Network sobre as ferramentas da Spirit of Satoshi para desenvolvimento em Bitcoin: um assistente técnico para Liquid e o Code Satoshi, focado em Miniscript."
category: podcast
tags: [bitcoin, ai, spirit of satoshi, miniscript, liquid]
comments: false
share: true
content_type: media
excerpt: "Conversa no canal Liquid Network sobre LLMs para desenvolvimento em Bitcoin e uma demonstração do Code Satoshi."
feature: /assets/generated/podcast-liquid-network-code-satoshi.png
---

<iframe width="100%" height="500" src="https://www.youtube.com/embed/8s-GyRcZ6s0" title="Podcast - Liquid Network - LLMs for Bitcoin Development with Spirit of Satoshi" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Esta apresentação no canal `Liquid Network` mostra uma fase específica do trabalho no `Spirit of Satoshi`: sair do modelo educacional geral sobre Bitcoin e criar ferramentas mais técnicas para gente que precisa programar, ler documentação e depurar código no ecossistema Liquid. A abertura é feita pelo Jeff, explicando por que as equipes com quem eles conversavam sentiam falta de um assistente menos genérico do que Copilot ou um chatbot mainstream.

{% include generated/podcast-liquid-network-code-satoshi-chapters.html %}

O episódio gira em torno de três peças diferentes:

- o `Satoshi`, modelo mais amplo para educação e perguntas gerais sobre Bitcoin;
- o assistente técnico de `Liquid`, que responde em cima de documentação e mostra links para as fontes;
- o `Code Satoshi`, especializado em `Miniscript`, capaz de escrever, corrigir e explicar políticas e scripts.

Na parte que eu apresento, o ponto mais importante não é "olha que demo legal", mas a tentativa de reduzir o atrito real de desenvolvimento. O `Code Satoshi` recebe pedidos em linguagem natural, propõe políticas de `Miniscript`, mostra a estrutura equivalente e até renderiza fluxogramas para deixar explícitos os ramos de gasto. Para um ecossistema em que muita gente ainda entra por documentação dispersa, isso encurta bastante o caminho entre curiosidade e código utilizável.

Outra parte boa da conversa é a discussão sobre alinhamento e treinamento. O Jeff descreve o uso do `proof of knowledge`, um fluxo em que bitcoiners ajudam a curar e anotar dados recebendo micropagamentos em Lightning. Depois a conversa entra em `fine-tuning`, `continued pre-training`, repositórios próprios como a `Nakamoto Repository` e o problema nada trivial de tentar reduzir o viés fiduciário de modelos de base treinados na internet inteira.

No final eu entro num ponto que continua atual: modelos não "esquecem" de forma limpa só porque você quer, e mexer neles quase sempre é mais experimental do que o marketing de IA faz parecer. Essa parte deixa a página mais útil do que um simples embed porque documenta não só o produto mostrado, mas o tipo de raciocínio técnico e epistemológico por trás dele.

