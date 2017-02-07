<?php
/**
 * Created by PhpStorm.
 * User: Wujibing
 * Date: 2016/12/20
 * Time: 11:40
 */
$esHosts = [
    'http://localhost:9200',
];
include './vendor/autoload.php';
//ini_set('display_errors','on');
$client = Elasticsearch\ClientBuilder::create()->setHosts($esHosts)->build();
function getSearchResult($callback)
{
    global $client;

   //echo json_encode($callback($client)['body']);exit;
    return $client->search($callback($client));
}


function getSuggestResult($callback)
{
    global $client;
    return $client->suggest($callback($client));
}

function resultToGoods($result)
{
    $goods = [];
    if(isset($result['hits']) && isset($result['hits']['hits']) && $result['hits']['hits'])
    {
        foreach ($result['hits']['hits'] as $v)
        {
            $t = $v['_source'];
            $t['goods_id'] = $t['id'];
            $t['shop_price']       = price_format($t['shop_price']);
            $t['promote_price']    = ($t['promote_price'] > 0) ? price_format($t['promote_price']) : '';
            $t['goods_thumb']      = get_image_path($t['id'], $t['goods_thumb'], true);
            $t['url']              = $t['collect_link'];
            $goods[] = $t;
        }
    }
    return $goods;
}