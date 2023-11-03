<?php

function hmb_blocks_fill_table() {
    global $wpdb;

    $dbDatas = $wpdb->get_results('SELECT * FROM ' . HMB_BLOCKS_TABLE_NAME);
    if (count($dbDatas) === 0) {
        $wpdb->insert(
            HMB_BLOCKS_TABLE_NAME,
            [
                'id' => 1,
                'blocks' => json_encode([]),
            ]
        );
    }
}
