<?php

defined( 'ABSPATH' ) || exit;

if (!class_exists('mishaUpdateChecker')) {

    class mishaUpdateChecker {

        public $plugin_datas;
        public $plugin_slug;
        public $version;
        public $cache_key;
        public $cache_allowed;

        public function __construct() {
            if (!function_exists('get_plugin_data')) {
                require_once ABSPATH . 'wp-admin/includes/plugin.php';
            }

            $this->plugin_datas = get_plugin_data(HMB_BLOCKS_PATH . HMB_BLOCKS_BASE_NAME . '.php');
            $this->plugin_slug = HMB_BLOCKS_BASE_NAME;
            $this->version = $this->plugin_datas['Version'];
            $this->cache_key = 'misha_custom_upd';
            $this->cache_allowed = false;

            add_filter( 'plugins_api', [$this, 'info'], 20, 3 );
            add_filter( 'site_transient_update_plugins', [$this, 'update'] );
            add_action( 'upgrader_process_complete', [$this, 'purge'], 10, 2 );

        }

        public function request() {
            $remote = get_transient( $this->cache_key );

            if ( false === $remote || !$this->cache_allowed ) {

                $remote = wp_remote_get(
                    'https://github.com/MLNOP/holdmyblocks/releases/latest',
                    [
                        'timeout' => 10,
                        'headers' => [
                            'Accept' => 'application/json'
                        ]
                    ]
                );

                if (
                    is_wp_error( $remote )
                    || 200 !== wp_remote_retrieve_response_code( $remote )
                    || empty( wp_remote_retrieve_body( $remote ) )
                ) {
                    return false;
                }

                set_transient( $this->cache_key, $remote, DAY_IN_SECONDS );

            }

            $remote = json_decode( wp_remote_retrieve_body( $remote ) );

            return $remote;

        }

        function info( $res, $action, $args ) {

            // print_r( $action );
            // print_r( $args );

            // do nothing if you're not getting plugin information right now
            if ( 'plugin_information' !== $action ) {
                return $res;
            }

            // do nothing if it is not our plugin
            if ( $this->plugin_slug !== $args->slug ) {
                return $res;
            }

            // get updates
            $remote = $this->request();

            if ( !$remote ) {
                return $res;
            }

            $res = new stdClass();

            $res->name = $remote->name;
            $res->slug = $remote->slug;
            $res->version = $remote->tag_name;
            $res->tested = $remote->tested;
            $res->requires = $remote->requires;
            $res->author = $remote->author;
            $res->author_profile = $remote->author_profile;
            $res->download_link = $remote->download_url;
            $res->trunk = $remote->download_url;
            $res->requires_php = $remote->requires_php;
            $res->last_updated = $remote->last_updated;

            $res->sections = [
                'description' => $remote->sections->description,
                'installation' => $remote->sections->installation,
                'changelog' => $remote->sections->changelog
            ];

            if ( !empty( $remote->banners ) ) {
                $res->banners = [
                    'low' => $remote->banners->low,
                    'high' => $remote->banners->high
                ];
            }

            return $res;

        }

        public function update( $transient ) {

            if ( empty($transient->checked ) ) {
                return $transient;
            }

            $remote = $this->request();

            // TODO : ajouter la vérification des versions de php & de Wordpress
            if (
                $remote
                && version_compare( $this->version, $remote->tag_name, '<' )
                // && version_compare( $remote->requires, get_bloginfo( 'version' ), '<=' )
                // && version_compare( $remote->requires_php, PHP_VERSION, '<' )
            ) {
                $res = new stdClass();
                $res->slug = $this->plugin_slug;
                $res->plugin = $this->plugin_slug;
                $res->new_version = $remote->tag_name;
                // $res->tested = $remote->tested;
                $res->package = $remote->update_url;

                $transient->response[$res->plugin] = $res;
            }

            return $transient;

        }

        public function purge( $upgrader, $options ) {

            if (
                $this->cache_allowed
                && 'update' === $options['action']
                && 'plugin' === $options['type']
            ) {
                // just clean the cache when new plugin version is installed
                delete_transient( $this->cache_key );
            }

        }

    }

    // new mishaUpdateChecker();

}

add_filter( 'site_transient_update_plugins', 'misha_push_update' );

function misha_push_update( $transient ) {

    if ( empty( $transient->checked ) ) {
        return $transient;
    }

    $remote = wp_remote_get(
        'https://github.com/MLNOP/holdmyblocks/releases/latest',
        [
            'timeout' => 10,
            'headers' => [
                'Accept' => 'application/json'
            ]
        ]
    );

    if (
        is_wp_error( $remote )
        || 200 !== wp_remote_retrieve_response_code( $remote )
        || empty( wp_remote_retrieve_body( $remote ) )
    ) {
        return false;
    }

    $remote = json_decode( wp_remote_retrieve_body( $remote ) );

    // your installed plugin version should be on the line below! You can obtain it dynamically of course
    if (
        $remote
        && version_compare( '0.0.1', $remote->tag_name, '<' )
        // && version_compare( $remote->requires, get_bloginfo( 'version' ), '<' )
        // && version_compare( $remote->requires_php, PHP_VERSION, '<' )
    ) {
        $res = new stdClass();
        $res->slug = HMB_BLOCKS_BASE_NAME;
        $res->plugin = HMB_BLOCKS_BASE_NAME . '/' . HMB_BLOCKS_BASE_NAME . '.php'; // it could be just YOUR_PLUGIN_SLUG.php if your plugin doesn't have its own directory
        $res->new_version = $remote->tag_name;
        $res->tested = '6.2';
        $res->package = 'https://github.com' . str_replace('/tag', '/download', $remote->update_url) . '/' . HMB_BLOCKS_BASE_NAME . '.zip';

        $transient->response[$res->plugin] = $res;

        $transient->checked[$res->plugin] = $remote->tag_name;
    }

    return $transient;

}
