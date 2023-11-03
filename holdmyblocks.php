<?php
/**
 * Plugin Name: Hold my blocks
 * Plugin URI: https://github.com/MLNOP/holdmyblocks
 * Description: Ensemble de blocs
 * Tags: blocks, bongo-cat, plugin
 * Author: MLNOP
 * Author URI: https://mlnop.fr/
 * Requires at least: 6.2
 * Tested up to: 6.3
 * Requires PHP: 8.0
 * Version: 0.0.2
 * Stable tag: 0.0.2
 * Text Domain: hmb-blocks
 * Domain Path: /lang
 * License: GPLv2 or later
 */

/*
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version
2 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
with this program. If not, visit: https://www.gnu.org/licenses/

Copyright 2023 Monzilla Media. All rights reserved.
*/

global $wpdb;
if (!function_exists('get_plugin_data')) {
    require_once ABSPATH . 'wp-admin/includes/plugin.php';
}

define('HMB_BLOCKS_IS_PROD', false);
define('HMB_BLOCKS_ENABLE_BO', true);
define('HMB_BLOCKS_PATH', plugin_dir_path(__FILE__));
define('HMB_BLOCKS_URL', plugin_dir_url(__FILE__));
define('HMB_BLOCKS_BASE_NAME', basename(dirname(__FILE__)));
define('HMB_BLOCKS_REACT_PATH', HMB_BLOCKS_PATH . 'components/blocks/react/build');
define('HMB_BLOCKS_TABLE_NAME', $wpdb->prefix . 'hmb_blocks');

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
register_activation_hook(__FILE__, 'hmb_blocks_fill_table');
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
// require HMB_BLOCKS_PATH . 'includes/update-checker.php';
require HMB_BLOCKS_PATH . 'includes/ajax/table-update.php';

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
