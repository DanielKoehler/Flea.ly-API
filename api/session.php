<?php

function sign_in_requesting_token($username, $password){
	$db = db_connection(); // Create reuseable connection.
	// Create password hash to compare against 
	$password_hash = login_hash($username, $password);

	$sql = "SELECT * FROM users WHERE password = '$password_hash'";

	$result = $db->query($sql);

	if(!$result->num_rows){ // Non-valid details.
		http_response_code(401);
		die(clean_json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
	}

	$user_id = $result->fetch_assoc()['user_id'];

	if ($user = user_has_authorisation_token($user_id)){
		clean_json_encode($user);
	}
	
	$authorisation_token = request_unique_authorisation_token(512);
	
	$created = time();
	$remote_address = $_SERVER['REMOTE_ADDR'];
	$last_use = 0;

	$insert_query = "INSERT INTO `authorisation_token`(`token`, `user_id`, `created`, `last_use`, `remote_address`) VALUES ('$authorisation_token','$user_id','$created','$last_use','$remote_address')";
	if ($db->query($insert_query)){
		// Create object containing user details and newly created token.
		$user = get_user_for_token($authorisation_token);
		$user['authorisation_token'] = $authorisation_token;
		// Return these details.
		clean_json_encode($user);
	}	

	http_response_code(401);
	die(clean_json_encode(array('error' => array('code' => 401, 'message' => 'Incorrect username or password'))));
}

function sign_in($username, $password) {
	// Create password hash to compare against 
	$password_hash = login_hash($username, $password);

	$db = db_connection();

	$sql = "SELECT * FROM users WHERE password = '$password_hash'";

	if(!$result = $db->query($sql)){
		http_response_code(401);
		die(clean_json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
	}
	
	// If the login was successful, save
	if($row = $result->fetch_assoc()){
		start_session();
		$_SESSION['user'] = $row['user_id'];
		unset($row['password']);
	    return clean_json_encode($row);
	}

	http_response_code(401);
	die(clean_json_encode(array('error' => array('code' => 401, 'message' => 'Incorrect username or password'))));
}

function sign_out() {
	session_destroy();
	session_unset();

	return clean_json_encode(array('code' => 200, 'message' => 'Signed Out'));
}



?>