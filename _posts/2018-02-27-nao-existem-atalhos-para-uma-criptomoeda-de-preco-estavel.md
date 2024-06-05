---
layout: post
title:  'Não Existem Atalhos para uma Criptomoeda de Preço Estável'
date:   2018-02-27
excerpt: "Como o bitcoin pode acabar virando de fato moeda"
tag:
- bitcoin
- stablecoin
- brazil
- gold
- article
comments: false
feature: "/assets/stable.png"
---

Filho do grande teórico anarcocapitalista David Friedman e neto do lendário nobel em economia Milton Friedman, Patri Friedman escreveu uma [thread de tweets](https://twitter.com/patrissimo/status/944384410853318656) citando Vitalik Buterin, criador do Ethereum, sobre a necessidade de se criar uma criptomoeda estável, que ele chama de StableCoin (literalmente Moeda-Estável).

Vendo a volatilidade do BTC e pensando em exemplos de usos atuais, eu finalmente aprecio o porquê de Vitalik Buterin diz ser importante criar uma StableCoin. As pessoas deveriam ter a possibilidade de guardar valor sem estar exposto a todo esse risco cambial.



A preocupação do Patri e Vitalik é justificada. Afinal, como usar o bitcoin (ou qualquer outra cripto) como reserva de valor se está sujeita a quedas maiores que 50% em prazos curtos como nestes últimos dois meses? Uma grande empresa ou investidor pode fazer um hedge com os contratos futuros que surgiram agora da CMOE e CBOE, mas dificilmente um cidadão médio brasileiro conseguiria fazer tal operação devido à complexidade operacional. Ele segue argumentando que se a única forma de usar o bitcoin for sendo um especulador, não será criado um novo sistema financeiro mundial, mas um clube de apostadores.

Várias estratégias engenhosas foram criadas a fim de encontrar uma criptomoeda com uma volatilidade controlada.

## Bitcoin “Melhorado”
A primeira, que motivou o [artigo de 2014 do Vitalik](https://blog.ethereum.org/2014/11/11/search-stable-cryptocurrency/), é o [artigo da proposta do IBC](https://pt.scribd.com/doc/245827939/SSRN-id2519367-Japan-Improved-Bitcoin-IBC), o “improved Bitcoin” (Bitcoin Melhorado). A ideia é simples: o preço é função, dentre outras coisas, da base monetária da moeda. Como o Bitcoin tem a base monetária fixa, seu valor muda com outras variáveis fora de controle. Sendo assim, se programarmos uma mudança na base monetária que ofereça um contrabalanço para a variação de preço, isso pode dirimir sua volatilidade, similarmente ao que bancos centrais fazem ao redor do mundo. Entretanto isso leva a alguns problemas:

### 1- Como medir o preço de uma maneira descentralizada?
Assim como o bitcoin e outras criptomoedas precisam atingir um consenso, poderia ser criado um sistema similar para encontrar o consenso de valor da moeda. Entretanto, haveria muitas dificuldades para se incentivar participantes honestos e para punir os desonestos. Poderia haver algum benefício para um grupo de participantes querer aumentar ou diminuir a base monetária além do que o “natural” do sistema? Como reduzir esse incentivo e efetivamente puni-lo?

### 2- É fácil emitir novos tokens e aumentar a base monetária, mas como diminuir a base monetária de maneira descentralizada?
É possível criar um efeito inflacionário que cada detentor de moedas ganha um percentual a mais de moedas, mas para decrescer a base monetária seria preciso subtrair um valor. Imagine ter R$ 20,00 na carteira para comprar um ingresso de cinema e, ao chegar lá, você só tem R$ 19,00. Isso seria bastante frustrante e um incentivo para não se usar a moeda.



### 3- O famoso [Cisne Negro](https://pt.wikipedia.org/wiki/Teoria_do_cisne_preto).
Cisne Negro é um termo popularizado por Nassim Taleb que indica um choque impossível de prever. Um sistema muito complicado que tente controlar sua volatilidade natural, pode ter problemas impossíveis de prever que tragam efeitos devastadores. Por exemplo: o IBC pode ser relativamente estável por muito tempo e, repentinamente, quebrar. A complexidade desse sistema existirá porque o valor é subjetivo e preço depende das vontades de um conjunto grande de participantes do sistema econômico. Num sistema como deste tipo, essa informação complexa leva algum tempo para ser refletida efetivamente nos preços, levando a ser superestimado ou subestimado. Dependendo da resposta dos participantes do sistema, pode ser o gatilho para gerar justamente uma ressonância destrutiva, como na [ponte de Tacoma](https://www.youtube.com/watch?v=mfQk6ac4res).

## Sistemas Colaterais
Existem diversos sistemas citados por Vitalik onde existem duas moedas: uma Estável e uma Volátil. A Estável tem valor fixado em $1 e a Volátil pode flutuar. A qualquer momento a moeda Volátil pode ser ser trocada pela moeda Estável. A partir daí existem múltiplas formas, como um uso da moeda Estável como colateral obrigatório para o uso da moeda Volátil, com o usuário sofrendo uma “chamada de margem” caso o preço suba muito acima de certa margem, e/ou uma taxa de câmbio fixada em $1 entre a moeda Estável e a Volátil, e/ou também um controle de taxa de juros para onde a moeda Estável é um contrato de dívida, havendo alguém com moeda Estável negativa para cada moeda Estável positiva.

Além dos problemas de Cisne Negro que podem surgir, há também dois outros problemas fundamentais: (i) como garantir o valor de $1 da moeda Estável de forma descentralizada? e (ii) por que ter todo esse trabalho para criar uma criptomoeda que depende no seu âmago de uma moeda fiat?

## Cesta de criptomoedas
É de conhecimento geral que um bom portfólio deve ter um nível de diversificação. “Não se deve por todos os ovos numa mesma cesta”. A [Teoria Moderna de Portfólios](https://pt.wikipedia.org/wiki/Teoria_moderna_do_portf%C3%B3lio), criada por Harry Markowitz nos anos 50, cria uma fórmula matemática para encontrar o portfólio ótimo, onde teríamos o maior retorno e menor risco para um conjunto de ativos. Com uma diversificação de ativos inversamente correlacionados, seria possível levar a volatilidade teoricamente até zero, enquanto manteria a média ponderada dos retornos. O grande problema é que todas as criptomoedas descentralizadas, de base monetária estável e limitada também são extremamente voláteis, especialmente as com baixa liquidez, e sua (des)correlação não é estável.


A correlação dos retornos diários dos últimos 2 anos entre, por exemplo, BTC e ETH, Dash, LTC e ZEC é baixa, por volta de 0,3, mas se calcularmos em períodos de 60 dias vamos ver um comportamento completamente diferente. Como vemos nos gráficos abaixo, o LTC passou praticamente todo o ano de 2017 com uma correlação alta com o BTC, maior que 0,75. Já o Ethereum apresentou momentos de antagonismo ao bitcoin, com correlação chegando a -0,5, e outros momentos onde era atingido de maneira similar, chegando a 0,8. No caso do Dash, vemos que na virada do ano de 2016/17 a criptomoeda também virou de correlação negativa para correlação altamente positiva.

![Correlações Criptos-BTC](/assets/fig1-stable.png)

O último gráfico mostra a correlação de 70 períodos de 4h para 5 criptomoedas em relação ao BTC entre novembro de 2017 e fevereiro de 2018. Quando houve a enorme subida, todas estavam descorrelacionadas com o bitcoin, mas quando o BTC caiu, caíram todas juntas e mantiveram a correlação por alguns dias. Sendo assim, um portfólio de criptomoedas não é estável o suficiente.

![Correlações vão a 1](/assets/fig2-stable.png)

## Moeda indexadas ou lastreadas
Este é o modelo mais simples e conhecido. Existem algumas por aí, mas a mais famosa, sem sombra de dúvida, é o USDT, o famoso Tether. Assim como o papel moeda de antigamente garantia uma quantia em ouro guardado em bancos, a empresa de mesmo nome garante que tem guardado 1 dólar para cada USDT existente.

É ótimo se você quiser uma maneira de enviar dólares para fora do país rapidamente com poucas taxas, mas não tão bom se você não quer confiar em terceiros. Isso começa a se tornar crucial especialmente quando a empresa Tether precisa garantir possuir 2,3 bilhões de dólares em sua reserva, [teve problemas de segurança](https://www.coindesk.com/tether-claims-30-million-stable-token-stolen-attacker/), cortou [relações com a firma que fazia a auditoria externa](https://www.bloomberg.com/news/articles/2018-01-30/crypto-exchange-bitfinex-tether-said-to-get-subpoenaed-by-cftc) na empresa e ainda [pode ser fechada por problemas regulatórios](https://cointelegraph.com/news/bitmex-tether-possibly-has-enough-cash-reserves-could-still-be-shut-down). Caso a confiança na empresa quebre, rapidamente a moeda pode quebrar também.

## O caso do ouro
Em 2015, após a reeleição da presidente Dilma, eu trabalhava como analista de investimentos e já havia lido um tanto sobre liberalismo e escola austríaca de economia. Quis diversificar meus investimentos com dólar e ouro, pois já sabia que iríamos nos aprofundar numa crise sem precedentes.


Ao comentar com meus colegas de trabalho, eles disseram “você está doido? Ouro é muito volátil!”. Realmente era. Entre 2012 e 2015, o ouro perdeu praticamente 50% do seu valor. Ajustando pela inflação, o ouro foi de quase 2,2 mil dólares para 800 em menos de 1 ano e meio nos anos 80. Mas como o mundo pôde ter uma moeda quase tão volátil quanto o bitcoin e sobrevivido por tanto tempo? **Essa é a pergunta que pode desvendar o mistério de como as criptomoedas podem vir a estabilizar seu preço**.

Vendo o gráfico abaixo com os preços do ouro desde 1910, guardadas as devidas proporções, se assemelha muito ao de uma criptomoeda.

![Fim do lastro do ouro](/assets/fig3-stable.png)


Entretanto, antes de 1971 o dólar não era uma moeda fiduciária, ou fiat, tinha lastro em ouro. Veja como o preço do ouro se manteve em US$ 35,31 durante mais de 16 anos:

![Estabilidade do preço do ouro](/assets/fig4-stable.png)


Essa análise não está 100% correta, porque obviamente o preço do ouro vai ser igual ao preço do dólar, já que o dólar era lastreado em ouro. Para termos uma análise mais justa, temos que inserir mais uma variável: a inflação. Lembrando aos amigos fãs da escola austríaca que, no caso, estou me referindo ao indicador de aumento generalizado de preços da economia dos Estados Unidos. Ou seja, vamos ver o quanto o ouro conseguiria comprar, em média, através dos tempos. Quanto mais alto o valor, mais produtos seria possível comprar no mercado com o mesmo tanto de ouro. A moeda estável ideal seria uma que se aproximasse de uma linha horizontal.

O primeiro gráfico parece até comportado quando olhamos para ele ajustado pela inflação. Ele não parece tão estável, mas vamos analisar o que houve nesse meio tempo.

![Ouro ajustado pela inflação de preços](/assets/fig5-stable.png)


Infelizmente não é fácil de encontrar dados do século XIX, mas pelos dados disponíveis vemos que houveram grandes períodos de estabilidade de preços em relação ao ouro: o período pós 1ª Guerra Mundial até a Grande Depressão e o período pós 2ª Guerra Mundial até o fim do lastro. Basicamente sempre que não haja uma guerra com proporções mundiais (lembre que a [guerra do Vietnã](https://en.wikipedia.org/wiki/Vietnam_War) durou de 1955 a 1975) ou o governo intervindo muito fortemente na política econômica. E não estou nem querendo discutir se a [crise de 1929 foi gerada pelo governo](https://mises.org/files/americas-great-depressionpdf-0) ou não, mas basta ver o próximo gráfico para ver o [afrouxamento do lastro](http://mentalfloss.com/article/12715/why-did-us-abandon-gold-standard) do dólar em ouro e comparar com suas implicações inflacionárias.

![Histórico da estabilidade do ouro ajustado pela inflação de preços](/assets/fig6-stable.png)

![Afrouxamento do lastro do ouro](/assets/fig7-stable.png)


## O Plano Real

Agora que conhece o caso de um ativo estável que perdeu o controle, vamos para o caso da moeda que estava sem controle e ficou estável: a moeda brasileira.

Não houve bem um fato que pode ser apontado como o início da hiperinflação brasileira. Vários acontecimentos foram se somando até chegarmos nos absurdos [4.922,60% em Junho de 1994](https://ww2.ibge.gov.br/home/estatistica/indicadores/precos/inpc_ipca/defaultseriesHist.shtm). Já havia [inflação elevada na época de João Goulart](http://www.r7.com/r7/media/2014/20140331-info-ditadura/20140331-info-ditadura.html), 47% quando entrou e 92% quando os militares tomaram o poder. O nacional-desenvolvimentismo dos militares “a la Dilma” também não ajudou, levou a inflação a 242%. Daí para frente, os diversos planos econômicos só pioravam a situação até o [Plano Real](https://pt.wikipedia.org/wiki/Plano_Real).

O grande desafio do novo plano era como inserir uma moeda nova pela sétima vez em 10 anos de forma efetiva? A solução encontrada foi politicamente difícil, mas necessária: ajuste de contas públicas (diminuir despesas do governo e aumentar receitas); criação da URV (Unidade Real de Valor), moeda fictícia introduzida aos poucos para ser familiarizada aos brasileiros; e lançamento do real a partir do URV, inicialmente lastreado no dólar americano.

O real foi aos poucos então sendo substituído na economia brasileira e manteve-se lastreado ao dólar até a conquista da confiança dos cidadãos, depois de privatizações, aberturas econômicas, desindexação da economia, entre outras coisas. Mas nada disso foi conseguido sem um grande esforço coordenado e centralizado.

## Conclusão

Algumas das maiores vantagens das criptomoedas são: (i) descentralização, que nos faz não precisar confiar numa entidade centralizada; e (ii) política monetária escrita em código, que nos protege da inflação. Entretanto, todos as tentativas que existem hoje tem riscos enormes de quebrar, são centralizadas ou não são muito simples em relação à política monetária, ou seja, são exatamente o contrário do motivo do bitcoin existir.

Por outro lado, o ouro nos mostra que a diferença entre a estabilidade econômica e a volatilidade está justamente na indexação dos preços da economia com base no ativo. Quando todos os preços eram medidos indiretamente em ouro (em dólar, que era equivalente a uma quantidade de ouro), havia pouca volatilidade de preços. Logo, por analogia, teremos nossa criptomoeda estável assim que ela for usada com frequência na economia e olharmos o custo das mercadorias em bitcoins, ao invés de olharmos o custo do bitcoin em reais ou dólares. Já o Plano Real nos mostra que não adianta colocar o carro na frente dos bois. Seis moedas foram criadas antes, mas o que realmente precisava era tempo para as pessoas conseguirem confiança e se acostumarem com a moeda nova, além de, claro, um belo enxugamento do Estado.

Mas cabe sempre lembrar que no final restará apenas um de dois: retornos astronômicos ou moeda virtual estável.



---

Originalmente publicado no [Portal do Bitcoin](https://portaldobitcoin.uol.com.br/nao-existem-atalhos-para-uma-criptomoeda-de-preco-estavel/) em 27 de fevereiro 2018.
