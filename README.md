# Hold my blocks

![Version Wordpress](https://img.shields.io/badge/wordpress-%3E%3D%206.2-blue)
![Version ACF](https://img.shields.io/badge/acf-%3E%3D%206.2.1-cyan)
![Version Node JS](https://img.shields.io/badge/node-%3E%3D%2018-brightgreen)
![Version PHP](https://img.shields.io/badge/php-%5E8.0-blue)

![Block](https://media.giphy.com/media/l0JMrPWRQkTeg3jjO/giphy.gif)

- Les blocks sont créés en se référant à ce [tutoriel](https://developer.wordpress.org/block-editor/getting-started/create-block/), ou bien en se référant à un block existant dans ce repo.

## Arborescence des fichiers

- 📂 **holdmyblocks**
  - 📂 assets
    - Contient les assets du plugin qui seront compilés (scss, js, fonts, img etc...)
    - 📂 fonts
      - 📂 icomoon
    - 📂 img
    - 📂 js
    - 📂 scss
  - 📂 build
    - Contient tout les assets compilés du plugin (css, js, fonts, img etc...)
  - 📂 components
    - 📂 blocks
      - 📂 [acf](./components/blocks/acf/README.md)
        - 📂 build
          - Contient vos blocs acf compilés
        - 📂 src
          - 📂 your-block
            - 📂 assets
              - 📂 scss
                - Contient les fichiers de styles du block acf "your-block"
              - 📂 js
                - Contient les fichiers javascript du block acf "your-block"
              - editor.js
              - view.js
            - 📂 includes
              - fields.php
              - template.php
            - block.json
      - 📂 [react](./components/blocks/react/README.md)
        - 📂 build
          - Contient vos blocs react compilés
        - 📂 src
          - 📂 your-block
            - 📂 assets
              - 📂 scss
                - Contient les fichiers de styles du block acf "your-block"
              - 📂 js
                - Contient les fichiers javascript du block acf "your-block"
              - index.jsx
              - view.js
            - block.json
  - 📂 includes
    - Contient les fichiers php qui servent au bon fonctionnement du plugin
    - 📂 blocks
      - 📂 acf
        - Tout ce qui est en lien avec les blocks acf (register de blocks etc...)
      - 📂 react
        - Tout ce qui est en lien avec les blocks react (register de blocks etc...)
    - 📂 ajax
      - Toutes fonctions ajax
    - 📂 database
      - Toutes fonctions qui servent à créer la table de la base de données
  - 📂 lang
    - Contient les fichiers de traductions du plugin et des blocks
  - 📂 templates
    - Pages du plugin
  - holdmyblocks.php

## Compilation (voir [package.json](./package.json))

## Traduction I18n (!!nécessite wp-cli)

### Commandes

‼Les chaînes de caractères dans le code sont écrites en français‼ (C'est plus facile de traduire du français vers autre chose)
<br>
<br>
**Lancer un build avant toute commande de traduction**
<br>
**Positionnez-vous à la racine du plugin**

- Générer le .pot

  ```
  wp i18n make-pot . lang/holdmyblocks.pot --domain=holdmyblocks --exclude=node_modules,vendor,lang --include=holdmyblocks.php,blocks,build/js/*.min.js,build
  ```

- Générer les json pour le js

  ```
  wp i18n make-json lang/ --no-purge
  ```

## Créer une release du plugin ([.zip](./holdmyblocks.zip))

- Positionnez-vous à la racine du plugin
- Lancer les build du plugin & des blocks
- Lancer la commande `plugin-zip`


*Note : une release du plugin est automatiquement générée lors de la création d'un tag sur [github](https://github.com/MLNOP/holdmyblocks/releases)*


## Roadmap
- [x] React Bongo cat bloc
- [x] Mises à jour automatiques
- [ ] Back-office style
- [ ] ACF bloc exemple ([branche](https://github.com/MLNOP/holdmyblocks/tree/major/acfBlocks))
- [ ] React carousel bloc
- [ ] React modale bloc ([branche](https://github.com/MLNOP/holdmyblocks/tree/minor/reactBlockModale))
