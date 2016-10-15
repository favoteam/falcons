<?php

/**
 * ECSHOP 专题前台
 * ============================================================================
 * 版权所有 2005-2011 上海商派网络科技有限公司，并保留所有权利。
 * 网站地址: http://www.ecshop.com；
 * ----------------------------------------------------------------------------
 * 这不是一个自由软件！您只能在不用于商业目的的前提下对程序代码进行修改和
 * 使用；不允许对程序代码以任何形式任何目的的再发布。
 * ============================================================================
 * @author:     webboy <laupeng@163.com>
 * @version:    v2.1
 * ---------------------------------------------
 */

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');
require(dirname(__FILE__) . '/includes/lib_order.php');

if ((DEBUG_MODE & 2) != 2)
{
    $smarty->caching = true;
}

$tpl = 'brands_list.dwt';

$cache_id = sprintf('%X', crc32($cat_id . '-' . $display . '-' . $sort  .'-' . $order  .'-' . $page . '-' . $size . '-' . $_SESSION['user_rank'] . '-' .
	    $_CFG['lang'] .'-'. $brand. '-' . $price_max . '-' .$price_min . '-' . $filter_attr_str . '-' . $filter));

$filter['id']               = empty($_REQUEST['id']) ? 0 : intval($_REQUEST['id']);
$filter['keywords']         = isset($_REQUEST['keywords']) ? trim(addslashes(htmlspecialchars($_REQUEST['keywords']))) : '';
$filter['sort_by']          = empty($_REQUEST['sort_by']) ? 'sort_order' : trim($_REQUEST['sort_by']);
$filter['sort_order']       = empty($_REQUEST['sort_order']) ? 'ASC' : trim($_REQUEST['sort_order']);
$filter['page'] = empty($_REQUEST['page']) || (intval($_REQUEST['page']) <= 0) ? 1 : intval($_REQUEST['page']);

if (isset($_REQUEST['page_size']) && intval($_REQUEST['page_size']) > 0)
{
	$filter['page_size'] = intval($_REQUEST['page_size']);
}elseif (isset($_COOKIE['ECSCP']['page_size']) && intval($_COOKIE['ECSCP']['page_size']) > 0)
{
	$filter['page_size'] = intval($_COOKIE['ECSCP']['page_size']);
}else{
	$filter['page_size'] = 10;
}
$filter['start']       = ($filter['page'] - 1) * $filter['page_size'];

$cache_id = sprintf('%X', crc32(date('ymd' . '-' . $filter)));

if (!$smarty->is_cached($tpl, $cache_id))
{ 
	//品牌分类
	$cats = get_all_category();
	
	
	//品牌列表
	$shop_list = get_all_supplier($filter);
	
	
	//推荐分类中的品牌
	$tuijian = get_tuijian_shop($cats['tuijian']);
	
	
    /* 模板赋值 */
    assign_template();
    $position = assign_ur_here();
    $smarty->assign('page_title',       $position['title']);       // 页面标题
    $smarty->assign('ur_here',          $position['ur_here'] . '> ' . $topic['title']);     // 当前位置
    $smarty->assign('helps',            get_shop_help()); // 网店帮助
    $smarty->assign('all',   	$cats['all']);
    $smarty->assign('tuijian',       $tuijian);
    
    $smarty->assign('logopath',		'/'.DATA_DIR.'/supplier/logo/');
    $smarty->assign('shops_list',   $shop_list['shops']);
    $smarty->assign('filter',       $shop_list['filter']);
	
    $filter = $shop_list['filter'];
	
    $page = $filter['page'];
	$cid = $filter['id'];
	$count = $filter['record_count'];
	$size = $filter['page_size'];
	$sort = $filter['sort_by'];
	$order = $filter['sort_order'];
	//var_dump($filter); exit;
	assign_pager('brand_cat',   $cid, $count, $size, $sort, $order, $page, ''); // 分页
	assign_dynamic('brands');
}
/* 显示模板 */
$smarty->display($tpl, $cache_id);

/**
 * 获取所有品牌分类
 */
function get_all_category(){
	$sql = "select * from ".$GLOBALS['ecs']->table('brands_category')." where is_show=1 order by sort_order";
	$all = $GLOBALS['db']->getAll($sql);
	$ret1 = $ret = array();
	foreach($all as $key => $val){
		$val['url'] = build_uri('brands', array('cid'=>$val['cat_id']), $val['cat_name']);
		if($val['is_groom']>0){
			$ret[$val['cat_id']] = $val;
		}
		$ret1[$val['cat_id']] = $val;
	}
	return array('all'=>$ret1,'tuijian'=>$ret);
}

/*
 * 获取推荐类中相关品牌
 * @param array $tuijian 分类信息
 */
function get_tuijian_shop($tuijian){
	$keys = array_keys($tuijian);
	$types = implode(',',$keys);
	if(empty($types)){
		return array();
	}
	$sql = "select * from ".$GLOBALS['ecs']->table('supplier_street')." where supplier_type in($types) and is_groom=1 and status=1 order by sort_order";
	$all = $GLOBALS['db']->getAll($sql);
	foreach($all as $k => $v){
		
		
		$tuijian[$v['supplier_type']]['shoplist'][$v['supplier_id']] = $v;
	}
	return $tuijian;
}

/**
 * 获取品牌品牌街中的品牌
 */
function get_all_supplier($filter){
	global $tpl;
	
	$is_search = 0;//是否是搜索过来的
	
	$where = " where  is_show=1 ";
    if($filter['id']){
        $where .= ' and brand_cat='.$filter['id'];
    }
	
	/* 记录总数 */
     $sql = "SELECT COUNT(*) FROM " .$GLOBALS['ecs']->table('brand'). " $where";
     $filter['record_count'] = $GLOBALS['db']->getOne($sql);
     $filter['page_count']     = $filter['record_count'] > 0 ? ceil($filter['record_count'] / $filter['page_size']) : 1;
	
	$sql = "SELECT * ".
	           " FROM " . $GLOBALS['ecs']->table('brand').
	           " $where" .
	           /*" ORDER BY $filter[sort_by] $filter[sort_order] ".*/
			   " ORDER BY rand() ".
	           " LIMIT " . $filter['start'] . ",$filter[page_size]";
	$arr = $GLOBALS['db']->getAll($sql);
	foreach($arr as $key=>$val){
		$arr[$key]['url'] = build_uri('brand', array('bid'=>$val['brand_id']), $val['brand_name']);
		$arr[$key]['address'] = "";//地址
		//所在地
		$arr[$key]['brand_name'] = trim($arr[$key]['brand_name'],',');
		//品牌中有多少商品
		$goodsInfo = get_street_goods_info($val['brand_id'],$val['rand_date'],$val['rand_ids']);
		$arr[$key]['goods_number'] = $goodsInfo['num'];
		$arr[$key]['goods_info'] = $goodsInfo['info'];
	}
    return array('shops' => $arr, 'filter' => $filter, 'page_count' => $filter['page_count'], 'record_count' => $filter['record_count']);
}

function get_street_goods_info($brand_id,$rand_date='',$rand_ids=''){
	
	
	global $db,$ecs;
	//处理当前时间
	$now = gmtime();
	$now_time = local_date('Y-m-d H:i:s', $now);//当天日期
	$now_time1 = local_date('Y-m-d', $now);//当天日期
	
	$goods_ids = array();
	if($now_time1==$rand_date && !empty($rand_ids))
	{
		$goods_ids = explode(',',$rand_ids);
	}
	else
	{
		/*$sql = "SELECT g.goods_id FROM ".$ecs->table('goods')." AS g WHERE g.is_on_sale = 1 AND g.is_alone_sale = 1 AND g.is_delete = 0  and is_best=1 AND g.brand_id=".$brand_id." order by g.goods_id desc";
		$all = $db->getAll($sql);
		
		if(!empty($all))
		{
			$sql = "SELECT goods_id FROM ecs_goods WHERE goods_id>= ((SELECT MAX(goods_id) FROM ecs_goods as g where g.is_on_sale = 1 AND g.is_alone_sale = 1 AND g.is_delete = 0  and is_best=1 AND g.brand_id=".$brand_id.")-(SELECT MIN(goods_id) FROM ecs_goods as g where g.is_on_sale = 1 AND g.is_alone_sale = 1 AND g.is_delete = 0 and is_best=1 AND g.brand_id=".$brand_id.")) * RAND() + (SELECT MIN(goods_id) FROM ecs_goods as g where g.is_on_sale = 1 AND g.is_alone_sale = 1 AND g.is_delete = 0 and is_best=1 AND g.brand_id=".$brand_id.")  LIMIT 8 ";
			
			
		}*/
		
	$num = 8;
	$where = " g.is_on_sale = 1 AND g.is_alone_sale = 1 AND g.is_delete = 0 and is_best=1 and brand_id=$brand_id ";
	$sql = 'SELECT g.goods_id FROM ' . $GLOBALS['ecs']->table('goods') . " AS g  WHERE $where";
	$goods_ids = $GLOBALS['db']->getCol($sql);
	$relative_goods_ids = array();
	$lenght = count($goods_ids);
	$i=1;
	if($num>$lenght)
	{
		$num = $lenght;
	}
	while($i<=$num)
	{
		$goods_id = $goods_ids[mt_rand(0, $lenght-1)];
		if(!in_array($goods_id,$relative_goods_ids))
		{
			$relative_goods_ids[] = $goods_id;
			$i++;
		}
	}
		
		//$sql = "SELECT g.goods_id FROM ".$ecs->table('goods')." AS g WHERE g.is_on_sale = 1 AND g.is_alone_sale = 1 AND g.is_delete = 0  and is_best=1 AND g.brand_id=".$brand_id." limit 100";
		//$goods_ids = $db->getCol($sql);
		
		$goods_ids  = $relative_goods_ids;
		
		$sql = "UPDATE " . $GLOBALS['ecs']->table('brand') . "
						SET rand_ids = '" . join(',',$goods_ids) . "',rand_date='".$now_time1."' WHERE brand_id = '" . $brand_id . "'";
		$GLOBALS['db']->query($sql);
		
		
		
	}
     


	 
	$sql = "SELECT g.goods_id,g.brand_id, g.goods_name, g.goods_name_style, g.click_count, g.goods_number, g.market_price,  g.is_new, g.is_best, g.is_hot, g.shop_price AS org_price,  IFNULL(mp.user_price, g.shop_price * '1') AS shop_price, g.promote_price,  IF(g.promote_price != ''  AND g.promote_start_date < 1439592730 AND g.promote_end_date > 1439592730, g.promote_price, shop_price)  AS shop_p, g.goods_type,  g.promote_start_date, g.promote_end_date, g.goods_brief, g.goods_thumb, g.goods_img  FROM ".$ecs->table('goods')." AS g  LEFT JOIN ".$ecs->table('member_price')." AS mp  ON mp.goods_id = g.goods_id  AND mp.user_rank = '0' WHERE g.goods_id " . db_create_in($goods_ids) . " order by g.goods_id desc";


	$goodsInfo = $db->getAll($sql);
	foreach($goodsInfo as $key=>$row){
		$goodsInfo[$key]['shop_price']       = price_format($row['shop_price']);
		$goodsInfo[$key]['promote_price']    = ($promote_price > 0) ? price_format($promote_price) : '';
		$goodsInfo[$key]['goods_thumb']      = get_image_path($row['goods_id'], $row['goods_thumb'], true);
		$goodsInfo[$key]['url']              = build_uri('goods', array('gid'=>$row['goods_id']), $row['goods_name']);
	}
	
	return array('num'=>$allnum,'info'=>$goodsInfo);
}


$cat = $_GET['id'];

function get_cat_brandssss($cat = 0, $app = 'category')
{
    $children = ($cat > 0) ? ' AND ' . get_children($cat) : '';
    $sql = "SELECT b.brand_id, b.brand_name, b.brand_logo, COUNT(g.goods_id) AS goods_num, IF(b.brand_logo > '', '1', '0') AS tag ".
        "FROM " . $GLOBALS['ecs']->table('brand') . "AS b, ".
        $GLOBALS['ecs']->table('goods') . " AS g ".
        "WHERE g.brand_id = b.brand_id $children " .
        "GROUP BY b.brand_id HAVING goods_num > 0 ORDER BY tag DESC, b.sort_order ASC";
    $row = $GLOBALS['db']->getAll($sql);
    foreach ($row AS $key => $val)
    {
        $row[$key]['url'] = build_uri($app, array('cid' => $cat, 'bid' => $val['brand_id']), $val['brand_name']);
    }

    return $row;

}


?>