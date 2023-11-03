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

            <button type="submit">
                <span class="icon-search"></span>
            </button>
        </form>
    </section>

    <?php
    // Check si la liste des blocks est bien la même que celle enregistrée en BDD
    $dbblockList = hmb_blocks_get_db_blocks();

    $blockList = [];
    $blockList['react'] = array_diff(scandir(HMB_BLOCKS_REACT_PATH), ['.', '..']);
    $blockList['react'] = array_values($blockList['react']);
    ?>

    <form
        id="hmb-blocks__settings-form"
        class="hmb-blocks__form"
    >
        <?php
            foreach ($blockList as $type => $blocks) {
                if(!empty($blocks)) {
                    foreach ($blocks as $slug) {
                        $jsonPath = HMB_BLOCKS_REACT_PATH . "/{$slug}/block.json";

                        if (file_exists($jsonPath)) {
                            $jsonString = file_get_contents($jsonPath);
                            $jsonData = json_decode($jsonString, true);

                            // TODO : trouver une solution pour récupérer les string traduites des json
                            $name = $jsonData['name'];
                            $title = $jsonData['title'];
                            $description = $jsonData['description'];
                            $keywords = $jsonData['keywords'];

                            $keywordsArray = [strtolower($title), ...$keywords];
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


