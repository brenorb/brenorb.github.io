---
sitemap: false
layout: post
title: "Blockchain do Bitcoin sofre breve divisão e suspeita de gasto duplo; entenda"
date: 2023-05-08
excerpt: "Uma bifurcação de cadeia de dois blocos de profundidade não é comum e só aconteceu duas vezes."
interview: true
tag:
- bitcoin
- blockchain
- fork
- commentary
comments: false
feature: /assets/blockchain-fork.png
---

As últimas 24 horas foram intensas para a comunidade do Bitcoin, com três eventos pouco comuns acontecendo neste breve intervalo de tempo na blockchain do ativo.

O primeiro — e mais raro — foi uma bifurcação inesperada na blockchain, que atingiu dois níveis de comprimento antes de ser eliminada. Na visão de alguns, a falha temporária abriu brecha para que acontecesse um gasto duplo de 10 BTC — quando um usuário gasta duas vezes a mesma unidade da criptomoeda.

A blockchain do Bitcoin pode ser vista como uma única corrente de blocos. Porém, se dois blocos são aceitos ao mesmo tempo, a cadeia se divide em dois ramos diferentes que ganham profundidade à medida que mineradores seguem adicionando blocos abaixo do ramo “não oficial”.

Na noite de domingo (07), na altura 788686 da blockchain do Bitcoin, dois blocos foram produzidos ao mesmo tempo, gerando na cadeia um novo ramo de transações que não deveria existir.

Os pesquisadores do BitMEX Research foram os primeiros a identificar a falha, ressaltando no Twitter que “divisões de cadeia (chainsplits) de comprimento 2 no Bitcoin são bastante raros.”

Segundo os analistas, a batalha foi protagonizada por dois pools de mineração: Foundry USA (com a cadeia não oficial) e a Antpool (com a cadeia oficial). Na imagem abaixo produzida pelo perfil @0xB10C, é possível ver como aconteceu a divisão temporária da cadeia, com os blocos propostos pela Foundry USA no ramo superior e da Antpool no inferior.

No final, a cadeia proposta pela Antpool saiu vencedora, já que era a de blocos com maior prova de trabalho. Quando o restante dos mineradores entrou em consenso sobre a cadeia oficial, os blocos do ramo rebelde foram desconsiderados logo em seguida.

“O fork foi resolvido naturalmente pela rede quando um novo bloco foi minerado. A regra seguida sempre é ‘a blockchain com maior prova de trabalho acumulada é a válida'”, comentou o desenvolvedor da exchange Bipa Lorenzo Maturano lembrando o que está escrito no whitepaper do Bitcoin de Satoshi Nakamoto.

A ação da Foundry USA pode não ter sido maliciosa e estar relacionada a algum problema interno de comunicação do grupo com o resto da rede do Bitcoin.

“A Foundry USA pode ter tido algum problema de comunicação e acabou ficando minerando ‘sozinha’ por um tempo, fora da rede. Pode ter minerado aqueles dois blocos para depois descobrir que a rede já tinha minerado outros na mesma altura. Seguindo o algoritmo do Satoshi, os nós seguem sempre a cadeia com mais prova de trabalho e descartam esses blocos da blockchain não oficial como sendo ‘stale’ (superados)”, complementou o desenvolvedor Narcélio Filho.

Ele relembra que essa divisão de cadeia de dois blocos de profundidade não é comum e só aconteceu outras duas vezes em mais de uma década de existência do Bitcoin.

“Historicamente, só aconteceu de uma cadeia de tamanho de dois blocos ser perdida em três momentos: em 2012, por conta de imaturidade da rede e uma botnet mal-implementada; em 2020, por erro da Slush Pool, e agora em 2023, provavelmente por erro da Foundry USA”, recordou Filho.

### Houve gasto duplo de Bitcoin?

Embora a rede do Bitcoin já tenha se restabelecido do problema, ele abriu brecha para um possível gasto duplo de cerca de 10 BTC, movidos em 13 transações. O site ForkMonitor, da BitMEX Research, afirma que o gasto duplo aconteceu, mas ainda não há consenso na comunidade.

“Não é nada alarmante no sentido de protocolo. Tudo funciona direito e problemas como esse sempre foram possíveis de acontecer”, tranquiliza Breno Brito, cientista de dados do MB. “Porém isso não deixa de ser potencialmente ruim porque pode abrir espaço para gastos duplos”, acrescenta.

Narcélio Filho concorda que teve tecnicamente um gasto duplo, mas que é difícil confirmar se algum lado dessa negociação — isso se o mesmo usuário não estava nos dois lados do trade — foi afetado pelo gasto duplo. Ele dá um exemplo de como alguém poderia tirar vantagem da falha vista hoje na rede do Bitcoin.

“Digamos que eu compro seu carro por 1 BTC, mando para sua carteira, você recebe uma confirmação e me dá a chave. Depois a blockchain ‘desconfirma’ a transação por conta do bloco superado, eu aproveito e refaço a transação para mim mesmo de novo e assim, fico com seu carro e com meu BTC”, diz o dev.

Por isso, o recomendado é que usuários sempre aguardem no mínimo seis confirmações para ter certeza de que o bitcoin foi de fato transacionado na blockchain.

Já Bruno Ely Garcia, desenvolvedor que ganhou grant da Vinteum para trabalhar em tempo integral no Bitcoin Core, acredita que não houve gasto duplo, pelo menos “não como conhecemos até então”. Ele explica:

“Acredito que tenha sido transações RBF [replace by fee ou “substituição por taxa”, em português], que é quando você cria uma transação e sinaliza que essa transação pode ser substituída. Se você perceber que sua transação inicial está com uma taxa muito baixa e vai demorar para ser confirmada, você pode mandar outra que anula essa transação antiga, mas que paga uma taxa maior. Por isso se chama replace by fee.”

Na visão de Garcia, esse caso é ainda mais provável no atual contexto de grande congestionamento que atinge a blockchain do Bitcoin.

Ele avalia que fazer uma transação replace by fee é simples se a carteira que o usuário usa oferece essa ferramenta. No entanto, não está claro até o momento se as 13 transações envolvidas no possível gasto duplo estavam previamente sinalizadas para RBF.

“Para você usar o replace by fee hoje, é preciso criar uma transação e sinalizar que ela pode ser substituída. Se você não sinaliza, ela não pode ser substituída e fica lá até expirar. Como o mercado está em alvoroço, muita transação de replace by fee estão sendo feitas”, analisa.

### Blocos vazios e atrasados

Além da bifurcação de dois níveis vista na blockchain do Bitcoin, outros eventos não muito comuns também foram vistos nas últimas 24 horas na rede.

De acordo com o jornalista Colin Wu, da página Wu Blockchain, a blockchain do Bitcoin ficou por cerca de uma hora sem receber novos blocos dos mineradores. Embora isso não seja raro, é um intervalo de tempo muito maior do que o normal de dez minutos.

Intervalos longos entre blocos foram vistos também em abril de 2021, quando o tempo de geração do bloco atingiu 122 minutos, e mais uma vez em junho daquele ano, quando um tempo entre blocos de 119 minutos foi registrado.

“É estatisticamente normal tanto demorar uma hora quanto demorar segundos para um bloco ser adicionado, por conta da característica de “distribuição de poisson” do hashcash, o algoritmo de PoW do Bitcoin”, explicou o desenvolvedor Narcélio Filho.

O terceiro evento que também não costuma acontecer todos os dias na rede do bitcoin e que foi visto também nesta segunda-feira foi a inclusão de um bloco “vazio” na blockchain. O bloco 788703 foi adicionado na rede contendo apenas a recompensa padrão 6,25 BTC para o minerador, sem com que qualquer outra transação fosse incluída no bloco.

Isso acontece porque a mineração do Bitcoin funciona com uma espécie de loteria em que um minerador pode ter a sorte de encontrar um bloco segundos depois de outro já ter sido adicionado na rede, sem ter tempo de organizar as transações que deveriam ser processadas.

E não é por falta de transações esperando confirmação. No final de semana, uma fila de 400 mil transações esperando confirmação foi vista na blockchain do Bitcoin, um número nunca visto antes.

A rede do Bitcoin está sendo testada com uma grande de número de operações sendo feitas no projeto de BRC-20 do Ordinals, que facilita a popularização de memecoins — depois da febre dos NFTs — sendo criadas na rede do Bitcoin.

Neste ritmo, a rede vai se tornando mais carregada, com os mineradores não dando conta de validar blocos e causando em taxas mais caras. Segundo dados do BitInfoCharts, a taxa média do bitcoin está por volta de US$ 19,20 nesta segunda-feira, um número que não passava de US$ 0,80 duas semanas atrás.

---

Publicado no [Portal do Bitcoin](https://portaldobitcoin.uol.com.br/blockchain-do-bitcoin-sofre-breve-divisao-e-suspeita-de-gasto-duplo-entenda/) em 08 maio de 2023.
