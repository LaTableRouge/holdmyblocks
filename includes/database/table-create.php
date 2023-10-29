<?php

function hmb_blocks_create_table() {
    global $wpdb;

    $plugin_name_db_version = '1.0';
    $charset_collate = $wpdb->get_charset_collate();

    $wpdb->query('CREATE TABLE IF NOT EXISTS ' . HMB_BLOCKS_TABLE_NAME . " (`id` int(11) NOT NULL AUTO_INCREMENT, `blocks` json, PRIMARY KEY (`id`)) {$charset_collate}");

    add_option('plugin_name_db_version', $plugin_name_db_version);
}
