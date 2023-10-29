# React blocks

- Les blocks sont créés en se référant à ce [tutoriel](https://www.advancedcustomfields.com/resources/blocks/), ou bien en se référant à un block existant dans ce dossier.

## Affichage/Activation du block en Back-office

1. Renseigner le block et ses options dans le tableau `$blockList`, section acf dans le fichier [holdmyblocks.php](../../../holdmyblocks.php). (exemple ci-dessous)
```php
    'votre-slug-de-block' => [
        'enabled' => true,
        'supports' => [
            'spacing' => [
                'margin' => true,
                'padding' => true
            ]
        ]
    ]
```

## Compilation (voir [package.json](../../../package.json))

## Traduction

- Les traductions des blocs sont à générer en même temps que celles du plugin (Voir [README](../../../README.md#traduction))
