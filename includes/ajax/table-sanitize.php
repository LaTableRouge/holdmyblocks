<?php

function hmb_blocks_sanitize_table() {
    global $wpdb;

    $response = [];

    $formData = $_POST;

    if (!empty($formData)) {
        // remove les données inutiles
        unset($formData['action']);

        if (isset($formData['blockList'])) {
            // Récupération de la liste des blocks
            $blockList = $formData['blockList'];
            $blockList = unserialize(base64_decode($blockList));

            if (!empty($blockList)) {
                // Compare la liste des blocks actuelle avec celle de la BDD
                $dbblockList = hmb_blocks_get_db_blocks();
                $blockDiff = hmb_blocks_array_diff_assoc_recursive($dbblockList, $blockList);

                if (!empty($blockDiff)) {
                    foreach ($blockDiff as $type => $blocks) {
                        foreach ($blocks as $slug => $block) {
                            if (isset($blockList[$type][$slug])) {
                                // Ajoute dans la BDD le block manquant
                                $dbblockList[$type][$slug] = $blockList[$type][$slug];
                            } else {
                                // Remove dans la BDD le block en trop
                                unset($dbblockList[$type][$slug]);
                            }

                        }
                    }

                    $updateQuery = $wpdb->update(
                        HMB_BLOCKS_TABLE_NAME,
                        [
                            'id' => 1,
                            'blocks' => json_encode($dbblockList)
                        ],
                        ['id' => 1]
                    );

                    if ($updateQuery) {
                        $response = [
                            'status' => 'success',
                            'message' => __('Succès de la mise à jour de la base de données', 'hmb-blocks'),
                            'data' => [
                                'differences' => $blockDiff
                            ]
                        ];
                    } else {
                        $response = [
                            'status' => 'error',
                            'message' => __('Erreur lors de la mise à jour de la base de données', 'hmb-blocks'),
                            'data' => [
                                'differences' => $blockDiff
                            ]
                        ];
                    }
                } else {
                    $response = [
                        'status' => 'info',
                        'message' => __('Aucun changement n\'a été effectué', 'hmb-blocks')
                    ];
                }
            }
        }

    }else {
        $response = [
            'status' => 'error',
            'message' => __('Données manquantes', 'hmb-blocks')
        ];
    }

    echo json_encode($response);

    die();
}
add_action('wp_ajax_hmb_blocks_sanitize_table', 'hmb_blocks_sanitize_table');
