---
layout: post
permalink: /articles/bolt-fun-story/
lang: en
title: "Bolt Fun Story: training an AI on Miniscript in a week"
date: 2023-12-10
excerpt: "Training an LLM on a niche language like Miniscript is hard because examples are scarce. This is how we built a dataset for Minimaxis during a hackathon, and what went wrong the week before training."
description: "The story behind Minimaxis, a Miniscript AI assistant for Bitcoin: building a dataset of high-quality examples at Satshack São Paulo and Legends of Lightning, and the last-week scramble to train and deploy the model."
tags:
- bitcoin
- ai
- miniscript
- hackathon
- smart contracts
comments: false
feature: /assets/generated/minimaxis.png
---

Two programming paradigms stand in contrast. The conventional method is where programmers meticulously code rules. The AI approach is where examples are provided and the AI learns the rules. AI is known as a universal approximator, which means it can interpolate between examples, even if the examples are two images of cats or different texts.

The internet has thus created a fertile ground for AI to bloom. However, training a Large Language Model (LLM) on a niche language like Miniscript poses unique challenges due to the scarcity of examples. Within a single day, we produced 200 examples at Satshack São Paulo, laying the groundwork for the AI model's training.

For Legends of Lightning, we took a month curating the examples, deleting, rewriting them and writing others. The goal was to ensure that the dataset was of the utmost quality, enabling the AI model to generalize effectively. We got to about 300 high quality examples.

However, just as we were gearing up for the training in the final week, the code that had been working seamlessly throughout the project inexplicably stopped functioning. This week was marked by exhaustive testing, experimentation with different libraries, and countless variations in an attempt to resurrect the functionality of the code. Despite our best efforts, we found ourselves in a frustrating loop of trial and error, with no apparent resolution in sight. The coding gods seemed to have abandoned us, leaving the team in the throes of uncertainty.

Just when it seemed that all hope was lost, the same code that had inexplicably failed before inexplicably started working again. Despite being exhausted and drained, we thanked the coding gods for their mercy. With the code back in working order, we now face the task of training and deploying the AI LLM model in just one day while on a 16-hour bus trip back home.

Giving up is not an option. We'll do our best.

## Links

- [Minimaxis: Miniscript AI code assistant for Bitcoin smart contracts](/projects/minimaxis/)
