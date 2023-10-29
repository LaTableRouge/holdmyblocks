<?php

function hmb_blocks_array_diff_assoc_recursive($array1, $array2) {
    $result = [];

    foreach ($array1 as $key => $val) {
        if (is_array($val) && isset($array2[$key])) {
            $tmp = hmb_blocks_array_diff_assoc_recursive($val, $array2[$key]);
            if ($tmp) {
                $result[$key] = $tmp;
            }
        }
        elseif (!isset($array2[$key])) {
            $result[$key] = null;
        }
        elseif ($val !== $array2[$key]) {
            $result[$key] = $array2[$key];
        }

        if (isset($array2[$key])) {
            unset($array2[$key]);
        }
    }

    $result = array_merge($result, $array2);

    return $result;
}

function hmb_blocks_get_db_blocks() {
    global $wpdb;

    $blocks = $wpdb->get_results('SELECT * FROM ' . HMB_BLOCKS_TABLE_NAME);
    if (isset($blocks) && count($blocks) !== 0) {
        $blocksArray = json_decode($blocks[0]->blocks, true);

        return $blocksArray;
    }
}

function hmb_blocks_get_enabled_status($scope, $slug) {
    $blocks = hmb_blocks_get_db_blocks();

    if (!empty($blocks)) {
        return $blocks[$scope][$slug]['enabled'];
    }
}

function hmb_blocks_boolify($arr) {
    foreach ($arr as $key => $val) {
        if (is_array($val)) {
            $arr[$key] = hmb_blocks_boolify($val);
        } else {
            if ($val == 'true') {
                $arr[$key] = true;
            } elseif ($val == 'false') {
                $arr[$key] = false;
            }
        }
    }

    return $arr;
}

function hmb_blocks_make_input_list($array, $type, $slug, $inheritedName = false) {
    // TODO : trouver une solution pour récupérer les string traduites des labels
    $return = '<ul>';

    foreach ($array as $key => $value) {
        $isArray = is_array($value);

        $return .= $isArray ? '<li class="has-child">' : '<li>';
        $return .= '<label for="' . $key . '">' . $key . '</label>';

        if ($isArray) {
            $name = "{$type}[{$slug}][supports][{$key}]";
            $return .= hmb_blocks_make_input_list($value, $type, $slug, $name);
        } else {
            $checked = $value ? 'checked' : '';
            $name = !$inheritedName ? "{$type}[{$slug}][supports][{$key}]" : "{$inheritedName}[{$key}]";

            $return .= '<input type="hidden" value="false" name="' . $name . '">';
            $return .= '<input type="checkbox" class="toggle" value="true" name="' . $name . '" id="' . $key . '"' . $checked . '>';
        }

        $return .= '</li>';
    }

    $return .= '</ul>';

    return $return;
}
