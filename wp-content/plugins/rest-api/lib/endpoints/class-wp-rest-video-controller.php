<?php

class WP_REST_Video_Controller extends WP_REST_Controller
{

    public function __construct()
    {
        $this->namespace = 'wp/v2';
        $this->rest_base = 'channel';
//        $this->meta = new WP_REST_User_Meta_Fields();
    }

    public function register_routes()
    {
        register_rest_route($this->namespace, '/' . $this->rest_base, array(
            register_rest_route($this->namespace, '/' . $this->rest_base, array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'list_chanel'),
                    'permission_callback' => array($this, 'get_items_permissions_check'),
                    'args' => $this->get_collection_params(),
                ),
                'schema' => array($this, 'get_public_item_schema'),
            )),
            register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<id>[\w-]+)', array(
                array(
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => array($this, 'list_video'),
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
    function list_chanel()
    {
        return get_option('yrc_keys');
    }

    public function list_video($request)
    {
        $limit = $request['limit'] ? $request['limit'] : 10;;
        $data = get_option($request['id']);
        $pageToken = $request['pageToken'];
        $base_url = "https://www.googleapis.com/youtube/v3/search?&part=snippet,id&order=date&maxResults=$limit";
        $api_key = $data['meta']['apikey'];
        $chanel_id = $data['meta']['channel'];
        $url = "$base_url&channelId=$chanel_id&key=$api_key&pageToken=$pageToken";
        return json_decode(file_get_contents($url));
    }

    function fetchUrl($uri)
    {
        $handle = curl_init();

        curl_setopt($handle, CURLOPT_URL, $uri);
        curl_setopt($handle, CURLOPT_POST, false);
        curl_setopt($handle, CURLOPT_BINARYTRANSFER, false);
        curl_setopt($handle, CURLOPT_HEADER, true);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 10);

        $response = curl_exec($handle);
        $hlength = curl_getinfo($handle, CURLINFO_HEADER_SIZE);
        $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
        $body = substr($response, $hlength);

        // If HTTP response is not 200, throw exception
        if ($httpCode != 200) {
            throw new Exception($httpCode);
        }

        return $body;
    }

    public function get_items_permissions_check()
    {
        return true;
    }
}
