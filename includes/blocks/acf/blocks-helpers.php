<?php

/**
 * Traduit les strings de variables
 *
 * from : var:preset|spacing|8
 * to : var(--wp--preset--spacing--8)
 *
 */
if (!function_exists('convert_custom_properties')) {
    function convert_custom_properties($value) {
        $prefix = 'var:';
        $prefix_len = strlen($prefix);
        $token_in = '|';
        $token_out = '--';
        if (str_starts_with($value, $prefix)) {
            $unwrapped_name = str_replace(
                $token_in,
                $token_out,
                substr($value, $prefix_len)
            );
            $value = "var(--wp--{$unwrapped_name})";
        }

        return $value;
    }
}

/**
 * Retourne le style en variables css
 *
 * Mise en commun
 *  des presets du theme.json/variation.json
 *  de la configuration back-office
 *
 */
function hmb_blocks_get_block_style_variables($block, $block_slug) {
    $attrs = [];

    $themeJSONDatas = wp_get_global_styles(
        [],
        [
            'block_name' => $block['name'],
            'origin' => 'all',
        ]
    );

    if (!empty($themeJSONDatas)) {
        if (isset($themeJSONDatas['spacing'])) {
            $spacing = $themeJSONDatas['spacing'];

            if (isset($spacing['margin'])) {
                $margins = $spacing['margin'];
                if (!empty($margins)) {
                    foreach ($margins as $key => $margin) {
                        $attrs["--acfblock--{$block_slug}--margin-{$key}"] = $margin;
                    }
                }
            }

            if (isset($spacing['padding'])) {
                $paddings = $spacing['padding'];
                if (!empty($paddings)) {
                    foreach ($paddings as $key => $padding) {
                        $attrs["--acfblock--{$block_slug}--padding-{$key}"] = $padding;
                    }
                }
            }
        }

        if (isset($themeJSONDatas['color'])) {
            $colors = $themeJSONDatas['color'];
            if (!empty($colors)) {
                foreach ($colors as $key => $color) {
                    if ($key === 'text') {
                        $attrs["--acfblock--{$block_slug}--color"] = $color;
                    }
                    if ($key === 'background') {
                        $attrs["--acfblock--{$block_slug}--background-color"] = $color;
                    }
                }
            }
        }
    }

    // Récupère le style du block édité en Back-office
    if (isset($block['textColor'])) {
        $color = $block['textColor'];
        $attrs["--acfblock--{$block_slug}--text-color"] = "var(--wp--preset--color--{$color})";
    }

    if (isset($block['backgroundColor'])) {
        $color = $block['backgroundColor'];
        $attrs["--acfblock--{$block_slug}--background-color"] = "var(--wp--preset--color--{$color})";
    }

    if (isset($block['style'])) {
        $style = $block['style'];

        if (isset($style['spacing'])) {
            $spacing = $style['spacing'];

            if (isset($spacing['margin'])) {
                $margins = $spacing['margin'];
                if (!empty($margins)) {
                    foreach ($margins as $key => $margin) {
                        $attrs["--acfblock--{$block_slug}--margin-{$key}"] = convert_custom_properties($margin);
                    }
                }
            }

            if (isset($spacing['padding'])) {
                $paddings = $spacing['padding'];
                if (!empty($paddings)) {
                    foreach ($paddings as $key => $padding) {
                        $attrs["--acfblock--{$block_slug}--padding-{$key}"] = convert_custom_properties($padding);
                    }
                }
            }
        }

        if (isset($style['color'])) {
            $colors = $style['color'];
            if (!empty($colors)) {
                foreach ($colors as $key => $color) {
                    if ($key === 'text') {
                        $attrs["--acfblock--{$block_slug}--color"] = convert_custom_properties($color);
                    }
                    if ($key === 'background') {
                        $attrs["--acfblock--{$block_slug}--background-color"] = convert_custom_properties($color);
                    }
                }
            }
        }
    }

    $attrsTemp = [];
    if (!empty($attrs)) {
        foreach ($attrs as $key => $value) {
            $attrsTemp[] = "{$key}:{$value}";
        }

        return implode(';', $attrsTemp);
    }
}

/**
 * Retourne le style en inline des propriétés du block
 *
 * Mise en commun
 *  des presets du theme.json/variation.json
 *  de la configuration back-office
 *
 */
function hmb_blocks_get_block_style_inline($block) {
    $attrs = [];

    $themeJSONDatas = wp_get_global_styles(
        [],
        [
            'block_name' => $block['name'],
            'origin' => 'all',
        ]
    );

    if (!empty($themeJSONDatas)) {
        if (isset($themeJSONDatas['spacing'])) {
            $spacing = $themeJSONDatas['spacing'];

            if (isset($spacing['margin'])) {
                $margins = $spacing['margin'];
                if (!empty($margins)) {
                    foreach ($margins as $key => $margin) {
                        $attrs["margin-{$key}"] = $margin;
                    }
                }
            }

            if (isset($spacing['padding'])) {
                $paddings = $spacing['padding'];
                if (!empty($paddings)) {
                    foreach ($paddings as $key => $padding) {
                        $attrs["padding-{$key}"] = $padding;
                    }
                }
            }
        }

        if (isset($themeJSONDatas['color'])) {
            $colors = $themeJSONDatas['color'];
            if (!empty($colors)) {
                foreach ($colors as $key => $color) {
                    if ($key === 'text') {
                        $attrs['color'] = $color;
                    }
                    if ($key === 'background') {
                        $attrs['background-color'] = $color;
                    }
                }
            }
        }
    }

    if (isset($block['textColor'])) {
        $color = $block['textColor'];
        $attrs['color'] = "var(--wp--preset--color--{$color})";
    }

    if (isset($block['backgroundColor'])) {
        $color = $block['backgroundColor'];
        $attrs['background-color'] = "var(--wp--preset--color--{$color})";
    }

    if (isset($block['style'])) {
        $style = $block['style'];

        if (isset($style['spacing'])) {
            $spacing = $style['spacing'];

            if (isset($spacing['margin'])) {
                $margins = $spacing['margin'];
                if (!empty($margins)) {
                    foreach ($margins as $key => $margin) {
                        $attrs["margin-{$key}"] = convert_custom_properties($margin);
                    }
                }
            }

            if (isset($spacing['padding'])) {
                $paddings = $spacing['padding'];
                if (!empty($paddings)) {
                    foreach ($paddings as $key => $padding) {
                        $attrs["padding-{$key}"] = convert_custom_properties($padding);
                    }
                }
            }
        }

        if (isset($style['color'])) {
            $colors = $style['color'];
            if (!empty($colors)) {
                foreach ($colors as $key => $color) {
                    if ($key === 'text') {
                        $attrs['color'] = convert_custom_properties($color);
                    }
                    if ($key === 'background') {
                        $attrs['background-color'] = convert_custom_properties($color);
                    }
                }
            }
        }
    }

    $attrsTemp = [];
    if (!empty($attrs)) {
        foreach ($attrs as $key => $value) {
            $attrsTemp[] = "{$key}:{$value}";
        }

        return implode(';', $attrsTemp);
    }
}

/**
 * Récupère les classes du block (réglages back-office)
 */
function hmb_blocks_get_block_class($block) {
    $classes = [];

    if (isset($block['align'])) {
        $align = $block['align'];
        $classes[] = "align{$align}";
    }

    if (isset($block['className'])) {
        $classes[] = $block['className'];
    }

    if (!empty($classes)) {
        $classes = implode(' ', $classes);
    }

    return $classes;
}
