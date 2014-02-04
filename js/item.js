var view_item_delete_callback = null;
var view_item_edit_callback = null;

var item_json = null;

function showItemDialog(item) {
	showOverlayDialog();
	item_json = item;

	document.getElementById("content-container").style.overflow = "hidden";
	drawMapView(item.latitude, item.longitude);
	drawItemInfoView(item);
};

function hideItemDialog() {
	hideOverlayDialog();
};

function hideItemDialogAfterDeletion() {
	hideItemDialog();
	if (view_item_delete_callback != null) {
		view_item_delete_callback();
	};
};

function setItemOverlayDeleteCallback(callback) {
	view_item_delete_callback = callback;
};

function setItemOverlayEditCallback(callback) {
	view_item_edit_callback = callback;
};

function buyItem(item_id) {

	if (getUserData() != null) {
		console.log(item_json);
		if (getUserData().user_id != item_json.user_id) {
			var api_request = new XMLHttpRequest();
			api_request.open("POST", "../api/api.php", true);
			api_request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			api_request.send("action=cart&id=" + item_id);

			api_request.onreadystatechange = function() {
				if (api_request.readyState == 4) {
					if (api_request.status != 200) {
						handleError(api_request.responseText);
						return;
					} else {
						document.getElementById("buy-item").innerHTML = "Boom! Added!"
						document.getElementById("buy-item").removeAttribute("onclick");
					};
				};
			};
		} else {
			alert("You can't buy your own item!");
		};

	} else {
		if (confirm("You need to be logged in to do that.\n\nLog in now?")) {
			window.location.replace("../views/login.php");
		};
	};
};

function deleteItem(item_id) {
	if (confirm("Are you sure you want to delete this item?")) {
		var api_request = new XMLHttpRequest();
		api_request.open("DELETE", "../api/api.php?action=item&id=" + item_id, true);
		api_request.send();

		api_request.onreadystatechange = function() {
			if (api_request.readyState == 4) {
				if (api_request.status != 200) {
					handleError(api_request.responseText);
					return;
				} else {
					itemDeleted();
				};
			};
		};
	};
};

function editItem(item_id) {
	hideItemDialog();
	if (view_item_edit_callback != null) {
		view_item_edit_callback(item_json);
	};
};

function drawMapView(lat, lon) {
	var map_view = document.createElement("div");
	map_view.setAttribute("id", "item-map-canvas");
	
	appendOverlayContentView(map_view);

	var mapOptions = {
	 	zoom: 15,
	    center: new google.maps.LatLng(lat, lon)
	}
	var map = new google.maps.Map(document.getElementById('item-map-canvas'), mapOptions);

	var marker = new google.maps.Marker({
	    position: new google.maps.LatLng(lat, lon),
	    map: map,
	    title: 'Hello World!'
	});

	navigator.geolocation.getCurrentPosition(function(position) {
		showUserLocationOnMap(map, position.coords.latitude, position.coords.longitude);
	});
	

};

function drawItemInfoView(item) {
	var metadata_container = document.createElement("div");
	metadata_container.setAttribute("id", "metadata-container")

	var item_image = document.createElement("img");
	item_image.setAttribute("src", item.imageUrl);
	item_image.setAttribute("id", "item-detail-image");

	metadata_container.appendChild(item_image);

	var item_name = document.createElement("h2");
	item_name.setAttribute("id", "item-detail-name");
	item_name.innerHTML = item.name + "<br/>";

	var button_container = document.createElement("div");
	button_container.setAttribute("id", "button-container");

	var buy_item = document.createElement("a");
	buy_item.setAttribute("class", "btn btn-submit");
	buy_item.setAttribute("id", "buy-item");
	buy_item.setAttribute("href", "#");
	buy_item.setAttribute("onclick", "buyItem(" + item.itemId + ")");

	buy_item.innerHTML = "Add to cart (&pound;"+item.price+")";
	
	var item_detail_description = document.createElement("p");
	item_detail_description.setAttribute("id", "item-detail-description");
	item_detail_description.innerHTML = item.description;

	if (getUserData() != null) {
		if (item.userId == getUserData().user_id) {
			var ownership_notification = document.createElement("p");
			ownership_notification.innerHTML = "This is your item!";
			ownership_notification.setAttribute("id", "item-ownership-notification");

			var delete_item_button = document.createElement("a");
			delete_item_button.setAttribute("class", "btn btn-cancel");
			delete_item_button.setAttribute("id", "delete-item-button");
			delete_item_button.setAttribute("href", "#");
			delete_item_button.setAttribute("onclick", "deleteItem(" + item.itemId + ")");
			delete_item_button.innerHTML = "Delete Item";

			var edit_item_button = document.createElement("a");
			edit_item_button.setAttribute("class", "btn btn-success");
			edit_item_button.setAttribute("id", "edit-item-button");
			edit_item_button.setAttribute("href", "#");
			edit_item_button.setAttribute("onclick", "editItem(" + item.itemId + ")");
			edit_item_button.innerHTML = "Edit Item";

			button_container.appendChild(edit_item_button);
			button_container.appendChild(delete_item_button);
			button_container.appendChild(ownership_notification);
		} else {
			var message_user = document.createElement("a");
			message_user.setAttribute("class", "btn btn-info");
			message_user.setAttribute("id", "view-user-profile");
			message_user.setAttribute("href", "../views/user.php?id="+item['userId']);
			message_user.innerHTML = "View Seller";
			
			button_container.appendChild(buy_item);
			button_container.appendChild(message_user);
		};
	} else {
			var message_user = document.createElement("a");
			message_user.setAttribute("class", "btn btn-info");
			message_user.setAttribute("id", "view-user-profile");
			message_user.setAttribute("href", "../views/user.php?id="+item['userId']);
			message_user.innerHTML = "View Seller";
			
			button_container.appendChild(buy_item);
			button_container.appendChild(message_user);
	};

	metadata_container.appendChild(item_name);
	metadata_container.appendChild(button_container);
	metadata_container.appendChild(item_detail_description);

	appendOverlayContentView(metadata_container);
};

function itemDeleted() {
	removeElementFromDocument("metadata-container");
	removeElementFromDocument("item-map-canvas");

	var successMessageHeader = document.createElement("h2");
	successMessageHeader.setAttribute("id", "deleted-item-title");
	successMessageHeader.innerHTML = "Item Deleted!";

	var goShoppingButton = document.createElement("a");
	goShoppingButton.setAttribute("class", "btn btn-info");
	goShoppingButton.setAttribute("id", "delete-dismiss-button");
	goShoppingButton.setAttribute("onclick", "hideItemDialogAfterDeletion()");
	goShoppingButton.setAttribute("href", "#");

	goShoppingButton.innerHTML = "Done";

	var successMessageContainer = document.createElement("div");
	successMessageContainer.setAttribute("id", "deleted-item-container");

	successMessageContainer.appendChild(successMessageHeader);
	successMessageContainer.appendChild(goShoppingButton);

	appendOverlayContentView(successMessageContainer);

};
