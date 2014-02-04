<!DOCTYPE>

<html>

<head>
	<title>Flealy - Log In</title>
</head>

<body>

	<div class="fade-and-slide" id="log-in-container-div">
		<div id="login-message">
			<h1>Log into <a href="#">Flea.ly</a></h1>
		</div>
		<br/>
		<div id="login-div">
			<form id="login-form" method="post" action="http://flea.ly/api/api.php?request_method=GET&amp;action=purchases&amp;authorisation_method=token">
				<input type="text" name="username" class="text-input" id="username-input" placeholder="Username" /><br/>
				<input type="password" name="password" class="text-input" id="password-input" placeholder="Password" /><br/>
				<input type="hidden" name="authorisation_token" value="4yKNe0OIKIHXlAjw55f8xOF1rFePSOm6HGZIVhJ6bfuUiCtRSQFjzv1UrULBOlOkwwcJh2KIkobfJ3YimxwkxSxLjvrraJYRmJGShSLlKcnzna8k8jGmoFyKKbXCJcrEX0lBKOMM5uait8KF8CiajXT5xem5iML1XqDwMsEGUVeGPlIr22eXXJ8beVYWdLzA6QRT08uKhX6hj7RtEv1K9nv9zPwIecGgc3Q7VPZwEEf3LinDAYdMLx1gqRNkiZ6n0AoLvWIYHbrXmNz7CEivr3XxJErCD6zSU1tic69yfuA4ExPzc24tbtYFoeAE6Eilyz3HE9lz9lrkyk0yfRsLVTm3zU1zXrXx0HjaiiEp2nA0XD5DH7CUPsyrRYkTeuZQonpvNtgG5ZGwe8vlVmCEwblCBnBMb1GLrKqZiCuxm7gtMoYZAzCJPuglync9jUHI2aFPPXAqY9ZH9cLnBphFrfODBtLJx9h4Nouh8XZQOSEJXN6aBWsg2bDnDuK63W5b" /><br/>
				<input type="submit" />
			</form>
		</div>
	</div>
</body>

</html>