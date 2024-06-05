---
layout: post
title:  'As Corretoras Brasileiras de Criptomoedas Falsificam Volume de Bitcoin?'
date:   2018-04-19
excerpt: "Uma análise quantitativa de métricas de liquidez das exchanges"
tag:
- bitcoin
- data science
- exchange
- article
comments: false
feature: "/assets/fake-volume.png"
---

Atualização: A "Rei dos Bitcoins", dono da Negocie Coins, [foi preso](https://x.com/brenorb/status/1412151389434830848) em julho de 2021 e fui contratado pela exchange Mercado Bitcoin em Agosto de 2021.

---

O assunto do ano em relação a criptomoedas é sua regulação. De um lado, temos os céticos em relação à eficácia do governo com medo da criação de reservas de mercado, como já ocorre no setor financeiro; e do outro existem as pessoas preocupadas com golpes, fraudes, financiamento de terrorismo, lavagem de dinheiro, _front running_, _insider trading_, entre outras coisas. Hoje podemos dizer com segurança que a discussão não é mais se as criptomoedas vão ser reguladas, mas como serão reguladas.



Uma carta que certamente será usada para forçar uma regulação mais forte é a proteção contra a “fabricação” de volume falso em exchanges que enganam os usuários. Para evitar essa fraude, o governo possivelmente terá de auditar os dados internos das exchanges, abrindo brechas para coletarem dados dos usuários sobre suas negociações, diminuindo ou até acabando com nossa privacidade, podendo até ter acesso às nossas chaves públicas e rastrear todas nossas compras dali para a frente. Sendo assim, considero importante para o desenvolvimento da comunidade e de toda a criptoeconomia exigirmos mais transparência das empresas ao nosso redor. E isso nos traz ao tema do artigo:

## Perseguindo volumes falsos: uma cripto-praga
Mês passado, Sylvain Ribes criou um estudo muito interessante em seu [Medium](https://medium.com/@sylvainartplayribes/chasing-fake-volume-a-crypto-plague-ea1a3c1e0b5e).

“Quando eu comecei a levantar os dados para este artigo, eu não tinha ideia que eu acabaria falando sobre volumes de negociação falsos.

Eu inicialmente queria reunir dados sobre a liquidez dos criptoativos, que poderia ser um complemento ao volume. Achei que seria um indicador interessante ao avaliar o valor de um ativo”, disse Ribes.

Basicamente ele mediu alguns dados públicos de exchanges internacionais e, com eles, percebeu alguns dados falsos. Com este artigo eu pretendo aplicar o mesmo método para tentar encontrar um padrão nas exchanges brasileiras, além de algumas outras análises complementares. Todos os códigos e dados utilizados estão abertos e disponíveis no link abaixo para quem quiser auditar por si próprio ou melhorar a análise:

[https://drive.google.com/file/d/1S8Q4-q0uyntjRGklez79Xf1BvusvoY-5/view?usp=sharing](https://drive.google.com/file/d/1S8Q4-q0uyntjRGklez79Xf1BvusvoY-5/view?usp=sharing)

Para medir a liquidez do ativo, Ribes tentou usar do _slippage_, que é o efeito de, ao executar uma ordem a mercado, tê-la executada num preço pior do que o previsto. Por exemplo, ao tentar vender a mercado 10 BTC numa exchange brasileira, provavelmente o preço médio de venda vai ser bem abaixo do preço de mercado do momento por faltar liquidez no livro de ordens.


![Ordens de compra](/assets/fig1-ex.png)

<center>Figura 1 – Ao se vender 10 BTC, o preço médio de venda será abaixo de R$ 28.510,08 por não existir liquidez para um volume desta magnitude. Reprodução do bitvalor.com</center>

O tamanho do _slippage_ geralmente é calculado como o percentual da diferença do preço médio de execução em relação ao preço a mercado antes da ordem ter sido executada, que é basicamente o percentual que você sai perdendo com essa ordem. Por exemplo, ao se vender 3 BTC no exemplo da figura 1, o _slippage_ é zero, mas será maior que zero para ordens maiores que 4,7468 BTC, ou seja, você acaba tendo que vender mais barato do que queria.

Entretanto, para simplificar o cálculo, Ribes usa _slippage_ como o percentual da diferença do pior preço de venda em relação ao preço da média de melhor compra e venda (_mid-spread_). Para termos uma base de comparação com os resultados obtidos por Ribes, utilizarei da mesma metodologia, mas testando o método nas exchanges brasileiras.

A tese de Ribes é que quanto maior o volume diário, maior a liquidez; logo, menor o _slippage_. Bem intuitivo, não? Para fazer essa medição, ele calculou o _slippage_ médio em relação ao volume de pares de criptomoedas em exchange com mais de 100 mil dólares de volume diário para uma venda de 20 mil dólares.

## O caso brasileiro

E aí começa alguns dos nossos problemas. Já que a maioria das exchanges brasileiras trabalham praticamente só com o par BTCBRL, eu peguei várias amostras de _slippage_ e volume para o mesmo par em momentos diferentes para tentar enxergar o mesmo tipo de correlação que Ribes obteve em pares diferentes. Talvez devido aos poucos dias de dados, ou ao ambiente brasileiro, eu tive de ajustar a fórmula proposta de: 

\\[ volume = \frac{4,4}{Slippage} \\]

<center>para </center>

\\[ volume = \frac{44}{\sqrt{Slippage}} \\]



![Ordens de compra](/assets/fig2-ex.png)

<center>Figura 2 – Modelo de _slippage_ de Ribes em função do volume, baseado em dados de diversas exchanges confiáveis. As cruzes verdes são dados da OKex, claramente outliers. Volume = 4,4/Slippage</center>

O resultado pode ser visto na figura 3. A planilha disponível já tem uma macro que coleta os dados automaticamente ao apertar um botão.

Entretanto, já é possível notar por meio deste gráfico que os dados da Negocie Coins são claramente outliers (valor aberrante ou valor atípico), apresentando aproximadamente o dobro de volume para o mesmo _slippage_ do Mercado Bitcoin, ou 7 vezes o volume do modelo proposto.

Sendo um pouco familiarizado com estas exchanges, estranhei o volume excessivamente maior que das outras, por volta de 1 a 2 vezes o volume das outras somadas, conforme pode se ver na figura 4. Em outras palavras, 85% do volume da Negocie Coins parece ser fabricado, segundo o modelo.

Outra pergunta que me fiz foi: quanto de dinheiro eu preciso para zerar o livro de ordens de uma corretora? Será que isso é proporcional ao volume diário? A resposta é: SIM, se você desconsiderar a Negocie Coins.

Como é possível ver na figura 5, peguei o _slippage_ em função do volume de venda, percorrendo todo o livro de ordens. Em geral, a curva é contínua pelo que se pode observar, mas existem gaps ao redor de 60% de _slippage_ do Mercado Bitcoin e ao redor de 40% de _slippage_ para o Negocie Coins.


O gap da BitcoinTrade é devido ao limite do livro de ordens que é possível puxar pela API deles, me impedindo de ter acesso aos dados necessários para o estudo, o que é um problema de transparência.

![Ordens de compra](/assets/fig3-ex.png)

<center>Figura 3 – Modelo de _slippage_ de Ribes ajustado em função do volume comparado com dados de exchanges brasileiras. volume = 44/√Slippage</center>

![Ordens de compra](/assets/fig4-ex.png)

<center>Figura 4 – Volume 24h das corretoras brasileiras no dia 15/04/2018 20:33.</center>

![Ordens de compra](/assets/fig5-ex.png)

<center>Figura 5 – Slippage em função do volume de venda nas corretoras brasileiras no dia 15/04/2018 20:33.</center>

Como ficaria então um gráfico do volume de 24h versus o volume necessário para “limpar” o livro de ordens?


![Ordens de compra](/assets/fig6-ex.png)

<center>Figura 6 – Volume de venda necessário para limpar o livro de ordens das corretoras brasileiras no dia 15/04/2018 20:33 em relação ao seu volume diário. Y = 97385,39226 x – 594817,236</center>

Novamente, vemos uma discrepância justamente na Negocie Coins, com um volume diário discrepante, e no Mercado Bitcoin, com um volume do livro de ordens discrepante. Se medirmos a diferença do modelo e do dado real normalizada pela média dos tamanhos do livro de ordens, a Negocie Coins e a Mercado Bitcoin apresentam diferenças absurdas de 138% e 404%, respectivamente, enquanto as outras têm diferenças entre 2% e 17%.

## Conclusão
É importante ressaltar que todos esses padrões foram observados em todos os momentos que baixei novos dados, mas foi uma observação de poucos dias. Quem tiver interesse pode pegar a planilha disponível [aqui](https://drive.google.com/file/d/1S8Q4-q0uyntjRGklez79Xf1BvusvoY-5/view?usp=sharing) para continuar o estudo.

Infelizmente (ou felizmente), não foi possível detectar uma falsificação de volume tão óbvia como a vista na OKex pelo Ribes, mas vemos algumas discrepâncias alarmantes que valem a pena ser investigadas, especialmente em relação à Negocie Coins e Mercado Bitcoin.

De qualquer forma, independente dos dados, o ideal seria que toda empresa séria do ramo financeiro e/ou de criptomoedas se submetesse a auditorias independentes de maneira regular, promovendo uma maior transparência para seus clientes.

## _Contraponto_

Em resposta à reportagem do Portal do Bitcoin (As Corretoras Brasileiras Falsificam Volume de Bitcoin), o Mercado Bitcoin esclarece que todas as informações sobre negociações de critpomoedas na plataforma são baseadas em dados reais. As divergências apresentadas na reportagem estão associadas ao fato de que o modelo de análise foi desenvolvido com base em uma hipótese falha.



Isso porque, não considerou o fato de que cada exchange tem diferentes perfis de clientes – seja por distribuição geográfica e tamanho de usuários – e que nem todas as plataformas, como o caso específico do Mercado Bitcoin, utilizam robôs.

Vários clientes do Mercado Bitcoin tem robôs (softwares de trading autônomos) fazendo negociações, mas o Mercado Bitcoin não tem nenhum software de trading próprio operando na nossa plataforma. Isso porque, entendemos que operar um robô pode levar a um conflito de interesse entre a exchange e seus clientes.

O argumento utilizado na análise da reportagem do Portal Bitcoin é baseado na hipótese falsa de que há sempre uma mesma relação entre o volume negociado no mercado e o volume de ordens disponível no livro, o que representa um erro. É intuitivo que haja uma correlação entre o volume negociado e o volume disponível no livro, mas essa relação depende do perfil de clientes de cada exchange.

Várias exchanges têm grandes clientes que funcionam como “market-makers”. Esse clientes tem robôs especializados em fazer lucro com um grande número de transações pequenas. Para que suas ordens sejam executadas rapidamente, os robôs colocam suas ordens a preços atraentes.

Ou seja, preços que serão executados rapidamente. Uma vez executada, uma ordem desaparece do livro. Outras ordens do livro, a preços piores, não são afetadas pelas negociações dos robôs. Ou seja, com o aumento do número de robôs haverá proporcionalmente um maior número de ordens executadas, mas o volume de ordens disponível no livro a cada instante permanece o mesmo.

Se os clientes de uma exchange têm mais robôs, o mercado que essa exchange provê poderá ter um maior volume de negociações para um mesmo volume de ordem disponíveis no livro. Isto mostra a falha no argumento construído na análise divulgada pelo Portal do Bitcoin.

Em resumo, estipular arbitrariamente uma média do comportamento de vários mercados e utilizar isso para afirmar que as exchanges que não seguem essa média estão manipulando seu volume –  sem levar em conta a diferença entre os clientes de cada exchange – representa uma análise equivocada e que não reflete as práticas do Mercado Bitcoin, que é hoje a maior e melhor plataforma do Brasil para negociações de criptomoedas.

---

Originalmente publicado no [Portal do Bitcoin](https://portaldobitcoin.uol.com.br/as-corretoras-brasileiras-de-criptomoedas-falsificam-volume-de-bitcoin/) em 19 de abril 2018.