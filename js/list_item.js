var list_item_location = null;
var list_item_callback_function = null;
var item_image_base64 = null;
var editing_item_json = null;
var map = null;

function setListItemSuccessCallback(callback) {
	list_item_callback_function = callback;
};

// item_json is passed if an item is being edited
function showListItemDialog(item_json) {
	showOverlayDialog();

	if (item_json == null) {
		navigator.geolocation.getCurrentPosition(function(position) {
			drawListItemMapView(position.coords.latitude, position.coords.longitude);
			drawListItemForm();
		});
	} else {
		editing_item_json = item_json;
		drawListItemMapView(editing_item_json.latitude, editing_item_json.longitude);
		drawListItemForm();
		fillItemDataForEditing();

		navigator.geolocation.getCurrentPosition(function(position) {
			showUserLocationOnMap(map, position.coords.latitude, position.coords.longitude);
		});
	};

};

function hideListItemDialog() {
	hideOverlayDialog();
}

function drawListItemMapView(lat, lon) {
	var map_view = document.createElement("div");
	map_view.setAttribute("id", "list-item-map-canvas");
	
	appendOverlayContentView(map_view);

	var mapOptions = {
	 	zoom: 15,
	    center: new google.maps.LatLng(lat, lon)
	}
	map = new google.maps.Map(document.getElementById('list-item-map-canvas'), mapOptions);
	
	var marker;

	google.maps.event.addListener(map, "click", function(event) {
		list_item_location = event.latLng;

		if (marker != null) {
			marker.setMap(null);
		};

		marker = new google.maps.Marker({
		    position: event.latLng,
		    map: map,
		    title: 'Hello World!'
		});
	});

	if (editing_item_json == null) {
		showUserLocationOnMap(map, lat, lon);
	} else {
		list_item_location = new google.maps.LatLng(lat,lon);

		marker = new google.maps.Marker({
		    position: list_item_location,
		    map: map,
		    title: 'Hello World!'
		});
	};
};

function drawListItemForm() {
	var list_item_form = document.createElement("form");
	list_item_form.setAttribute("method", "post");
	list_item_form.setAttribute("id", "list-item-form");

	var upload_image_div = document.createElement("div");
	upload_image_div.setAttribute("id", "upload-image-div")
	upload_image_div.innerHTML = "<p id='add-image-paragraph'>Click to add an image</p>"

	var list_item_name = document.createElement("input");
	list_item_name.setAttribute("type", "text");
	list_item_name.setAttribute("name", "item_name");
	list_item_name.setAttribute("placeholder", "Item name");
	list_item_name.setAttribute("id", "list-item-name");
	list_item_name.setAttribute("class", "text-input");

	var list_item_price = document.createElement("input");
	list_item_price.setAttribute("type", "text");
	list_item_price.setAttribute("name", "item_price");
	list_item_price.setAttribute("placeholder", "Item price");
	list_item_price.setAttribute("id", "list-item-price");
	list_item_price.setAttribute("class", "text-input");

	var list_item_description = document.createElement("textarea");
	list_item_description.setAttribute("name", "list-item-description");
	list_item_description.setAttribute("id", "list-item-description");
	list_item_description.setAttribute("class", "text-area");
	list_item_description.setAttribute("form", "list-item-form");
	list_item_description.setAttribute("placeholder", "Description");

	var list_item_upload_button = document.createElement("input");
	list_item_upload_button.setAttribute("type", "file");
	list_item_upload_button.setAttribute("id", "list-item-upload-button");

	var list_item_submit_button = document.createElement("input");
	list_item_submit_button.setAttribute("type", "submit");
	list_item_submit_button.setAttribute("name", "image");
	list_item_submit_button.setAttribute("class", "btn btn-success");
	list_item_submit_button.setAttribute("id", "list-item-submit");
	list_item_submit_button.value = "List Item";

	appendOverlayContentView(upload_image_div);

	list_item_form.appendChild(list_item_name);
	list_item_form.appendChild(list_item_price);
	list_item_form.appendChild(list_item_description);
	upload_image_div.appendChild(list_item_upload_button);
	list_item_form.appendChild(list_item_submit_button);

	appendOverlayContentView(list_item_form);

	document.getElementById("list-item-form").addEventListener('submit', function(event) {
		event.preventDefault();
		submit_form();

	}, false);

	document.getElementById('list-item-upload-button').onchange = function() {
		var reader = new FileReader();
		reader.onload = function(e) {

			item_image_base64 = e.target.result;

			var addImageParagraph = document.getElementById("add-image-paragraph")
			if (addImageParagraph)
			        addImageParagraph.parentNode.removeChild(addImageParagraph);

			document.getElementById("upload-image-div").style.backgroundImage = "url("+e.target.result+")";

		}

		reader.readAsDataURL(document.getElementById('list-item-upload-button').files[0]);
	};
};

function fillItemDataForEditing() {
	// Fill the image view
	removeElementFromDocument("add-image-paragraph");
	document.getElementById("upload-image-div").style.backgroundImage = "url("+editing_item_json.image_url+")";

	// Fill the item name
	document.getElementById("list-item-name").value = editing_item_json.name;

	// Fill the item price
	document.getElementById("list-item-price").value = editing_item_json.price;

	// Fill the item description
	document.getElementById("list-item-description").innerHTML = editing_item_json.description;	

	// Set the submit button text
	document.getElementById("list-item-submit").value = "Save Changes";
}

function submit_form() {
	var item_name 		 = document.getElementById("list-item-name").value;
	var item_description = document.getElementById("list-item-description").value;
	var item_price 		 = document.getElementById("list-item-price").value;

	if (validate_forms(item_name, item_description, String(item_price), list_item_location, item_image_base64)) {
		var lat 		     = list_item_location.lat();
		var lon 		     = list_item_location.lng();

		if (editing_item_json) {
			update_item(item_name, item_description, item_price, lat, lon);
		} else {
			create_item(item_name, item_description, item_price, lat, lon);
		};

	};
};

function create_item(item_name, item_description, item_price, lat, lon) {
	var file_submission = new XMLHttpRequest();
	file_submission.open('POST', '../api/api.php', true);
	file_submission.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	file_submission.send("action=item&name="+item_name+"&description="+item_description+"&price="+item_price+"&lat="+lat+"&lon="+lon+"&image_data="+item_image_base64);

	file_submission.onreadystatechange = function() {
		if (file_submission.readyState == 4) {
			if (file_submission.status != 200) {
				handleError(file_submission.responseText);
				return;
			} else {
				alert("Item successfully listed!");
				hideListItemDialog();
				if (list_item_callback_function != null) {
					list_item_callback_function();
				};
			};
		};
	};
};

function update_item(item_name, item_description, item_price, lat, lon) {
	var api_request = new XMLHttpRequest();
	api_request.open('POST', '../api/api.php', true);
	api_request.setRequestHeader("Content-type","application/x-www-form-urlencoded");

	var request_string = "action=item&item_id=" + editing_item_json.item_id;

	if (item_name != editing_item_json.name) {
		request_string += "&name="+item_name;
	};

	if (item_description != editing_item_json.description) {
		request_string += "&description="+item_description;
	};

	if (item_price != editing_item_json.price) {
		request_string += "&price="+item_price;
	};

	if (lat != editing_item_json.latitude) {
		request_string += "&latitude="+lat+"&longitude="+lon;
	};

	if (item_image_base64 != null) {
		request_string += "&image_data="+item_image_base64;
	};
	
	api_request.send(request_string);

	api_request.onreadystatechange = function() {
		if (api_request.readyState == 4) {
			if (api_request.status != 200) {
				handleError(api_request.responseText);
				return;
			} else {
				alert("Item successfully updated!");
				hideListItemDialog();
				if (list_item_callback_function != null) {
					list_item_callback_function();
				};
			};
		};
	};
}

function validate_forms(item_name, item_description, item_price, location, file) {
	if (item_name.length == 0) {
		alert("Enter an item name");
		return false;
	};

	if (item_description.length == 0) {
		alert("Enter an item description");
		return false;
	};

	if (isNaN(item_price) || item_price.length == 0 || Number(item_price) <= 0) {
		alert("Enter a valid price");
		return false;
	};

	if (location == null) {
		alert("Enter the item's location. \nClick on the map to do this");
		return false;
	};

	if (file == null && editing_item_json == null) {
		alert("Upload an image for the item");
		return false;
	};

	return true;
};