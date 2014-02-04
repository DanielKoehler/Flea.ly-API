<?php

//
//  token_auth_helper.php
//  Flealy API
//
//  Created by Daniel Koehler on 08/01/2014.
//  Copyright (c) 2014 Daniel Koehler. All rights reserved.
//
//  Functions to generate unique auth tokens
//  

function crypto_rand_secure_index($min, $max) {
        $range = $max - $min;
        if ($range < 0) return $min; // not so random...
        $log = log($range, 2);
        $bytes = (int) ($log / 8) + 1; // length in bytes
        $bits = (int) $log + 1; // length in bits
        $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
        do {
            $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
            $rnd = $rnd & $filter; // discard irrelevant bits
        } while ($rnd >= $range);
        return $min + $rnd;
}
 
function request_unique_authorisation_token($length){
    $authorisation_token = "";
    $crypto_range = implode(range('A', 'Z')) . implode(range('a', 'z')) . implode(range(0, 9));

    for($i=0;$i<$length;$i++){
        $authorisation_token .= $crypto_range[crypto_rand_secure_index(0,strlen($crypto_range))];
    }

	$select_query = "SELECT `token` FROM `authorisation_token` WHERE `token` ='$authorisation_token'";
	$result = db_connection()->query($select_query);
	
	if($result->num_rows){ // Check that token is unqiue else call self again.
		return request_unique_authorisation_token($length);
	}
	return $authorisation_token;
}

?>