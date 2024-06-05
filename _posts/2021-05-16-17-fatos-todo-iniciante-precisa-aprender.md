---
layout: post
title:  "17 fatos que todo iniciante no Bitcoin precisa aprender"
date:   2021-05-16
excerpt: "Jornada de aprendizado de uma criptomoeda"
tag:
- bitcoin
- lightning network
- bifi
- tokenization
- article
comments: false
feature: /assets/fatos.png
---

Todos sabemos que a jornada de nocoiner para Bitcoiner não é fácil. O Bitcoin é um um projeto relativamente recente, extremamente inovador e dinâmico, com novidades aparecendo a todo momento. Acabamos aprendendo por analogias e, apesar de úteis, elas podem confundir o entendimento do real funcionamento de algumas particularidades da moeda. Trago aqui algumas curiosidades que costumam surpreender novatos e até alguns mais avançados.

## 1 — O Bitcoin é onipresente
O Bitcoin não é como uma moeda física ou como um arquivo de computador que enviamos por email. Ele é mais como uma ideia, onde a posse da informação não altera a informação em si. Quando uma transação é feita, nada se move, o que muda é o registro de posse na blockchain, que é replicado por todos os full nodes, ou seja, “a ideia atualiza”.

## 2 — Não existe evasão de divisas de Bitcoin
O Bitcoin é um mero consenso social que vive no campo das ideias, registrado em código, hospedado em todo o mundo, está em todos os lugares e em nenhum lugar. A consequência lógica é que não existem fronteiras para o Bitcoin e muito menos há possibilidade de haver evasão de divisas.

## 3 — O Bitcoin desde o início tem smart contracts
Em seu código, há a linguagem Script, que possibilita criar contratos inteligentes arbitrariamente complexos, limitando-se apenas ao tamanho do bloco. Ou pelo menos esse era o limite antes do Taproot. Inclusive, também não foi a invenção dos contratos inteligentes. O termo foi cunhado em 1994 por Nick Szabo.

## 4 — A linguagem script do Bitcoin não é como outras linguagens de programação
Mas poderia ter sido. Ela foi intencionalmente criada para não ser possível escrever qualquer programa de computador.

Depois de discutirem exaustivamente se valia a pena atualizar o código para transformar a linguagem em Turing Complete (ou computacionalmente universal), os desenvolvedores chegaram na conclusão de que, apesar de abrir possibilidades de inovação, poderia abrir também muitas possibilidades de ataques. O consenso foi de que não valeria a pena. Este foi um dos motivos da criação do Ethereum, uma rede blockchain com uma linguagem Turing Complete.

## 5 — Toda transação de Bitcoin é um smart contract, por definição
Dizer que o Bitcoin tem contratos inteligentes desde o início não é preciso o suficiente. Na realidade, a Blockchain é feita inteiramente de contratos inteligentes. A transação mais básica já é um contrato, algo como “quem conseguir assinar uma transação com a chave privada referente a esta chave pública pode gastar esse valor de BTC”.

Um exemplo de transação mais complexa pode ser: “Os bitcoins podem ser gastos se pelo menos 3 das 4 chaves A, B, C e D assinarem em conjunto até o final do ano, senão o possuidor da chave E pode gastar apresentando a senha X além da sua chave privada”.

Contratos inteligentes mais criativos podem ser criados, como um que era basicamente “quem tiver duas pré-imagens diferentes referentes a este mesmo hash sha1 pode gastar esses BTC”, que, em termos leigos, é “quem conseguir atacar esse algoritmo criptográfico ganha BTC”.

## 6 — Nunca haverá 21 milhões de bitcoins
21 milhões é um número aproximado assintótico. Se somarmos todos os subsídios teóricos de bloco desde o gênesis até a última emissão programada, o resultado é 20.999.999,9769 BTC. Outra curiosidade: o subsídio do bloco gênesis não pode ser gasto.

## 7 — Alguns BTCs nunca existirão
Por erro (ou talvez intencionalmente), alguns blocos têm o subsídio menor do que teriam direito, ou até zerado. Como é válido no protocolo, para sempre teremos um pouco menos de bitcoins do que foi desenhado para ter.

## 8 — Ninguém cria endereços de bitcoin
Você pode apenas escolhê-los. Todas as chaves privadas, chaves públicas e endereços já existem, são simplesmente números. A questão é que existem tantos que é matematicamente impossível de escolher um repetido, tendo entropia suficiente.

Basicamente, existem por volta de 1077 chaves privadas possíveis e estima-se existir 1080 átomos no universo observável, então escolher a mesma carteira que outra pessoa é como escolher o mesmo átomo do universo que outra pessoa.

## 9 — Sua carteira não guarda BTC
A carteira tem esse nome para ser mais familiar, mas tem a função real de chaveiro, pois ela guarda suas chaves. Lembre: BITCOIN É ONIPRESENTE, ele não se move pois está em todos os lugares, replicado na blockchain.

LEIA TAMBÉM
Máquinas alinhadas em um centro de mineração
Gigante de mineração de Bitcoin em formação? Riot revela plano de aquisição da Bitfarms
bitcoin brilhando na mão
Semler Scientific investe US$ 40 milhões em Bitcoin e ações disparam 25%
Anic de Almeida Peixoto Herdy é casada com herdeiro da Unigranrio
Herdeira é sequestrada em Petrópolis e criminosos exigem resgate em Bitcoin
Vitalik-Buterin-Ethereum
Vitalik explica o motivo dos “Grandes Blocos” terem perdido guerra de escalabilidade do Bitcoin
Geralmente carteiras também assinam transações, acessam o preço em exchanges, estimam as taxas de transação ótimas de acordo com últimas transações na blockchain, entre outras funções.

## 10 — Mineradores de bitcoin não fazem cálculos complexos
Na verdade é bem simples, pois o problema que eles estão tentando resolver não tem solução analítica. Então eles tentam adivinhar um número que resolva o problema, na força bruta, da maneira mais simples e “burra” possível.



## 11 — NFTs existem há pelo menos oito anos, no Bitcoin
Em 04/12/2012, foi apresentado um white paper explicando as Colored Coins, uma maneira de ter NFTs na blockchain do Bitcoin, “colorindo” Satoshis para não serem mais fungíveis.

A ideia era acoplar uma mensagem neles para serem identificados como outra coisa, um direito, um bem, uma arte digital, etc. Em 2014, foi criado o que é considerado o primeiro NFT da história, na blockchain da Namecoin. Em 2017, a febre na rede Ethereum era o CryptoKitties, gatinhos colecionáveis, todos NFT.

Kevin McCoy, Quantum (2014), o primeiro NFT já minerado.

## 12 — A mensagem do bloco Gênesis do Bitcoin não é meramente ideológica
A mensagem “The Times 03/Jan/2009 Chancellor on brink of second bailout for banks” é um jornal lido mundialmente, sua data e sua manchete de capa, cuja veracidade é ampla e facilmente verificável, e impossível de adivinhar de antemão.

É a oportunidade perfeita para o lançamento do Bitcoin, pois fica para sempre registrado o propósito da rede, mas também garante que não houve pré-mineração, i.e. foi um lançamento justo. Não fosse essa mensagem, Satoshi poderia ter minerado o bloco Gênesis muito antes, mas essa mensagem prova que não foi anterior a esta data.

Curiosidade extra: alguns dizem que Satoshi quis aproveitar a oportunidade e lançou o bloco gênesis sem o sistema estar 100% perfeito, o que explica a demora de 6 dias para começar a mineração dos próximos blocos.

## 13 — O bitcoin não é o ouro 2.0
Apesar de muito propagado, o ativo monetário mais próximo do Bitcoin não é o ouro. Os habitantes da ilha Yap, da Micronésia, usavam pedras Rai gigantes como dinheiro até o século XIX. Elas não se movem, o nativo simplesmente anunciava publicamente a transferência de sua posse para a aldeia e se tornava consenso.



Para conseguir novas pedras, os habitantes deveriam ir fora da ilha e trazer através de muito trabalho. Quando europeus chegaram com métodos de facilitar a extração e locomoção de pedras Rai, seu valor se esvaiu pela inflação e nunca mais foi usada como dinheiro.

## 14 — A taxa de transação deixa o bitcoin mais seguro
Um dos motivos é evitar um ataque DoS (Denial of Service), onde o atacante sobrecarrega a rede com requisições, impossibilitando outros de usar. Este ataque foi tentado em 2017, resultando em 15 dias de taxas muito altas. Entretanto, a rede se manteve funcional e foi estimado que o ataque custou na faixa de dezenas de milhões de dólares.

## 15 — O gasto de energia do Bitcoin é bom
Gastar mais energia que na Nova Zelândia quer dizer que mesmo se a Nova Zelândia inteira parasse de literalmente todo o país e só se concentrasse em minerar Bitcoin para atacar a rede, e caísse do céu mineradoras suficientes para realizar o ataque, ainda assim não conseguiria ser bem sucedido, pois teriam menos de 50% do hashpower.

## 16 — Mineradoras que usam gás natural beneficiam o meio ambiente
Durante a extração de petróleo, existem subprodutos que são desperdiçados, como o gás natural se não houver gaseodutos. Mineradoras de bitcoin usam essa fonte de energia e transformam gás metano em CO2, que contribui 25x menos com o efeito estufa, além de evitar desperdício de energia.

## 17 — Satoshi não era um grande programador
Não há dúvidas que Satoshi Nakamoto era um gênio, grande criptógrafo, inventor fenomenal, mas desenvolvedores experientes que trabalharam no código descrevem suas dificuldades de usar seu código. Isso inclusive levou alguns a pensarem que ele poderia ser um acadêmico, ao invés de um programador.

---

Originalmente publicado no [Portal do Bitcoin](https://portaldobitcoin.uol.com.br/17-fatos-que-todo-iniciante-no-bitcoin-precisa-aprender/) em 16 de maio 2021.

