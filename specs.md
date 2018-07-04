### Sujet détaillé et idées de travail ###

Différents statuts de lecture pour un mot:

	unknown: 0 lecture
	beginner: 1 lecture
	apprentice: 12 lectures ou plus
	guru: 25 lectures ou plus et un item réussi
	master: 50 lectures ou plus et trois items réussis à la suite

Toutes les valeurs numériques sont suceptibles de changer. Elles sont la à titre indicatif



On a pour chaque utilisateur :

- son niveau (un niveau tous les 1000 mots connus)
- la liste des mots qu'il connait
- la liste des 1000 mots de son niveau
- une liste de mots à apprendre prochainements ("liste SRS")
- la liste des mots qu'il ne connait pas


# A partir de ces infos, il faut générer : 

- des listes de vocabulaire à apprendre (assez courtes typiquement 10 mots)
- des textes à recommander contenant des mots à apprendre (% de mots inconnus ~90%)
- des vidéos à recommander contenant des mots à apprendre (% de mots inconnus ~90%)
- une synthese vocale des mots
- une liste d'images en rapport avec les mots
- une liste de définitions des mots


Ceci permet de constituer une série d'items (tâches) à effectuer pour l'utilisateur:

	(item court) Choisir la bonne définition pour un mot donné
	(item court) Choisir le bon mot pour une définition donnée
	(item court) Choisir la bonne paraphrase pour un mot donné
	(item court) petit jeu libre flashcard 
	(item court) liste de vocabulaire brut à apprendre
	(item long) Lecture d'un texte court comportant des mots de vocabulaire à réviser
	(item long) Visionnage d'une vidéo Youtube comportant des mots de vocabulaire à réviser

Les items courts doivent être implémentés à la manière d'un mini-jeu: ludique et rapide

# Grâce à ceci, on peut créer un (ou des) programme(s) d'entrainement:

ex: programme simple: 	    item court -> item long
    programme classique:    vocabulaire brut -> Items courts -> item(s) longs(s) 
    programme renforcement: vocabulaire brut -> Items courts -> item(s) longs(s) -> item court 
    programme sensitif:     voc -> item court -> ...
    programme intuitif:	    item long -> item court
    programme libre:        choix des items par l'utiisateur

Ces programmes (non exhaustif) permettent de proposer des exercices pour différents profils d'utilisateurs. 

	


L'utilisateur passe au niveau superieur lorsqu'il connait une proportion suffisante de la liste de mots de son niveau courant.
On donne des conseils à l'utilisateur sur quels type de programme choisir (par rapport à son niveau notemment) 
On donne des conseils sur les choses à ne pas faire (ex: toujours les memes items sans mélange)



##
Côté back :

Initialement: liste SRS = []
On ajoute des mots dans la liste SRS (un nombre raisonnable)
Les mots de la liste SRS sont présentés à l'utilisateur de différentes manières (items) en suivant les intervalles de temps SRS
Lorsqu'un mot dépasse le statut "master", il est retiré de la liste SRS. ("notif envoyé : nouveau mot appris")
On ajoute des nouveaux mots dans la liste lorsqu'il n'y en a plus assez.


Coté front:

L'utilisateur a acces à :
Son niveau
Les listes de mots connus et la liste SRS (il peut consulter ces mots et leur traduction)
Les programmes qu'il peut selectionner selon son envie
Des consignes d'utilisation selon son niveau/son profil



#### Etapes de travail

1) Creer une interface graphique de quizz en local avec angular


2)Creer un systeme de srs basique
	classe word
	classe srs
	...
2) Imlémenter les items de travail les plus simples ( listes de vocs, ...)
	liste de voc
	memory
	flashcard (anki)
	...
3) Ajouter une synthese vocale aux mots
4) Ajouter des images aux mots
...
...

#idées
Adapter le spacing du srs en fonction de l'utilisateur

