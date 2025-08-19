---
title: "Functions as a Service - FaaS (en Français)"
slug: "fonction-service"
date: "2017-01-13T21:25:00Z"
author: "Alex Ellis"
meta_title: "Fonction en tant que Service"
meta_description: "Découvrez une preuve de concept innovante : Les Fonctions en tant que Service (FaaS) qui permettent des fonctions \"sans serveur\" sous Docker en mode Swarm."
tags:
  - "docker"
  - "serverless"
  - "fonctions"
  - "french"
  - "translation"
  - "french-language"
---

> Translated from the [original article](http://blog.alexellis.io/functions-as-a-service/) by Sylvain Deauré. Would you like to see more content covered in French?

Un des mots à la mode en 2016 a été "*Serverless*" - mais qui sait vraiment ce que cela signifie ? Deux fournisseurs, [AWS Lambda](http://docs.aws.amazon.com/lambda/latest/dg/welcome.html) et [Kubernetes Jobs](http://kubernetes.io/docs/user-guide/jobs/) ont fourni leur solution dans ce domaine, mais...

> Je ne suis pas certain que nous ayons un standard clairement défini, qui précise à quoi un système "*serverless*" doit ressembler ni comment il est censé se comporter.

Voici quelques réflexions personnelles sur ce concept, basées sur ce que j'ai constaté cette année :

* A tendance à impliquer des fonctions à courte durée de vie (le timeout par défaut de Lambda est de 1 seconde).
* Ne publie pas de services TCP - Accède fréquemment à des ressources ou services tiers.
* A tendance à être piloté par des évènements : typiquement, répondre à des webhooks.
* Devrait absorber facilement des pointes de trafic.
* En dépit du nom, tourne sur des serveurs supportés par une infrastructure fluide, non déterministe.
* Quand ça fonctionne bien, permet de cacher de la complexité sous une simplicité apparente.
* Est accompagné de plusieurs préoccupations connexes : gestion d'infrastructure, traitement par lots, contrôle d'accès, définitions, mise à l'échelle et dépendances.

Si vous voulez en savoir plus, Martin Fowler tient à jour un [Article Bliki sur le concept Serverless (en anglais)](http://martinfowler.com/bliki/Serverless.html).

#### TL;DR?

Foncez sur le guide de démarrage rapide et [clonez le code de FaaS sur Github]( https://github.com/alexellis/faas/tree/draft_1).

#### Exploiter Docker et le mode Swarm (essaim)

Un ticket a été ouvert sur le dépôt Github de Docker le 23 Juin, juste après que le mode Swarm ait été rendu public : "[Le mode Swarm mode devrait supporter les batchs/cron jobs](https://github.com/docker/docker/issues/23880)". Il rend compte de la complexité inhérente au support de fonctions "*Serverless*".

Plutôt que de chercher à résoudre la question "*Serverless*" dans son ensemble, avec un seul monolithe qui couvre tous les cas, nous pourrions nous concentrer sur un ou deux aspects, comme **comment lancer des traitements ad-hoc** ou **comment fournir une infrastructure fluide**.

> Parlons de Fonctions en tant que Service (FaaS, Functions as a Service en Anglais).

J'ai travaillé pendant plusieurs semaines avec les fonctions AWS Lambda pour le SDK Alexa, et j'ai fini par en apprécier la simplicité d'utilisation. J'envoie mes fonctions et l'infrastructure d'Amazon s'occupe de lancer mon code quand besoin. Les services gérés comme AWS Lambda sont attirants, parce qu'ils fonctionnent directement et s'intègrent sans douleur avec les autres services comme S3, EC2, Cloudwatch ou encore les Files SNS. Bien que cette intégration ajoute de la valeur, cela conduit aussi à être prisonnier d'un vendeur particulier. Existerait-il d'autres options pour des clouds privés ou hybrides ?

J'ai creusé ce que l'équipe Docker avait présenté sur "*Serverless*" à la Dockercon 2016 et ai commencé à l'adapter pour créer un équivalent de Lambda qui pourrait tourner **sur votre propre matériel** en utilisant **Docker en mode Swarm**.

### Mark I - Passerelle d'API

J'avais donc travaillé avec le SDK du service Alexa voice : il permet de définir des compétences pour votre [Echo/Dot Amazon](https://www.amazon.co.uk/dp/B01GAGVIE4). Le SDK transforme l'invocation vocale en une Intention (action) accompagnée d'un certain nombre de Slots (paramètres). Le service Alexa invoque alors un point d'accès HTTPs ou une fonction Lambda avec une structure JSON, et en attend une autre en retour qui sera lue par l'objet connecté d'Amazon.

> Cela semblait un bon point de départ pour commencer à démocratiser le projet "Funker" que Ben Frishman avait montré lors de la Dockercon.

![](https://raw.githubusercontent.com/alexellis/funker-dispatch/master/alexa-funker.png)

Il ne m'a pas fallu longtemps pour comprendre ce que Ben faisait. Le concept de base de Funker était d'ouvrir un port TCP pour accepter une requête unique sous forme de JSON et renvoyer une réponse.

Avantages:

* Des librairies sont disponibles en Go, Node.js et Python.
* Peut être invoqué par d'autres conteneurs du réseau, comme dans l'exemple de vote dont Ben a fait la démo.

Inconvénients:

* Les passerelles doivent être maintenues avec plusieurs langages de programmation différents.
* La fonction (le conteneur) est tuée après chaque invocation ce qui rend le système lent.
* Tout est manuel - On suppose que les fonctions sont lancées au préalable.
* Il n'existe pas de moyen aisé d'interagir avec les fonctions en dehors du réseau (pas de passerelle API ni de reverse-proxy)
* Ben a précisé que ce n'était qu'une preuve de concept destinée à agiter les neurones dans la communauté Docker.

Je me suis décidé à résoudre certains de ces problèmes : j'ai assemblé une démonstration complètement fonctionnelle d'une passerelle d'API que j'ai connecté à mon Echo Dot de la maison. J'ai également écrit le code permettant aux fonctions d'exécuter plus d'une requête.

<iframe width="560" height="315" src="https://www.youtube.com/embed/BQP67FWF1P8" frameborder="0" allowfullscreen></iframe>

La solution de passerelle API (funker-dispatch) était basée sur Node.js, et pouvait donc tourner sur n'importe quel matériel qui supporte Docker. Pour mon installation j'ai choisi un cluster de Raspberry PI, puisque même en laissant tourner non stop, ça ne coute rien.
* [Cloner le code de funker-dispatch sur Github](https://github.com/alexellis/funker-dispatch)

Il restait cependant quelques problèmes :

Le moyen de contrôler l'accès aux fonctions ou de catégoriser les différentes requêtes était un peu flou. Ma première tentative pour résoudre ce problème a été [services.json](https://github.com/alexellis/funker-dispatch/blob/services_json/services.json).

Je devais toujours maintenir toutes les librairies de Ben Funker et je voulais les modifier pour leur permettre de servir plus d'une requête par instance.

Je voulais soumettre mon travail à la Dockercon en tant que Hack cool ou comme une présentation de haut niveau. Malheureusement, le fait d'avoir construit sur la base de Funker jouait contre ma soumission. Il fallait proposer quelque chose de nouveau.

### Mark II - FaaS

J'ai discuté avec Justin Cormack de l'équipe d'ingénieurs de Docker à Cambridge et il a suggéré une variante de l'idée de départ : nous ne ferions tourner que des processus dans les conteneurs, et utiliserions les pipes STDIN/STDOUT à la mode Unix pure pour contrôler les flux. Les sockets TCP ne me plaisaient pas non plus, ils ont donc été remplacés par un serveur HTTP léger.

> Cela signifie que nous pouvions créer des fonctions "*Serverless*" à partir de n'importe quel process, y compris `cat`. Nous pouvons même les tester avec `curl`.

Voici donc une proposition pour la nouvelle version de **Fonctions en tant que Service** en mode Swarm, qui corrige plusieurs des limitations précédentes.

**Watchdog de fonction**

* Chaque conteneur a un processus watchdog qui accepte les requêtes d'une passerelle d'API.
* Le watchdog utilise un appel système vers os/exec, il n'y a aucune magie en jeu.
* Les paramètres d'entrée sont fournis via le pipe STDIN
* La réponse est lue depuis STDOUT
* Le watchdog supervise les contraintes de délai.

Les fonctions peuvent être appelées de n'importe quel conteneur dans l'essaim tout comme avec Funker, mais nous optons pour un mécanisme de transport standard : HTTP et JSON. Cela signifie que nous n'aurons à maintenir qu'une seule version du watchdog en Golang.

**Passerelle API**

La passerelle API est votre point d'accès aux fonctions quand vous exécutez du code en dehors du réseau Swarm. Cela implique aussi que quand vous consommez des évènements comme des POSTs HTTP depuis des sources externes, vous n'avez pas à dupliquer le même code bateau pour fournir un serveur http.

> Vous pouvez vous concentrer sur la gestion de l'évènement et son traitement rapide.

**Métriques**

Puisque le moteur Docker propose une série de métriques au travers du format Prometheus, les FaaS en disposent également - visitez simplement `http://localhost:8080/metrics/`.

Les routes sont accessibles de la façon suivante :

* /function/nom-du-service
    * Header `X-Function` avec comme valeur nom-du-service
* Ou auto-détection pour les Intentions du SDK Alexa qui invoquent le nom-du-service du nom de l'Intention des requêtes JSON Alexa.

* [Cloner le code de faas sur Github]( https://github.com/alexellis/faas/tree/draft_1)

#### Une fonction démo

Ainsi, pour créer une fonction qui [stocke les webhooks](https://github.com/alexellis/faas/tree/draft_1/sample-functions/WebhookStash), il suffit d'une application toute simple en Go qui écrit dans le répertoire de travail :

```
package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"time"
)

func main() {
	input, _ := ioutil.ReadAll(os.Stdin)
	fmt.Println("Stashing request")
	now := time.Now()
	stamp := strconv.FormatInt(now.UnixNano(), 10)

	ioutil.WriteFile(stamp+".txt", input, 0644)
}
```

Ensuite nous construisons un fichier Dockerfile et ajoutons le process watchdog en lui indiquant quoi invoquer :

```
FROM golang:1.7.3
RUN mkdir -p /go/src/app
COPY handler.go /go/src/app
WORKDIR /go/src/app
RUN go get -d -v
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

COPY fwatchdog  /usr/bin/

ENV fprocess="/go/src/app/app"
CMD ["fwatchdog"]
```

Tout semble standard, à l'exception des 3 dernières lignes :

```
COPY fwatchdog  /usr/bin/

ENV fprocess="/go/src/app/app"
CMD ["fwatchdog"]
```

La variable d'environnement `fprocess` contient l'exécutable à lancer. Cela pourrait être n'importe quoi, y compris un utilitaire bash comme `cat` ou une application Node.js. Tout ce que ce programme doit faire est lire STDIN.
Si vous suivez toutes les instructions du dépôt Github vous pourrez lancer le webhook stash et l'invoquer comme suit :

```
# curl -X POST -v -d '{"event": "commit", "repository": "faas", "user": "alexellis"}' localhost:8080/function/webhookstash
```

Vous pouvez alors trouver l'instance de la fonction avec `docker ps` et utiliser `docker exec` pour inspecter le fichier dans lequel la requête a été stockée :

```
# docker exec webhookstash.1.z054csrh70tgk9s5k4bb8uefq find . |grep .txt
./1373526714243466079.txt
```

Pourquoi ne pas créer une petite instance sur Digital Ocean pour essayer ça et le connecter à un webhook Github ou Slack ?

* [Creer un hôte docker sur Digital Ocean (en anglais)](https://m.do.co/c/8d4e75e9886f)

Si vous activez le [mode expérimental de Docker (en anglais)](https://github.com/docker/docker/tree/master/experimental) vous pouvez même suivre les logs de votre service alors qu'il tourne sur d'autres hôtes de votre essaim.

```
docker service logs webhookstash
webhookstash.1.s8q9f2leuhx4@serverless.local.lan    | Stashing request
webhookstash.2.fd7d4d7d1tp8@serverless.local.lan    | Stashing request
webhookstash.1.s8q9f2leuhx4@serverless.local.lan    | Stashing request
```

#### D'autres fonctions

Voici d'autres fonctions exemples :

* Une compétence Alexa qui indique le nom d'hôte de la machine qui exécute le code : [HostnameIntent](https://github.com/alexellis/faas/tree/draft_1/sample-functions/HostnameIntent)
* Une compétence Alexa pour [trouver le nombre de capitaines Docker](https://github.com/alexellis/faas/tree/draft_1/sample-functions/CaptainsIntent) et [changer la couleur d'une lampe connectée](https://github.com/alexellis/faas/tree/draft_1/sample-functions/ChangeColorIntent)
* Une simple fonction qui retourne des informations sur le système d'exploitation [NodeInfo](https://github.com/alexellis/faas/tree/draft_1/sample-functions/NodeInfo)
* Utiliser un script bash ou un utilitaire système comme `cat` pour fournir un service d'écho : [catservice](https://github.com/alexellis/faas/tree/draft_1/sample-functions/catservice)

#### Et ensuite ?

Il nous reste à définir les éléments suivants - Plus de détails se trouvent dans le fichier [README.md (en anglais)](https://github.com/alexellis/faas/tree/draft_1).

* Comment démarrer les services (fonctions)

Les services ou fonctions peuvent être démarrés à la main, via un `docker deploy` ou par l'intermédiaire de la passerelle API. Si les services sont démarrés ou lancés par la passerelle API alors des contraintes seront nécessaires, par exemple une liste de services valides.

* Comment sécuriser le point d'accès de l'API (si nécessaire)

Le protocole HTTPs devrait être implémenté au niveau de la passerelle API ou via Nginx avec un connecteur SSL.

Les méthodes sont conçues pour être invoquées principalement par le biais de webhooks, donc l'authentification n'est pas forcément nécessaire, mais il faut être plus prudent en ce qui concerne le time out des requêtes.

* Comment changer d'échelle

Les métriques sont enregistrées via Prometheus et sont accessibles sur la passerelle API avec `/metrics` sur HTTP.

Deux modes de mise à l'échelle automatique (auto-scaling) peuvent être envisagés : par Instance et par Infrastructure.


Avec une **mise à l'échelle par Instance** nous surveillerions le débit et ajusterions le nombre d'instances de fonctions au fur et à mesure de la variation de la demande.

La **mise à l'échelle par Infrastructure** pourrait tirer parti d'outils récemment publiés en open-source comme Infrakit pour lancer de manière dynamique de nouveaux noeuds en mode Essaim sur AWS, Azure ou des clouds privés.

### Comment puis-je aider ?

**Clonez le code et testez-le  :**

* [Cloner le code de faas sur Github]( https://github.com/alexellis/faas/tree/draft_1)

> Le fichier `oneshot.sh` clone le dépôt, construit et lance la passerelle ainsi qu'un service "cat" qui renvoie tout contenu que vous lui envoyez.

Votre retour sur twitter serait également apprécié, alors n'hésitez pas à partager :


<blockquote class="twitter-tweet" data-cards="hidden" data-lang="fr"><p lang="fr" dir="ltr">Fonctions en tant que Service (FaaS) - une PoC pour<a href="https://twitter.com/docker">@docker</a> en mode Swarm. <a href="https://t.co/EUO7Lli5qE">https://t.co/EUO7Lli5qE</a> <a href="https://twitter.com/hashtag/dockercaptain?src=hash">#dockercaptain</a> <a href="https://twitter.com/hashtag/serverless?src=hash">#serverless</a> <a href="https://twitter.com/hashtag/containers?src=hash">#containers</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/816626967097331712">January 4, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>


**Créez votre propre fonction**

Jetez un coup d'oeil aux [exemples](https://github.com/alexellis/faas/tree/draft_1/sample-functions) et créez votre propre fonction comme la [démo WebhookStash ci-dessus](https://github.com/alexellis/faas/tree/draft_1/sample-functions/WebhookStash).

**Dites moi ce que vous avez aimé, ce dont vous avez besoin**

Ceci est une preuve de concept - J'ai besoin de votre retour pour savoir ce qui vous plait, ou ce dont vous avez besoin pour que ça vous soit utile.

### Vous pourriez également apprécier :
(en anglais)

* [2016 or 12 months of writing, speaking and hacking](http://blog.alexellis.io/twelve-months-of-hacking/)

* [Docker Swarm Mode on the Raspberry Pi](http://blog.alexellis.io/tag/raspberry-pi/)

### A propos de la traduction :

Cet article d'Alex Ellis a été traduit de l'anglais vers le français par [Sylvain Deauré](https://twitter.com/SylvainDeaure).

> Sylvain est un touche à tout, notamment développeur d'outils SaaS. Son petit dernier, [Cocon.Se](http://cocon.se/) vous permet d'analyser et voir votre site web comme le perçoit un moteur de recherche.