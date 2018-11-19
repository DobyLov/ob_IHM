# ![](https://github.com/DobyLov/ob_IHM/blob/master/src/assets/Mini_4Git_OBLogoNoBkg.png) ob_IHM
ob_IHM est l'Interface homme machine du logiciel OpusBeauté.

## Objectif de OpusBeauté
 Web Application de gestion clientelle en cosmétique. 
 
 ### Fonctionnalités
 Ci-dessous la liste des actions réalisables 

 **RDV :** Permet de consulter, ajouter, modifier, supprimer un rendez-vous horodaté avec une client pour une prestation cosmetique ainsi que sa durée.
 
 **Client:** Détail du client, Ajout, Edition, Modification, Suppressiondu d'un Client.
 
 **Prestation:** Détail d'une Prestation, Ajout, Edition, Modification, Suppressiondu d'un Prestation.
 
 **Praticiens:** Détail d'un Praticien(utilisateurs), Ajout, Edition, Modification, Suppressiondu d'un Praticien.

 **Connexion:** Permet l'authentification sur l'application d'un Utilisateur/Praticien.
 
 **Deconnexion** Permet à l'utilisateur de se deconnecter de l'application.

 **Parametre:** Detail de l'utilisateur logué, permet le changement du mot de passe...

 **Rgpd:** Informe le Client de l'utilisation de ses données et règle les moyens de communication.

### Prérequis
L'IHM est développée en TypeScript via le frameWork Angular et s'appuie sur des WebServices pour fonctionner.
Ces WebServices sont proposés par un MiddleWare développé en java.

Projet en Java (MiddleWare): [OpusBeaute_MiddleWare](https://github.com/DobyLov/opusbeaute_middleware)

### Version des outils de développement
![](https://img.shields.io/badge/Node%20:-V%209.6.1-blue.svg) 
![](https://img.shields.io/badge/Angular%20:-V%207.0-blue.svg) 
![](https://img.shields.io/badge/Npm%20:-V%206.4.1-blue.svg) 
![](https://img.shields.io/badge/@Angular%20CLI%20:-V%207.0.1-blue.svg)
![](https://img.shields.io/badge/@Angular%20flex-layout%20:-V%207.0.0-beta.19-blue.svg)
![](https://img.shields.io/badge/Chrome%20:-V%2068.0.3440.106-blue.svg)
![](https://img.shields.io/badge/Angular%20CDK%20:-V%207.0.1-blue.svg) 
![](https://img.shields.io/badge/rxjs%20:-V%206.3.3-blue.svg)
![](https://img.shields.io/badge/webpack%20:-V%204.21.0-blue.svg) 
![](https://img.shields.io/badge/Typescript%20:-V%203.1.3-blue.svg)

### Migration
Le projet a migré à 4 reprises de angular 4 à 5 à 6 et 7
Migration 4 vers 5 le : xx/xx/2018
Migration 5 vers 6 le : xx/xx/2018
Migration 6 vers 7 le : 19/10/2018

### Installation du Projet
! Récuperer l'@IP du poste sur lequel sera installé ob_IHM !

    git clone https://github.com/DobyLov/ob_IHM.git
    npm install
    ng serve --port 4200 --host @IP à renseigner --aot


