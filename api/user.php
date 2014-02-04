<?php

function get_user($user_id) {
	if (!isset($user_id)) {
		start_session();
		$user_id = Flealy::getProperty('user');
	}

	if (isset($user_id)) {
		$select_query = "SELECT user_id, username, email, image_url, location, description, sales FROM users WHERE user_id='$user_id'";
		
		if ($result = db_connection()->query($select_query)) {
			while ($row = $result->fetch_assoc()) {
				return clean_json_encode($row);
			}
		}
	} else {
		http_response_code(401);
		die(clean_json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
	}
}

function create_user($email, $username, $password, $location, $description, $image_data) {
	// Create a password hash to store using username, password and salt 
	// (I know, I shouldn't be using SHA1 and a fixed salt. I'm sure all 0 users will complain).
	$password_hash = login_hash($username, $password);

	$filtered_data = substr($image_data, strpos($image_data, ",")+1);
	$filtered_data = str_replace(" ", "+", $filtered_data);

	$file_name = sha1($username.uniqid("img_")).".png";

	$img = imagecreatefromstring(base64_decode($filtered_data));
	imagepng($img, './media/'.$file_name);

	$image_url = image_path($file_name);
	
	// Create query to insert the data
	$db = db_connection();
	$insert_query = "INSERT INTO users (email, username,  password, location, description, image_url) VALUES ('$email', '$username', '$password_hash', '$location', '$description', '$image_url')";

	if ($db->query($insert_query)) {
		$select_query = "SELECT * FROM users WHERE password = '$password_hash'";
		$result = $db->query($select_query);
		
		while ($row = $result->fetch_assoc()) {
			return clean_json_encode(array('response'=>'success'));
		}

		http_response_code(500);
		die(clean_json_encode(array('error' => array('code' => 500, 'message' => 'You have to be signed in to do that'))));
	}
}

function user_logged_in(){

	if(empty($_GET['authorisation_method']) or $_GET['authorisation_method'] !== 'token'){ // Using session based authorisation.
		start_session();
		if (!empty($_SESSION['user'])) // Does session exist?
			Flealy::setProperty('user', $_SESSION['user']);
			return true;
	}

	if(!empty($_POST['authorisation_token'])){
		$db = db_connection(); // Create reuseable connection.
		$authorisation_token = $_POST['authorisation_token'];
		$select_query = "SELECT `token`, `last_use`, `user_id` FROM `authorisation_token` WHERE `token` = '$authorisation_token'";
		$result = $db->query($select_query);

		
		$remote_address = $_SERVER['REMOTE_ADDR'];
		$last_use =  time();

		if($result->num_rows){ // Check that token is valid and then insert Current IP address and update use timestamp.
			$user_id = $result->fetch_assoc()['user_id'];
			$insert_query = "UPDATE `authorisation_token` SET `last_use` = '$last_use', `remote_address` = '$remote_address' WHERE `user_id` = '$user_id'";
			if ($db->query($insert_query)){
				
				Flealy::setProperty('user',$user_id);
				return true;
			}	
		}
	}
	return false;
}

function user_has_authorisation_token($user_id){
	$db = db_connection();

	$select_query = "SELECT `token` FROM `authorisation_token` WHERE `user_id` ='$user_id'";
	$result = $db->query($select_query);
	
	if(!$result->num_rows)
		return false;

	$authorisation_token = $result->fetch_assoc()['token'];
	$user = get_user_for_token($authorisation_token);
	$user['authorisation_token'] = $authorisation_token;

	return $user;
}

function get_user_for_token($authorisation_token){
	if(!empty($authorisation_token)){
		$db = db_connection();
		$user_id = $db->query("SELECT `user_id` FROM `authorisation_token` WHERE `token` = '$authorisation_token'")->fetch_assoc()['user_id'];
		$select_query = "SELECT `user_id`, `username`, `email`, `image_url`, `location`, `description`, `sales` FROM `users` WHERE `user_id` ='$user_id'";
		$result = $db->query($select_query);

		if($result->num_rows){
			$user = $result->fetch_assoc();
			unset($user['password']);
			return $user;
		}
	}
	return false;
}

?>