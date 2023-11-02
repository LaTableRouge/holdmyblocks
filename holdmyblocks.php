<?php
/**
 * Plugin Name: Hold my blocks
 * Description: Ensemble de blocs
 * Author: The WordPress Contributors & VDIANA DEV
 * Author URI: https://mlnop.fr/
 * Requires at least: 6.2
 * Requires PHP: 8.0
 * Requires ACF: 6.2.1
 * Version: 0.0.1
 *
 */

global $wpdb;

define('HMB_BLOCKS_VERSION', '0.0.1');
define('HMB_BLOCKS_IS_PROD', false);
define('HMB_BLOCKS_ENABLE_BO', true);
define('HMB_BLOCKS_PATH', plugin_dir_path(__FILE__));
define('HMB_BLOCKS_URL', plugin_dir_url(__FILE__));
define('HMB_BLOCKS_BASE_NAME', basename(dirname(__FILE__)));
define('HMB_BLOCKS_REACT_PATH', HMB_BLOCKS_PATH . 'components/blocks/react/build');
define('HMB_BLOCKS_TABLE_NAME', $wpdb->prefix . 'hmb_blocks');

$blockList = [
    'react' => [
        'bongo-cat' => [
            'enabled' => true,
            'supports' => [
                'spacing' => [
                    'padding' => true
                ]
            ]
        ]
    ],
];

/*
* ====== DATABASE
* Création/Suppression d'une table custom
* Remplissage de la table avec des valeurs par défaut
* Mise en place des hooks pour l'activation/suppression du plugin
*/
require HMB_BLOCKS_PATH . 'includes/database/table-create.php';
require HMB_BLOCKS_PATH . 'includes/database/table-delete.php';
require HMB_BLOCKS_PATH . 'includes/database/table-fill.php';
register_activation_hook(__FILE__, 'hmb_blocks_create_table');
register_activation_hook(__FILE__, function () use ($blockList) {
    hmb_blocks_fill_table($blockList);
});
register_deactivation_hook(__FILE__, 'hmb_blocks_delete_table');
register_uninstall_hook(__FILE__, 'hmb_blocks_delete_table');

/*
* ====== ( •̀ ω •́ )y j'ai pas d'idée pour nommer cette partie
* Load le textdomain
* Enqueue les assets du plugin (hors blocks)
* Functions ajax
*/
require HMB_BLOCKS_PATH . 'includes/helpers.php';
require HMB_BLOCKS_PATH . 'includes/load-textdomain.php';
require HMB_BLOCKS_PATH . 'includes/enqueue-assets.php';
require HMB_BLOCKS_PATH . 'includes/ajax/table-update.php';
require HMB_BLOCKS_PATH . 'includes/ajax/table-sanitize.php';

/*
* ====== Pages
* Register la page de configuration dans le menu du BO de Wordpress
*/
if (HMB_BLOCKS_ENABLE_BO) {
    require HMB_BLOCKS_PATH . 'includes/register-page.php';
}

/*
* ====== Blocks
* Register une catégorie pour les blocks
* Enqueue les blocs react
*/
require HMB_BLOCKS_PATH . 'includes/blocks/categories-register.php';
require HMB_BLOCKS_PATH . 'includes/blocks/react/blocks-register.php';
