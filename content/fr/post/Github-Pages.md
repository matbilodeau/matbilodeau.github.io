---
title: "Github Pages"
subtitle: Comment créer votre site github pages et le lier au domaine .dev
date: 2026-09-14
---

# Un brin d'histoire
Ça faisait longtemps que je pensais à m'enregistrer un nom de domaine pour avoir une adresse courriel personnalisée.  Je cherchais un nom facile à retenir, d'apparence professionnelle, et j'étais ouvert à l'idée d'utiliser un [TLD][0] moins conventionnel que _.com_. _.ca_, etc. Comme j'ai un compte Google et qu'ils offrent le service de registraire, je suis aller voir ce qu'ils avaient à me suggérer. C'est comme ça que j'ai fait la connaisssance du [TLD][0] en [.dev][1].

![Du bon marketing](/img/Gdomain.png)

Marketing efficace, j'ai cliqué sur le bouton. Apparement il faudra un certificat SSL si on veut publier un site web; pas grave c'est un beau nom, le prix est abordable et en plus je n'aurai pas le choix de configurer HTTPS quand je voudrai un site (ce qui force aussi les visiteurs à utiliser le protocole sécurisé), donc je le veux et il est à moi.

Dans un cours passé, le site du cours était hébergé sur Github; en fait, il était généré automatiquement à partir de fichiers _.md_ contenus quelque part dans le repo. [Github Pages][2] serait une option intéressante quand je voudrais avoir un petit site web pour présenter mes repo.

En présentant Github lors d'une démonstration dans le cours d'infonuagique, j'expliquais que ça peut servir de vitrine sur ses compétences lors d'une recherche d'emploi en ajoutant le lien sur notre CV et on me lance: "Mais pourquoi ton CV est pas sur Github?"

![Challenge Accpeted](/img/challengeAccepted.jpg)

# Comment faire
## pour pas se casser la tête pendant 2 jours avec Google Domains
Si vous utilisez un naviguateur modifié avec des extensions pour rendre votre expérience web plus pure, il se peut que les fonctionnalités de Google Domains semblent brisées. Les symptômes vécus de mon côté :
* DNS A Record qui ne prend qu'une seule ligne, même après avoir utilisé le bouton "+"; même après avoir fait "edit" et le "+"; même après avoir supprimé / ajouté l'enregistrement après la fin du TTL.
* CNAME qui reviens à mondomaine.dev au lieu de user.github.io même après avoir supprimé / ajouté l'enregistrement après la fin du TTL.

### **Utilisez le mode incognito / navigation privée**
Je sais que ça ne fait pas vraiment de sens, mais ça a fonctionné pour moi.

# Marche à suivre
Assurez-vous d'avoir:
* un compte GitHub
* un domaine
  * si votre domaine n'est pas "sécurisé", vous pouvez quand même suivre ces instructions.

Les instructions pour [Github Pages][2] indiquent de créer un repo sous la forme `user.github.io` mais vous pouvez activer [Github Pages][2] dans n'importe quel repo via les "Settings". Il est important de noter que GitHub ne peut associer qu'un seul domaine ou sous-domaine par repo, par exemple en associant www.domaine.xxx et domaine.xxx au site web. Il existe des moyens inélégants de contourner ce problème mais il n'en sera pas question ici.  Choisissez comment *vous* voulez accéder au site. Personnellement j'ai choisi d'accéder via le domaine _Apex_ et d'utiliser les sous-domaines pour des repo spécifiques, par exemple [ce repo][4].

Pour associer un domaine _Apex_, il faut simplement créer un _A RECORD_ sur Google Domains avec les adresses IP listées [ici][5]
Pour associer un sous-domaine, il faut créer un fichier [CNAME][6] (étapes 1 2 3 avec le nom complet _sous.domaine.xxx_) puis sur Google Domains ajouter un enregistrement CNAME _sous_ qui pointe vers `user.github.io`.

![GoogleDNS](/img/GoogleDomainsDNS.png)

Une fois le travail complété sur Google Domains, retourner à votre repo dans "Settings" et *attendez patiemment* que la boite à cocher pour "Enforce HTTPS" ne présente plus de message d'erreur. La propagation de l'information DNS peut prendre du temps, parfois quelques minutes mais ça peut aller jusqu'à quelques heures.  [Github Pages][2] génère automatiquement des certificats gratuits *Let's Encrypt* pour vous, sans autre effort de votre part. Si vous êtes attentifs, vous verrez possiblement une barre de progrès lors de la génération du certificat. Lorsque tout sera en règle, vous devriez voir "Your site is now published at https://...."

# Sécurité
Le principal avantage du domaine `.dev`, à part le look particulier qu'il vous offre, est la mise en place du [HSTS][7] avec le mécanisme de pré-chargement ce qui assure que les connexions au site seront toujours sécurisées. Si vous avez un autre suffixe de domaine vous pouvez activer HSTS en suivant les instructions [ici][8].


[0]: https://fr.wikipedia.org/wiki/Domaine_de_premier_niveau
[1]: https://get.dev/#benefits
[2]: https://pages.github.com
[4]: https://aucun-probleme.matbilodeau.dev/
[5]: https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain
[6]: https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain
[7]: https://fr.wikipedia.org/wiki/HTTP_Strict_Transport_Security
[8]: https://hstspreload.org/
