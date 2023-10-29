<article class="wrap hmb-blocks">
    <header class="hmb-blocks__header">
        <div class="img-wrapper">
            <img src="<?php echo HMB_BLOCKS_URL . '/build/img/bg.webp'; ?>" alt="background picture">
        </div>
        <div class="text-wrapper">
            <h1><?php _e('Hold my blocks blocs configuration', 'hmb-blocks'); ?></h1>
        </div>
    </header>

    <hr class="wp-header-end">

    <section class="hmb-blocks__search">
        <form class="search-form" id="hmb-blocks__search-form">
            <input
                class="search-form__search-input"
                type="search"
                name="search-blocks"
                placeholder="<?php _e('Rechercher...', 'hmb-blocks') ?>"
            >

            <fieldset class="search-form__filters">
                <input
                    type="checkbox"
                    name="acf"
                    class="filters__filter filters__filter--acf"
                >

                <input
                    type="checkbox"
                    name="react"
                    class="filters__filter filters__filter--react"
                >
            </fieldset>

            <button type="submit">
                <span class="icon-search"></span>
            </button>
        </form>
    </section>

    <?php
    // Check si la liste des blocks est bien la même que celle enregistrée en BDD
    $dbblockList = hmb_blocks_get_db_blocks();

    $acfBlockList = array_map(function ($v) {if (is_array($v) || is_object($v)) {return "";}return $v;}, $blockList['acf']);
    $acfDBBlockList = array_map(function ($v) {if (is_array($v) || is_object($v)) {return "";}return $v;}, $dbblockList['acf']);
    $acfBlockDiff = hmb_blocks_array_diff_assoc_recursive($acfDBBlockList, $acfBlockList);

    $reactBlockList = array_map(function ($v) {if (is_array($v) || is_object($v)) {return "";}return $v;}, $blockList['react']);
    $reactDBBlockList = array_map(function ($v) {if (is_array($v) || is_object($v)) {return "";}return $v;}, $dbblockList['react']);
    $reactBlockDiff = hmb_blocks_array_diff_assoc_recursive($reactDBBlockList, $reactBlockList);

    $blockDiff = array_merge($acfBlockDiff, $reactBlockDiff);
    ?>

    <?php if(!empty($blockDiff)) { ?>
        <div class="notice notice-error">
            <form id="hmb-blocks__db-sanitize-form">
                <p><strong><?php _e('Mise à jour de la base de données', 'hmb-blocks'); ?></strong></p>
                <p><?php _e("Veuillez mettre à jour la base de données afin d'activer/désactiver les blocs.", 'hmb-blocks'); ?></p>
                <input
                    type="hidden"
                    name="blockList"
                    value='<?php echo base64_encode(serialize($blockList)); ?>'
                >
                <button type="submit" class="button-primary"><?php _e('Mettre à jour', 'hmb-blocks'); ?></button>
                <p></p>
            </form>
        </div>
    <?php } ?>

    <?php if (!class_exists('acf_pro')) { ?>
        <div class="notice notice-info is-dismissible">
            <p><strong><?php _e('Ce plugin nécéssite ACF Pro pour fonctionner pleinement.', 'hmb-blocks'); ?></strong></p>
            <p><?php _e("Veuillez installer ACF Pro afin de profiter de l'intégralité de la bibliothèque de blocs.", 'hmb-blocks'); ?></p>
            <p></p>
        </div>
    <?php } ?>

    <form
        id="hmb-blocks__settings-form"
        class="hmb-blocks__form"
        <?php echo !empty($blockDiff) ? 'data-disabled' : ''; ?>
    >
        <?php
            foreach ($dbblockList as $type => $blocks) {
                if(!empty($blocks)) {
                    foreach ($blocks as $slug => $block) {
                        if ($type === 'acf') {
                            $jsonPath = HMB_BLOCKS_ACF_PATH . "/{$slug}/block.json";
                        }else if($type === 'react'){
                            $jsonPath = HMB_BLOCKS_REACT_PATH . "/{$slug}/block.json";
                        }

                        if (file_exists($jsonPath)) {
                            $jsonString = file_get_contents($jsonPath);
                            $jsonData = json_decode($jsonString, true);

                            // TODO : trouver une solution pour récupérer les string traduites des json
                            $name = $jsonData['name'];
                            $title = $jsonData['title'];
                            $description = $jsonData['description'];
                            $keywords = $jsonData['keywords'];

                            $keywordsArray = [strtolower($title), ...$keywords];

                            $supportsArray = [];
                            if (!empty(isset($block['supports']))) {
                                $supportsArray = $block['supports'];
                            }
                            ?>
                                <div
                                    class="block-card block-card--<?php echo $type; ?>"
                                    data-type="<?php echo $type; ?>"
                                    data-keywords='<?php echo htmlspecialchars(json_encode($keywordsArray), ENT_QUOTES, 'UTF-8');; ?>'
                                >
                                    <label
                                        for="<?php echo $name; ?>"
                                        class="block-card__title"
                                    >
                                        <?php echo $title; ?>
                                    </label>

                                    <p class="block-card__desc"><?php echo $description; ?></p>

                                    <fieldset>
                                        <input
                                            type="hidden"
                                            value="false"
                                            name="<?php echo $type . '['. $slug . '][enabled]'; ?>"
                                        >
                                        <input
                                            type="checkbox"
                                            name="<?php echo $type . '['. $slug . '][enabled]'; ?>"
                                            id="<?php echo $name; ?>"
                                            class="toggle block-card__main-input"
                                            value="true"
                                            <?php echo hmb_blocks_get_enabled_status($type, $slug) ? 'checked' : '';  ?>
                                        >
                                    </fieldset>

                                    <?php if(!empty($supportsArray)) { ?>
                                        <details class="block-card__advanced-config">
                                            <summary><?php _e('Configuration avancée', 'hmb-blocks'); ?></summary>
                                            <fieldset>
                                                <?php echo hmb_blocks_make_input_list($supportsArray, $type, $slug); ?>
                                            </fieldset>
                                        </details>
                                    <?php } ?>
                                </div>
                            <?php
                        } else {
                            _e("Les informations du bloc n'ont pas pu être récupérées, veuillez build vos blocs", 'hmb-blocks');
                            break;
                        }
                    }
                }
            }
        ?>
    </form>
</article>


