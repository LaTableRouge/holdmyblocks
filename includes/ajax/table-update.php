<?php

function hmb_blocks_update_table() {
    global $wpdb;

    $response = [];

    $formData = $_POST;

    if (!empty($formData)) {
        // remove les données inutiles
        unset($formData['action']);

        // Récupère la config des blocks en BDD
        $blocks = hmb_blocks_boolify($formData);

        // Récupère les changements effectués
        $checkBlocks = hmb_blocks_get_db_blocks();
        $changes = hmb_blocks_array_diff_assoc_recursive($checkBlocks, $blocks);

        // Met à jour la BDD
        if (!empty($changes)) {
            $updateQuery = $wpdb->update(
                HMB_BLOCKS_TABLE_NAME,
                [
                    'id' => 1,
                    'blocks' => json_encode($blocks)
                ],
                ['id' => 1]
            );

            if ($updateQuery) {
                $response = [
                    'status' => 'success',
                    'message' => __('Changements enregistrés', 'hmb-blocks'),
                    'data' => [
                        'changes' => $changes
                    ]
                ];
            } else {
                $response = [
                    'status' => 'error',
                    'message' => __("Erreur lors de l'enregistrement des changements", 'hmb-blocks'),
                    'data' => [
                        'changes' => $changes
                    ]
                ];
            }
        } else {
            $response = [
                'status' => 'info',
                'message' => __('Aucun changement n\'a été effectué', 'hmb-blocks')
            ];
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
add_action('wp_ajax_hmb_blocks_update_table', 'hmb_blocks_update_table');
