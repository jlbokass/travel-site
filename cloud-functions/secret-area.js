exports.handler = function(event, context, callback) {
	
	const secretContent = ` 
	<h3>Welcome To the Secret Area</h3>
	<p>Here we can telle you that the sky is <strong>blue</strong>, and two plus two equal four</p>
	`
	
	let body 

	if (event.body) {
		body = JSON.parse(event.body)
	} else {
		body = {}
	}

	if (body.password == "javascript") {
		callback(null, {
			statusCode: 200,
			Body: secretContent
		})
	} else {
		callback(null, {
			statusCode: 401,
			Body: "Incorrect password"
		})
	}

	callback(null, {
		statusCode: 200,
		Body: "Welcome to the secret area"
	})
}