<?php

/**
 * Block Name: cloud-tags
 *
 * This is the template that displays a cloud of tags.
 *
 * Params (ACF V6.2.1) :
 *  $block (array) The block settings and attributes.
 *  $content (string) The block inner HTML (empty).
 *  $is_preview (boolean) True during backend preview render.
 *  $post_id (integer) The post ID the block is rendering content against. This is either the post ID currently being displayed inside a query loop, or the post ID of the post hosting this block.
 *  $context (array) The context provided to the block by the post or its parent block.
 */

// Récupère les attributs du thème.json et/ou de gutenberg
$classes = hmb_blocks_get_block_class($block);
$stylesVariables = hmb_blocks_get_block_style_variables($block, 'cloud-tags');

$list = get_field('tags-list');

if (!empty($list)) { ?>
    <section
        <?php echo !empty($block['anchor']) ? 'id="' . $block['anchor'] . '"' : ''; ?>
        class="block---cloud-tags <?php echo $classes; ?>"
        style="<?php echo $stylesVariables; ?>"
    >
        <?php foreach ($list as $key => $tag) {
            $title = $tag['title'];
            $level = $tag['level'];
        ?>
            <article
                class="cloud-tags__element"
                style="--level:<?php echo $level; ?>"
            >
                <span class="element__title"><?php echo $title; ?></span>
            </article>
        <?php } ?>
    </section>
<?php } ?>
