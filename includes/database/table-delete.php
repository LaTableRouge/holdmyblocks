<?php

function hmb_blocks_delete_table() {
    global $wpdb;

    $wpdb->query('DROP TABLE IF EXISTS ' . HMB_BLOCKS_TABLE_NAME);

    delete_option('plugin_name_db_version');
}

