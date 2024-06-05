---
sitemap: false
layout: post
title:  "Os blocos de Bitcoin não param de aumentar; o que está acontecendo com a blockchain?"
date:   2023-02-08
excerpt: "NFTs estão entupindo os blocos de Bitcoin; especialistas explicam como isso pode fazer as taxas dispararem"
interview: true
tag:
- bitcoin 
- blockchain
- nft
- commentary
comments: false
feature: /assets/bitcoin-blocks.png
---

O tamanho médio dos blocos incluídos diariamente na blockchain do Bitcoin está atualmente por volta de 2 MB, o nível mais alto da história da criptomoeda, de acordo com dados do OKLink.

Domingo (05) foi a primeira vez que a média do tamanho dos blocos ultrapassou o nível de 2 MB, número que representa o dobro da média habitual do tamanho dos blocos do Bitcoin, que geralmente ficam por volta de 1 MB.

Essa nova tendência de blocos cheios continua nesta terça-feira (07), com analistas on-chain tentando entender o que está acontecendo na rede da criptomoeda com maior valor de mercado.

O engenheiro da Chaincode Labs, conhecido pelo pseudônimo Murch, mostrou no Twitter que o mempool do Bitcoin está atualmente com uma profundidade de 51 blocos.

O mempool é uma espécie de “tanque” onde as transações de BTC dos usuários ficam à espera de serem pegas por um minerador e adicionadas a um bloco. Acontece que a demanda da rede está tão grande que está gerando filas na mempool e fazendo com que blocos sejam adicionados cada vez mais próximos da sua capacidade máxima.

>The mempool has a depth of 51 blocks. It takes 11 ṩ/vB to get into the next block, but the top feerate bands are thin: 78.6% of the requested blockspace fall into the 1–2 ṩ/vB band. The mempool last cleared 47h ago.#mempoolreport (#memepoolreport?) pic.twitter.com/qsLhCCHNp5
>
>— Murch (@murchandamus) February 7, 2023

Uma vez que a blockchain do Bitcoin é programada para que um novo bloco seja adicionado a cada dez minutos, a fila de transações aguardando validação só cresce. Conforme apontou Murch, já faz mais de 47 horas que o mempool do Bitcoin enfrenta fila de blocos.

## O que está enchendo os blocos de Bitcoin?

Este aumento de demanda por espaço em blocos de Bitcoin não representa um crescimento orgânico de atividade de usuários na rede. Na realidade, um único projeto é quem ocupa boa parte dos blocos: Ordinals.

Ordinals permite que tokens não fungíveis (NFTs) sejam armazenados na blockchain do Bitcoin ao inscrever metadados em unidades de satoshis que lhes dão identidades individuais e permite que eles sejam rastreados e transferidos.

Conforme explica o cientista de dados do MB (Mercado Bitcoin) Breno Brito, o Ordinals se assemelha ao antigo experimento das Colored Coins, porém avança na sua aplicação graças às atualizações que foram implementadas no Bitcoin ao longo dos anos, como o Segregated Witness (Segwit) em 2017 e o Taproot em 2021.

Ele faz uma analogia para explicar como o Ordinals funciona: “Pensa que você tem um formulário para preencher, com nome, idade, endereço. Se for digital, geralmente há uma limitação nas informações que você pode informar. Idade, por exemplo, você só pode digitar número de 1 a 100. Mas agora imagina que esse formulário é um papel onde você pode escrever qualquer coisa nele, é isso que o Ordinals está fazendo. Ele consegue colocar praticamente qualquer coisa dentro de um bloco de Bitcoin, incluindo NFT.”

Conforme explica Brito, não há um limite determinado de quanto espaço um único protocolo pode usar da blockchain do Bitcoin para além da capacidade máxima de 4 MB do bloco em si.

Isso foi visto na prática semana passada, quando foi minerado o maior bloco de Bitcoin de todos os tempos. Esse bloco de 3,96 MB foi adicionado na rede pelos mineradores do pool Luxor e nele continha o NFT do desenho de um mago careca e barbudo, usando óculos escuros, e que fazia a seguinte propaganda: “Jpegs mágicos da internet; Junte-se a nós”.

>Behold, the Taproot Wizard, untethered and freed from his bondage!
>
>In his ubiquity, he’s present in the hearts, minds, and hard drive space of Bitcoin node operators the world over.
>
>He refuses to be censored, he refuses to be silenced.https://t.co/WCjQpTRMLg pic.twitter.com/gkxeAS4rOm
>
>— Luxor Mining (@LuxorTechTeam) February 1, 2023

A campanha de fato fez com que muitos se juntassem ao movimento. O pesquisador Pierre Rochard compartilhou na segunda-feira (06) um gráfico que mostra que 50% do espaço dos blocos de Bitcoin está sendo preenchido por scripts P2TR — usados para inscrever os NFTs na rede.

Esse tipo de script, que significa Pay-to-Taproot, foi introduzido no último soft fork do Bitcoin e permite que qualquer contrato com operações complexas seja altamente dimensionado dentro da rede, enquanto continua custando e tendo a mesma aparência na blockchain de uma transação comum.

>BREAKING: ordinal inscriptions are consuming 50% of #bitcoin block space pic.twitter.com/8n7sXpLcNB
>
>— Pierre Rochard (@BitcoinPierre) February 6, 2023

## NFTs no Bitcoin são uma boa ideia?

Graças ao Taproot, criar um NFT no Bitcoin não é uma operação cara. Contudo, isso não significa que os NFTs não farão as taxas da rede subirem, principalmente se continuarem ocupando um espaço cada vez maior dentro dos blocos.

“O conteúdo do NFT disputa o espaço limitado com as outras transações, então sim, as taxas tendem a aumentar com a disputa”, explica o desenvolvedor Narcélio Filho. Para ele, esse aumento da taxa não é negativo. Pelo contrário: ajuda atrair mais mineradores para a rede o que, consequentemente, aumenta a segurança de todo ecossistema.

“Uma rede saudável é uma rede que está sendo muito utilizada. Quanto mais cheios os blocos, melhor pra todo mundo, pois aumenta o orçamento de segurança do Bitcoin.”

Ele argumenta também que esse experimento de incluir NFT no Bitcoin pode não ser duradouro à medida que as taxas comecem a subir: “Acredito que estejam colocando essas bobagens na blockchain justamente porque as taxas estão baixas. Se aumentarem, haverá menos incentivo para desperdícios desse tipo.”

Ele relembra que incluir dados na blockchain do Bitcoin que não sejam apenas as informações essenciais de uma transação, não é novidade.

“Desde sempre usuários usam algumas partes das transações para codificar conteúdo arbitrário, como o Satoshi fez no bloco gênesis com a manchete do The Times. Já fizeram com outros tipos de mídia, como imagens e vídeos. Existem milhares de arquivos codificados, picados em pequenas partes espalhadas, na blockchain.”

Ele explica que isso não é negativo já que esses conteúdos “extras” podem ser removidos da base de dados caso necessário, já que ficam segregados em anexos witness. Já o lado positivo é uma nova receita para mineradores.

Sobre essa questão, Breno Brito também argumenta que a tendência é que as taxas da rede do Bitcoin aumentem no futuro, com NFT ou não.

“Todo mundo sabe que a taxa de transação do bitcoin vai precisar aumentar em algum momento. A recompensa dos blocos vai continuar caindo ao longo dos anos por causa do halving, então vai chegar um momento que os mineradores vão exigir o aumento das taxas de transação para continuar a operação lucrativa”, explica.

---

Publicado no [Portal do Bitcoin](https://portaldobitcoin.uol.com.br/os-blocos-de-bitcoin-nao-param-de-aumentar-o-que-esta-acontecendo-com-a-blockchain/) em 8 fevereiro de 2023.
