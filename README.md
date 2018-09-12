# ![](https://github.com/DobyLov/ob_IHM/blob/master/src/assets/Mini_4Git_OBLogoNoBkg.png) ob_IHM
ob_IHM est l'Interface homme machine du logiciel OpusBeauté.

## Objectif de OpusBeauté
 Web Application de gestion clientelle dans le mêtier du cosmétique. 

### Version des outils de développement
![](https://img.shields.io/badge/Node%20:-V%209.6.1-blue.svg) ![](https://img.shields.io/badge/Angular%20:-V%206.1.0-blue.svg) ![](https://img.shields.io/badge/Npm%20:-V%205.6.0-blue.svg) ![](https://img.shields.io/badge/Angular%20CLI%20:-V%206.1.1-blue.svg) ![](https://img.shields.io/badge/Chrome%20:-V%2068.0.3440.106-blue.svg) ![](https://img.shields.io/badge/Angular%20CDK%20:-V%206.4.1-blue.svg) ![](https://img.shields.io/badge/rxj%20:-V%206.2.2-blue.svg) ![](https://img.shields.io/badge/Typescript%20:-V%202.9.2-blue.svg)
 
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
Ces Webservices sont proposés par un MiddleWare en java.

Projet en Java (MiddleWare): OpusBeaute_MiddleWare [Heading link](https://github.com/DobyLov/opusbeaute_middleware)

### Migration
Le projet a migré à trois reprises de angular 4 à 5 à 6

### Installation du Projet

`
git clone https://github.com/DobyLov/ob_IHM.git
npm install
ng serve --port 4200 --host 192.168.1.100 --aot'
`
