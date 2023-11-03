<?php

function hmb_blocks_enqueue_admin_assets($hook) {
    if ($hook === 'holdmyblocks/templates/admin.php') {
        $pluginDatas = get_plugin_data(HMB_BLOCKS_PATH . HMB_BLOCKS_BASE_NAME . '.php');

        $scriptFiles = [
            'admin'
        ];

        $scriptFileSuffix = HMB_BLOCKS_IS_PROD ? '.min.js' : '.js';

        foreach ($scriptFiles as $file) {
            $fileSlug = 'hmb-blocks-' . $file;
            $filePath = HMB_BLOCKS_URL . 'build/js/' . $file . $scriptFileSuffix;

            wp_register_script(
                $fileSlug,
                $filePath,
                ['jquery', 'wp-i18n'], // Libraries to use
                $pluginDatas['Version'],
                [
                    'in_footer' => true,
                    'strategy' => 'defer'
                ]
            );

            // Pass les traductions au script du block via la clé
            $langPath = HMB_BLOCKS_PATH . 'lang/';
            if (file_exists($langPath)) {
                wp_set_script_translations(
                    $fileSlug,
                    'hmb-blocks',
                    $langPath
                );
            }

            wp_localize_script(
                $fileSlug,
                'plugin_params',
                [
                    'ajax_url' => admin_url('admin-ajax.php'),
                ]
            );

            wp_enqueue_script($fileSlug);
        }

        $styleFiles = [
            'admin'
        ];

        $styleFileSuffix = HMB_BLOCKS_IS_PROD ? '.min.css' : '.css';

        foreach ($styleFiles as $file) {

            $fileSlug = 'hmb-blocks-' . $file;
            $filePath = HMB_BLOCKS_URL . 'build/css/' . $file . $styleFileSuffix;

            wp_enqueue_style(
                $fileSlug,
                $filePath,
                [],
                $pluginDatas['Version']
            );
        }
    }
}
add_action('admin_enqueue_scripts', 'hmb_blocks_enqueue_admin_assets');

function hmb_blocks_enqueue_editor_assets($hook) {
    $pluginDatas = get_plugin_data(HMB_BLOCKS_PATH . HMB_BLOCKS_BASE_NAME . '.php');

    $scriptFiles = [
        'editor'
    ];

    $scriptFileSuffix = HMB_BLOCKS_IS_PROD ? '.min.js' : '.js';

    foreach ($scriptFiles as $file) {

        $fileSlug = 'hmb-blocks' . $file;
        $filePath = HMB_BLOCKS_URL . 'build/js/' . $file . $scriptFileSuffix;

        wp_register_script(
            $fileSlug,
            $filePath,
            ['jquery', 'wp-i18n', 'wp-blocks'], // Libraries to use
            $pluginDatas['Version'],
            [
                'in_footer' => true,
                'strategy' => 'defer'
            ]
        );

        // Pass les traductions au script du block via la clé
        $langPath = HMB_BLOCKS_PATH . 'lang';
        if (file_exists($langPath)) {
            wp_set_script_translations(
                $fileSlug,
                'hmb-blocks',
                $langPath
            );
        }

        wp_localize_script(
            $fileSlug,
            'plugin_params',
            [
                'ajax_url' => admin_url('admin-ajax.php'),
            ]
        );

        wp_enqueue_script($fileSlug);
    }
}
add_action('enqueue_block_assets', 'hmb_blocks_enqueue_editor_assets');
