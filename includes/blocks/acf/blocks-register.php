<?php

function hmb_blocks_register_acf_blocks() {
    if (!function_exists('acf_register_block_type') && !function_exists('acf_add_local_field_group')) {
        return;
    }

    /**
     * Registers the blocks using the metadata loaded from the `block.json` files.
     * Behind the scenes, it registers also all assets so they can be enqueued
     * through the block editor in the corresponding context.
     *
     * @see https://developer.wordpress.org/reference/functions/register_block_type/
     */

    $blocks = hmb_blocks_get_db_blocks();

    if (!empty($blocks['acf'])) {
        foreach ($blocks['acf'] as $slug => $block) {
            if ($block['enabled']) {
                // Register les champs acf associé au block
                $fieldsPath = HMB_BLOCKS_ACF_PATH . "/{$slug}/includes/fields.php";
                if (file_exists($fieldsPath)) {
                    require $fieldsPath;
                }

                $jsonPath = HMB_BLOCKS_ACF_PATH . "/{$slug}/block.json";
                if (file_exists($jsonPath)) {
                    // Register le block
                    if (!empty(isset($block['supports']))) {
                        register_block_type(
                            $jsonPath,
                            [
                                'supports' => $block['supports']
                            ]
                        );
                    }else {
                        register_block_type($jsonPath);
                    }

                    $json = json_decode(file_get_contents($jsonPath), true);

                    // Création d'un array avec les handles des scripts editor & view
                    $scriptEditorHandle = generate_block_asset_handle($json['name'], 'editorScript');
                    $scriptHandle = generate_block_asset_handle($json['name'], 'viewScript');
                    $handles = [];
                    if (is_array($scriptEditorHandle)) {
                        array_merge($handles, $scriptEditorHandle);
                    } else {
                        $handles[] = $scriptEditorHandle;
                    }
                    if (is_array($scriptHandle)) {
                        array_merge($handles, $scriptHandle);
                    } else {
                        $handles[] = $scriptHandle;
                    }

                    if (!empty($handles)) {
                        foreach ($handles as $handle) {
                            // Pass les traductions au script du block via la clé
                            $langPath = HMB_BLOCKS_PATH . 'lang';
                            if (file_exists($langPath)) {
                                wp_set_script_translations(
                                    $handle,
                                    'hmb-blocks',
                                    $langPath
                                );
                            }

                            // Pass les paramètres utiles au block via la clé
                            wp_localize_script(
                                $handle,
                                'block_params',
                                [
                                    'ajax_url' => admin_url('admin-ajax.php'),
                                    'rest_url' => esc_url_raw(get_rest_url(null, '/wp/v2')),
                                    'rest_nonce' => wp_create_nonce('wp_rest'),
                                    'posts_per_page' => get_option('posts_per_page'),
                                ]
                            );
                        }
                    }
                }
            }
        }
    }
}
add_action('acf/init', 'hmb_blocks_register_acf_blocks');
