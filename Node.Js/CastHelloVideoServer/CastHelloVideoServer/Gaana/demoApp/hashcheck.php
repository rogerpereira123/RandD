<?php 

$p1 = isset($_GET['x']) ? $_GET['x'] : '';
$p2 = isset($_GET['y']) ? $_GET['y'] : '';


$base64 = base64_encode($p1);
echo '1. base64_encode: '. $base64 .'<br/>';

$md5 = md5($p2);
echo '2. md5: '. $md5 .'<br/>';

$hashcode = hash_hmac('md5', $base64, $md5);
echo '3. hash_hmac: '.$hashcode;
?>