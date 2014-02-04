<?php

//
//  jsonify.php
//  Flealy API
//
//  Created by Daniel Koehler on 08/01/2014.
//  Copyright (c) 2014 Daniel Koehler. All rights reserved.
//
//  Functions to clean up JSON encoded data prior to endevoring to pass it with AFNetworking
//  in Objective-C.
//

header('Content-Type: application/json');

// Ensure there are no underscores in the associtive array keys, and that some general characters are excaped. 
function AFNetworkingSafeArray($array) {
	foreach ($array as $key => $value) {
		// If not valid
		if (is_array($value)){
			$array[$key] = AFNetworkingSafeArray($value);
		}
		// Make Camel Case if needed.
		if(preg_match('/^[a-z]/i', $key)){
			// Remove to rename
			unset($array[$key]);
		    $key[0] = strtolower($key[0]);
			$func = create_function('$c', 'return strtoupper($c[1]);');
			$key = preg_replace_callback('/_([a-z])/', $func, $key);
			$array[$key] = $value;
		}			
	}	
	return $array;
}

// Alternate JSON encode call for outputing AFNetworking Safe Json.
function clean_json_encode($array){
	die(json_encode(AFNetworkingSafeArray($array), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

?>