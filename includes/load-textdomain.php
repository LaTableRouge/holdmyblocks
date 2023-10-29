<?php

function hmb_blocks_load_textdomain() {
    load_plugin_textdomain(
        'hmb-blocks',
        false,
        HMB_BLOCKS_BASE_NAME . '/lang'
    );
}

if (function_exists('get_field')) {
    add_action('acf/init', 'hmb_blocks_load_textdomain');
}else {
    add_action('init', 'hmb_blocks_load_textdomain');
}
