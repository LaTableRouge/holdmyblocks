<?php

function hmb_blocks_category($categories, $post) {
    $category_slugs = wp_list_pluck($categories, 'slug');

    return in_array('hmb-blocks', $category_slugs, true) ? $categories : array_merge(
        [
            [
                'slug' => 'hmb-blocks',
                'title' => __('Hold my blocks - Blocs', 'hmb-blocks'),
                'icon' => null, // Pour la gestion de l'icone de la catégorie voir editor.js
            ],
        ],
        $categories
    );
}
add_filter('block_categories_all', 'hmb_blocks_category', 10, 2);
