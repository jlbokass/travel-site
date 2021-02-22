exports.handler = function(event, context, callback) {
	callback(null, {
		statusCode: 200,
		Body: "Welcome to the secret area"
	})
}