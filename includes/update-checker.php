<?php

class mishaUpdateChecker {

    public $plugin_datas;
    public $plugin_slug;
    public $version;
    public $cache_key;
    public $cache_allowed;

    public function __construct() {
        $this->plugin_datas = get_plugin_data(HMB_BLOCKS_PATH . HMB_BLOCKS_BASE_NAME . '.php');
        $this->plugin_slug = HMB_BLOCKS_BASE_NAME;
        $this->version = $this->plugin_datas['Version'];
        $this->cache_key = 'misha_custom_upd';
        $this->cache_allowed = false;

        add_filter('plugins_api', [$this, 'info'], 20, 3);
        add_filter('site_transient_update_plugins', [$this, 'update']);
        add_action('upgrader_process_complete', [$this, 'purge'], 10, 2);
    }

    public function request() {

        $remote = get_transient($this->cache_key);

        if (!$remote || !$this->cache_allowed) {

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
                || 200 !== wp_remote_retrieve_response_code($remote)
                || empty(wp_remote_retrieve_body($remote))
            ) {
                return false;
            }

            set_transient($this->cache_key, $remote, DAY_IN_SECONDS);

        }

        $remote = json_decode(wp_remote_retrieve_body($remote));

        return $remote;

    }

    function info($response, $action, $args) {

        // do nothing if you're not getting plugin information right now
        if ('plugin_information' !== $action) {
            return $response;
        }

        // do nothing if it is not our plugin
        if (empty($args->slug) || $this->plugin_slug !== $args->slug) {
            return $response;
        }

        // get updates
        $remote = $this->request();

        if (!$remote) {
            return $response;
        }

        $response = new stdClass();

        // $response->name = $remote->name;
        $response->slug = HMB_BLOCKS_BASE_NAME;
        $response->version = $remote->tag_name;
        // $response->tested = $remote->tested;
        // $response->requires = $remote->requires;
        // $response->author = $remote->author;
        // $response->author_profile = $remote->author_profile;
        // $response->donate_link = $remote->donate_link;
        // $response->homepage = $remote->homepage;
        $response->download_link = 'https://github.com/MLNOP/holdmyblocks/releases/latest';
        $response->trunk = 'https://github.com/MLNOP/holdmyblocks/releases/latest';
        // $response->requires_php = $remote->requires_php;
        // $response->last_updated = $remote->last_updated;

        // $response->sections = [
        //     'description' => $remote->sections->description,
        //     'installation' => $remote->sections->installation,
        //     'changelog' => $remote->sections->changelog
        // ];

        // if (!empty( $remote->banners)) {
        //     $response->banners = [
        //         'low' => $remote->banners->low,
        //         'high' => $remote->banners->high
        //     ];
        // }

        return $response;

    }

    public function update($transient) {

        if (empty($transient->checked)) {
            return $transient;
        }

        $remote = $this->request();

        // TODO : ajouter la vérification des versions de php & de Wordpress
        if (
            $remote
            && version_compare($this->version, $remote->tag_name, '<')
            // && version_compare($remote->requires, get_bloginfo('version'), '<=')
            // && version_compare($remote->requires_php, PHP_VERSION, '<')
        ) {
            $response = new stdClass();
            $response->slug = $this->plugin_slug;
            $response->plugin = $this->plugin_slug;
            $response->new_version = $remote->tag_name;
            // $response->tested = $remote->tested;
            $response->package = $remote->update_url;

            $transient->response[$response->plugin] = $response;
        }

        return $transient;

    }

    public function purge($upgrader, $options) {

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

new mishaUpdateChecker();
