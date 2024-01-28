---
layout: post
title:  "A Revolução Taro"
date:   2023-03-21
excerpt: "A transformação do Bitcoin na exchange suprema."
tag:
- taproot assets
- lightning network
- bifi
- tokenização
comments: false
---

<figure>
	<a href="https://twitter.com/pymoment/status/1458098341313716241"><img src="https://pbs.twimg.com/media/FDw0sELWEAkST26?format=png&name=900x900"></a>
	<figcaption><a href="https://twitter.com/pymoment/status/1458098341313716241" title="Visualização das conexões entre os 16 mil canais de Lighting Network criada pelo @pymoment. Em breve, toda essa estrutura permitirá a qualquer pessoa comprar ou vender qualquer ativo com a mesma segurança do bitcoin e de forma não permissionada e não custodial.">Visualização das conexões entre os 16 mil canais de Lighting Network criada pelo @pymoment. Em breve, toda essa estrutura permitirá a qualquer pessoa comprar ou vender qualquer ativo com a mesma segurança do bitcoin e de forma não permissionada e não custodial.</a>.</figcaption>
</figure>

## A revolução da reserva de valor

No dia de Halloween de 2008, surgia pela primeira vez aberta ao público possivelmente a ideia mais revolucionária do século. Satoshi Nakamoto nos agraciou com uma ideia que solucionava um problema que há décadas vinha sendo trabalhado e pensado: como podemos separar o Estado e o dinheiro, assim como um dia separamos o Estado e a religião. 

Apesar da raiz da questão ser clara e aberta, ela dependia de vários avanços tecnológicos, em um quebra-cabeças extremamente complexo que Satoshi montou. Hoje, muitos discutem mais as peças individuais do quebra-cabeças do que a figura formada pelo quebra-cabeças em si. Tanto que qualquer texto sobre a invenção do bitcoin será sempre sobre a resolução do problema dos generais bizantinos, do gasto duplo, da confiança, da escassez digital, da descentralização de registros digitais, da inflação, da coordenação da teoria dos jogos, do ouro digital, mas raramente da intenção final. Cada um desses problemas menores resolvidos têm implicações interessantíssimas, mas, hoje, discutirei a revolução financeira que o bitcoin traz um pouco além do dinheiro em si.

Ainda nos primeiros 2 anos, quando o bitcoin ainda nem possuía valor, os poucos que viram que a ideia poderia funcionar começaram a pensar nas implicações de um dinheiro descentralizado e os outros possíveis usos de uma blockchain como plataforma além de mera viabilizadora disso. A leitura de O Livro de Satoshi nos traz os embriões das ideias de basicamente todas as altcoins existentes hoje. Entretanto, na época, ainda tínhamos um problema grave: a blockchain não escalava. Cada byte a mais registrado na blockchain permaneceria lá replicado em milhares de computadores espalhados no mundo gravados para sempre. Assim como o ouro, que necessitou de um papel-moeda como meio de pagamento, o ouro digital em seus primeiros anos precisava evoluir para não sofrer o mesmo fim que o ouro teve.

## A revolução do meio de pagamento

Em 2017, ficou ainda mais clara a importância de uma forma inteligente de escalar o bitcoin, pois os blocos estavam já lotados de transações e as taxas estavam ficando inviáveis. É nesse cenário que nasceu a versão de testes da Lightning Network (LN, ou “Rede Relâmpago”), uma forma muito interessante de escalar o bitcoin sem prejudicar a descentralização. 

Os detalhes específicos da LN trarei em um post futuro, mas, em resumo, ela cria canais de pagamento, transferindo a ideia do consenso global para um consenso entre remetente e destinatário de bitcoins. Esse protocolo de canais de pagamento usa as assinaturas digitais já asseguradas pela blockchain em um contrato inteligente. Isso significa que não é necessário ter um retrabalho na Prova de Trabalho (“Proof-of-Work”) nem uma replicação global do registro, o que faz com que a transação se torne instantânea, gratuita e com basicamente o mesmo nível de segurança impenetrável do bitcoin. Isso tornou qualquer outra solução de pagamentos, como Visa e Mastercard, ou até blockchains que competiam por transações por segundo, automaticamente obsoleta. 

Como não há soluções hoje capazes de competir com a LN (com exceção de, muito discutivelmente, outras soluções de segunda camada inspiradas em seu sucesso), sobrou a última fronteira da discussão: as Finanças Descentralizadas (DeFi). 

## A revolução na infraestrutura financeira

### O real caso de uso do DeFi
Finanças Descentralizadas também não é uma ideia nova, como é possível lermos no Livro de Satoshi. Entretanto, muito se discutiu sobre os limites da descentralização e da não necessidade de confiança (“trustlessness”). É fato que, se uma pessoa está emprestando dinheiro e temos outra pegando emprestado, esse contrato (ou título de dívida) é centralizado. Quem empresta precisa confiar que o tomador vai pagar (em um caso de empréstimo sem colateral). Da mesma forma, quem compra uma ação de uma empresa (ou o token de um projeto em construção em um ICO) precisa necessariamente confiar que a empresa (ou entidade) vai cumprir as metas e objetivos expostos na reunião de acionistas e no plano de negócios e confiar no auditor que supostamente revisou todos os balanços da empresa e que está garantindo que as informações expostas são verdadeiras. Pelo menos com a tecnologia que temos hoje, é impossível termos finanças completamente descentralizadas.

Entretanto, a compra e a venda de um ativo centralizado é dado por regras específicas que podem ser abstraídas em um contrato inteligente, não necessitando de bolsa, clearing house ou qualquer outro intermediário com o estado de tecnologia atual. Não é por acaso que DeFi, diferentemente da maioria das ideias de "descentralização de tudo", não perdeu força e se mantém relevante mesmo no inverno cripto, para a confusão de vários bitcoinheiros maximalistas mais puristas. A descentralização da infraestrutura financeira não é relevante pela descentralização em si – pelo menos inicialmente –, mas pela padronização e interoperabilidade dos sistemas. 

Temos hoje quase 200 países, cada um com suas próprias regras financeiras, algumas completamente impenetráveis e incompreensíveis. Os EUA, sozinhos, têm 13 bolsas só para ações, cada uma delas incompatível com as outras, tendo regras, ativos e clientes distintos. Não é incomum empresas grandes abrirem capital em mais de uma bolsa ou até abrirem capital em um país diferente do de origem pela facilidade, capacidade de capitalização, entre outros fatores. Tudo isso são gambiarras para contornar dificuldades intrínsecas ao sistema financeiro legado (ou tradicional, também chamado de “TradFi”) – e são problemas enormes para empresas multinacionais e completos impedimentos para pessoas físicas. 

Por outro lado, em uma tarde, é possível montar um token ERC-20 na rede Ethereum que será automaticamente possível de se custodiar em carteiras open-source, enviar para qualquer outro endereço Ethereum do mundo e listar em exchanges que já ofereçam suporte para outros tokens ERC-20 sem necessitar de nova integração. Ou seja, toda a infraestrutura já está pronta e, apesar de ainda depender de algumas regulações do país sobre emissão de valor mobiliário, é uma tecnologia não permissionada, tanto para o emissor quanto para o comprador. Os milhares de projetos lançados diariamente no Ethereum contam com uma possível demanda mundial em seu momento de lançamento (em vez dos poucos clientes de bolsas locais), uma infraestrutura trabalhando 24/7 e entusiastas adicionando valor com projetos que podem integrar empréstimos, derivativos, apostas e o que mais a criatividade deles pensar. Esse é o poder de um sistema aberto.

Entretanto, como dito acima, esse sistema não é escalável, além de diversos outros problemas que não cabem neste texto. Ele funciona hoje por ainda ser uma fatia minúscula de um nicho ainda pequeno das criptomoedas, além de escolhas de design do sistema que comprometem alguns de seus pilares mais importantes.

### BiFi - Bitcoin Finance
Muito se discute sobre as vantagens e desvantagens de cada criptomoeda em si, mas é basicamente consenso que o bitcoin é a criptomoeda mais segura, estável, popular, simples e descentralizada do mundo. Isso se dá pelo fato de seu fundador anônimo ter desaparecido, por ter sido a primeira criptomoeda e pelos princípios de design adotados por seus desenvolvedores sempre priorizarem a simplicidade, a descentralização e a segurança, comprometendo por diversas vezes possíveis "features" adicionais, velocidade de desenvolvimento e até velocidade de adoção. Isso é completamente o oposto da maioria dos outros projetos, geralmente com fundações que levantaram seu patrimônio por meio de pré-mineração, com time e orçamento de marketing e com a mentalidade "startupeira" do "mova-se rápido e quebre coisas". 

A mentalidade intencionalmente lenta existe para garantir uma discussão aprofundada sobre cada mudança, seu impacto para a segurança do projeto como um todo e a compatibilidade com versões anteriores e filtrar modas passageiras, assegurando a simplicidade e que nada se quebre. O dinheiro de reserva mundial, mais do que todo o resto, precisa dessa estabilidade. O sistema financeiro internacional se beneficiará enormemente sabendo que está construindo sobre uma base perene, sem sustos, atualizações de consenso obrigatórias e bombas de dificuldade.

Somente a partir dessa base perene é possível construir valor escalável, pois a base não precisará ser reconstruída a cada nova quebra de consenso. A partir da base de reserva de valor – a blockchain –, foi construída a base de meio de pagamentos – a LN – e, acima dela, em breve, veremos a base sólida da infraestrutura financeira – o Taro.

<figure>
	<a href="https://river.com/learn/what-is-taro-in-bitcoin/"><img src="https://river.com/learn/images/articles/taro-bitcoin-lightning.png"></a>
	<figcaption><a href="https://river.com/learn/what-is-taro-in-bitcoin/" title="Representação do funcionamento do envio de ativos por meio da Lightning Network com Taro. Veja que o ativo L-USD é imediatamente vendido por bitcoins, que são de fato enviados e, no final, são usados para comprar o L-USD novamente. Infográfico por River Financial, o quarto maior nó de LN do mundo.">Representação do funcionamento do envio de ativos por meio da Lightning Network com Taro. Veja que o ativo L-USD é imediatamente vendido por bitcoins, que são de fato enviados e, no final, são usados para comprar o L-USD novamente. Infográfico por River Financial, o quarto maior nó de LN do mundo.</a>.</figcaption>
</figure>

À primeira vista, o Taro é somente uma forma de "finalmente" se criar tokens fungíveis e NFTs no bitcoin. Ele tira proveito de uma artimanha engenhosa da última atualização do bitcoin – o Taproot – para registrar as informações de um ativo em um contrato inteligente sem realmente ocupar nenhum espaço da blockchain. A grande vantagem desse sistema em relação a todos os meios anteriores de se criar tokens no bitcoin é a possibilidade nativa de eles serem transacionados na LN, de forma instantânea, praticamente gratuita e com privacidade. 

No fundo, a LN continua transacionando somente bitcoins. O truque é que todo nó de Taro vai poder negociar os ativos que quiser contra o bitcoin; o bitcoin é então enviado na LN, e no final é convertido novamente no final do caminho. 

Isso significa que o Taro vai efetivamente transformar a LN na maior e mais descentralizada e segura exchange do mundo. Qualquer pessoa em qualquer lugar do mundo vai poder se tornar uma exchange incensurável, não custodial e não permissionada.

Como isso vai afetar a regulação, as exchanges existentes hoje e todo o ecossistema, só podemos especular e somente tão bem quanto uma pessoa de 1980 especulando sobre a internet de hoje. O fato é que a Revolução Taro está vindo e pode ser a maior destruição criativa que o ecossistema cripto já viu.
