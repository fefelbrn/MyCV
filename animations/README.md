# Système d'Animations

Ce dossier contient toutes les animations du site. Chaque animation est isolée dans son propre dossier.

## Structure

```
animations/
├── animation1/          # Animation actuelle (Terminal & Code Style)
│   ├── css/
│   │   └── animation.css    # Styles CSS de l'animation
│   ├── js/
│   │   ├── script.js         # Script principal (frame borders)
│   │   ├── cv-tab.js         # Gestion de la languette CV
│   │   ├── code-animation.js # Animation de code style espionnage
│   │   └── easter-eggs.js    # Easter eggs
│   └── config.js             # Configuration de l'animation
└── animation2/          # Future animation (à créer)
    ├── css/
    ├── js/
    └── config.js
```

## Changer d'animation

Pour changer d'animation, modifiez simplement le chemin dans `index.html` :

```html
<!-- Ligne 13 dans index.html -->
<script src="animations/animation1/config.js"></script>
```

Changez `animation1` par `animation2` (ou le nom de votre animation).

## Créer une nouvelle animation

1. Créez un nouveau dossier : `animations/animation2/`
2. Créez les sous-dossiers : `css/` et `js/`
3. Créez `config.js` avec la structure :
   ```javascript
   const ANIMATION_CONFIG = {
       name: 'animation2',
       css: 'animations/animation2/css/animation.css',
       scripts: [
           'animations/animation2/js/script1.js',
           'animations/animation2/js/script2.js'
       ]
   };
   ```
4. Ajoutez vos fichiers CSS et JS dans les dossiers respectifs
5. Modifiez `index.html` pour pointer vers votre nouvelle animation

## Animation 1 - Terminal & Code Style

L'animation actuelle comprend :
- **Écran d'accueil** : Texte "work" au centre avec animations de code
- **Languette CV** : Glisser vers le haut pour ouvrir le CV
- **Écran de chargement** : Terminal style avec barre de progression
- **Animations de code** : Code style espionnage en haut à droite et bas à gauche
- **Cercles 3D** : Animation de cercles rotatifs
- **Easter eggs** : Cercle en haut à gauche et bug dans le terminal

