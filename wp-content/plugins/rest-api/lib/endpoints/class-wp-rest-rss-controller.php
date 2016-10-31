<?php

class WP_REST_RSS_Controller extends WP_REST_Controller
{

    public function __construct()
    {
        $this->namespace = 'wp/v2';
        $this->rest_base = 'rss';
//        $this->meta = new WP_REST_User_Meta_Fields();
    }

    public function register_routes()
    {
        register_rest_route($this->namespace, '/' . $this->rest_base, array(
            register_rest_route($this->namespace, '/' . $this->rest_base, array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'list_rss'),
                    'permission_callback' => array($this, 'get_items_permissions_check'),
                    'args' => $this->get_collection_params(),
                ),
                'schema' => array($this, 'get_public_item_schema'),
            )),
            register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<id>[\w-]+)', array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'list_news'),
                    'permission_callback' => array($this, 'get_items_permissions_check'),
                    'args' => $this->get_collection_params(),
                ),
                'schema' => array($this, 'get_public_item_schema'),
            ))
        ));
    }


    /**
     * Grab latest post title by an author!
     *
     * @return string|null Post title for the latest,
     * or null if none.
     */
    function list_rss()
    {
        $rss = get_option('rss_antenna_options');
        $url = $this->getFeedArray($rss['feeds']);
        return $url;
    }

    public function list_news($request)
    {
        $id = $request['id'];
        $info = new RssInfo('rss_antenna_options', $id);
        return $info;
    }


    public function get_items_permissions_check()
    {
        return true;
    }

    private function getFeedArray($text)
    {
        $array = explode("\n", $text);
        foreach ($array as $key => $val) {
            if (substr($val, 0, 1) == '#') {
                unset($array[$key]);
            }
        }
        $array = array_map('trim', $array);
        $array = array_filter($array, 'strlen');
        return ($array);
    }
}
