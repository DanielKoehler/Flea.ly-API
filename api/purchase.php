<?php

function purchase_item($item_id, $card_id, $transaction_id) {
	if (user_logged_in()) {
		
		$user_id = $_SESSION['user'];

		$purchase_time = time();
		$insert_query = "INSERT INTO purchases (item_id, buyer_id, card_id, stripe_transaction_id, purchase_epoch) VALUES ('$item_id', '$user_id', '$card_id', '$transaction_id', '$purchase_time')";

		if ($result = db_connection()->query($insert_query)) {
			return clean_json_encode(array('code' => 200, 'message' => 'success'));
		}
	} else {
		http_response_code(401);
		die(clean_json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
	}
}

function get_purchase_history() {
	if (user_logged_in()) {
		$user_id = $_SESSION['user'];
		$select_query = "SELECT items.item_id, items.name, items.image_url, items.price, purchases.purchase_epoch FROM purchases INNER JOIN items on items.item_id = purchases.item_id AND purchases.buyer_id = '$user_id' ORDER BY purchases.purchase_epoch DESC";
		
		if ($result = db_connection()->query($select_query)) {
			$results_array = array();
			
			while ($row = $result->fetch_assoc()) {
				$results_array[] = clean_json_encode($row);
			}

			return clean_json_encode($results_array);
		}
	} else {
		http_response_code(401);
		die(clean_json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
	}
}

?>
