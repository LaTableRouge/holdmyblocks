<?php

function hmb_blocks_register_page() {
    $svgString = '';
    $svgPath = HMB_BLOCKS_PATH . '/build/img/block-icon.svg';
    if (file_exists($svgPath)) {
        $svg = file_get_contents($svgPath);
        $svgString = 'data:image/svg+xml;base64,' . base64_encode($svg);
    }

    add_menu_page(
        __('Configuration', 'hmb-blocks'),
        __('Hold my blocks', 'hmb-blocks'),
        'manage_options',
        'holdmyblocks/templates/admin.php',
        '',
        $svgString
    );
}
add_action('admin_menu', 'hmb_blocks_register_page');
