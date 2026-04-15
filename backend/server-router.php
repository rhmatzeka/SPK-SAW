<?php

$publicPath = __DIR__.'/public';
$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$resolvedPath = $publicPath.$requestPath;

if ($requestPath !== '/' && file_exists($resolvedPath) && ! is_dir($resolvedPath)) {
    return false;
}

require $publicPath.'/index.php';
