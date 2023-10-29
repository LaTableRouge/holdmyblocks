<?php

function hmb_blocks_register_react_blocks() {
    /**
     * Registers the blocks using the metadata loaded from the `block.json` files.
     * Behind the scenes, it registers also all assets so they can be enqueued
     * through the block editor in the corresponding context.
     *
     * @see https://developer.wordpress.org/reference/functions/register_block_type/
     */

    $blocks = hmb_blocks_get_db_blocks();

    if (!empty($blocks['react'])) {
        foreach ($blocks['react'] as $slug => $block) {
            if ($block['enabled']) {

                $jsonPath = HMB_BLOCKS_REACT_PATH . "/{$slug}/block.json";

                if (file_exists($jsonPath)) {
                    register_block_type($jsonPath);

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
                        }
                    }
                }
            }
        }
    }
}
add_action('init', 'hmb_blocks_register_react_blocks');
