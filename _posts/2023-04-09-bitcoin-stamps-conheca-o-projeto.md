---
sitemap: false
layout: post
title: "Bitcoin Stamps: Conheça o projeto que está invadindo a rede da maior criptomoeda do mundo"
date: 2023-04-09
excerpt: "O que são os Bitcoin Stamps e como eles podem revolucionar a indústria NFT dentro da blockchain do BTC"
interview: true
tag:
- bitcoin
- nft
- commentary
comments: false
feature: /assets/stamps-project.png
---

A saga de novas experiências na blockchain do Bitcoin (BTC) parece não ter fim. Após as discussões envolvendo o polêmico projeto Ordinals e a criação do padrão “BRC-20”, mais uma novidade está chegando à rede da maior criptomoeda do mundo: os Bitcoin Stamps.

No dia 31 de março, os primeiros 600 Bitcoin Stamps foram “carimbados” na blockchain do BTC. O novo protocolo, criado por @mikeinspace, chamou a atenção por ser durável, se tratando de Tokens Não Fungíveis (NFTs) impossíveis de serem apagados pelos donos de full nodes — diferente dos Ordinals.

## Entenda o que é um Stamp no Bitcoin

Bitcoin Stamps, ou Carimbos no Bitcoin em português, é o nome do novo protocolo que permite qualquer usuário do BTC registrar imagens definitivas na blockchain – como se fossem imagens “tatuadas” para sempre no banco de dados descentralizado.

Eles usam uma tecnologia diferente dos Ordinals, que registram os dados das imagens em um campo separado das transações normais de BTC — chamado OP_RETURN, possibilitado pelo Taproot — e que podem ser facilmente filtrados por *full nodes* mediante uma técnica conhecida como podagem (ou *prunning*).

Já os Stamps registram os dados em transações normais, conhecidas como UTXO. E transações normais não podem ser apagadas pelos nodes principais que mantêm a rede funcionando — do contrário, a segurança do Bitcoin estaria colocada à prova.

>“São possivelmente os NFTs mais sólidos do mundo.” 
>segundo @adamamcbride

## Como o Bitcoin Stamp funciona

O que o protocolo Bitcoin Stamp faz é transformar uma imagem em texto (Base64) e depois dividir esse texto em várias partes, armazenadas junto de uma transação normal do BTC — que depois podem ser consolidadas para formar a imagem novamente.

Tudo é feito de forma automática por plataformas e carteiras habilitadas, como o site StampChain.io, dos criadores do protocolo. Segundo reportagem do Decrypt:

>“O desenvolvedor observou que já está em negociações com a Emblem e a Hiro Wallet para organizar integrações de protocolo, a primeira das quais permitirá aos usuários comprar e vender Stamps no OpenSea.”

Essa divisão em vários outputs é possível graças ao uso da tecnologia Counterparty, criada em 2014.

Após converter a imagem para texto, usando Base64, estes dados são incluídos manualmente com o prefixo ‘STAMP:’, o que faz a rede e aplicativos relacionados o identificarem como uma imagem NFT.

## Quanto custa criar um Bitcoin Stamp

Os Stamps também são mais caros do que os Ordinals. Isso acontece principalmente por que eles usam um método de transação chamado P2SH, ou Pague Para Escrever a Hash (Pay To Script Hash, em inglês). Eles são inscritos em carteiras multi-sigs que, normalmente, também possuem taxas de rede maiores.

O preço final depende do tamanho da imagem: quanto mais complexa, maior é o tamanho do texto em Base64 que precisa ser dividido em mais transações, cada uma requerendo um pagamento proporcional em BTC.

Os criadores recomendam o uso de imagens de baixa resolução, em 24×24 pixels, com 8-bit de profundidade de cores. É algo que lembra muito a aplicação de um carimbo — daí o nome do projeto.

Os NFTs da coleção CryptoPunks, por exemplo, cumprem com os requisitos recomendados e sua inserção na blockchain pode custar algo entre $8 e $20 dólares, segundo estimativas de especialistas.

Imagens médias podem custar cerca de US$ 50; não existe um teto para quão custoso pode ser carimbar o Bitcoin. Na ilustração abaixo, um Stamp foi confirmado com US$ 80,64 de taxa.

## Bitcoin Stamps são bons ou ruins para o BTC?

O Portal do Bitcoin conversou com o cientista de dados e entusiasta do Bitcoin Breno Brito (@brenorb) sobre os Stamps.

**Portal do Bitcoin**: Como você vê essa nova aplicação?

**Breno Brito**: Eu particularmente não sou muito entusiasta de NFTs como Cryptopunks, mas uma característica basilar do Bitcoin é ser não-permissionado. Ou seja, você tem liberdade de colocar o que quiser se pagar as taxas para isso.

Esse novo projeto pode trazer mais competitividade para o Bitcoin em relação às outras blockchains que têm contratos inteligentes Turing completos, como Ethereum e Solana, para os entusiastas de NFTs.

Recentemente, graças ao Ordinals, várias pessoas entraram em contato com a Lightning Network, mostrando a possibilidade de transações de Bitcoin mais rápidas que da Solana. Isso é muito positivo para o bitcoin, que é um projeto sem uma instituição por trás com orçamento de marketing.

**Portal do Bitcoin**: Isso oferece riscos para o Bitcoin?

**Breno Brito**: Pelo que li do projeto, não há riscos para o Bitcoin. Se ele se tornar muito popular, pode acabar aumentando as taxas, que aumentam a segurança da rede.

**Portal do Bitcoin**: Quais as consequências disso?

**Breno Brito**: Ganhando tração, esse projeto pode aumentar as taxas, que é bom para mineradores, mas nem tanto para quem usa transações on-chain. Também pode acabar mantendo os blocos cheios, que atrasam outras transações e aumentam o tamanho da blockchain.

Entretanto, os blocos têm tamanho limitado e todo operador de nó completo já sabe qual o limite máximo de crescimento da blockchain, isso não muda e nem é surpresa.

No lado mais positivo, vejo como um convite para quem começou a vida cripto no Ethereum por achar que não tinha o que fazer no Bitcoin, uma possibilidade de abrir os olhos para o quanto do bitcoin ainda pode ser explorado de formas simples que não foram pensadas antes.

Em algum momento, esse tipo de projeto pode acabar trazendo toda essa adoção do Web3 para os projetos que já existem no Bitcoin como o RGB, Taro, RSK, Stacks, entre outros, e desenvolvendo a BiFi (Bitcoin Finance).

---

Publicado no [Portal do Bitcoin](https://portaldobitcoin.uol.com.br/bitcoin-stamps-conheca-o-projeto-que-esta-invadindo-a-rede-da-maior-criptomoeda-do-mundo/) em 9 abril de 2023.
