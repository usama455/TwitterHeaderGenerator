const { auth, postReplyWithMedia, postReply } = require("./config.js");
const fs = require("fs");
const request = require("request");
const client = auth();

client.stream("statuses/filter", { track: "#GetARandomHeader" }, function (stream) {
	console.log("Searching for tweets...");

	// when a tweet is found
	stream.on("data", function (tweet) {
		console.log("Found one!");
		console.log("Recieved tweet reading...", tweet.text);

		// check if tweet contains some media
		// if (tweet.text) {
		console.log("Replying to tweet with image.");
		downloadImage("https://picsum.photos/1500/500", tweet.user.screen_name, function () {
			console.log("done");

			postReplyWithMedia(client, `./media/${tweet.user.screen_name}.png`, tweet);
		});

		// } else {
		// 	console.log("Tweet didn't provide media. Replying with message.");
		// 	const message = "Oops, looks like you didn't provide a media file!";
		// 	postReply(client, message, tweet);
		// }

		stream.on("error", function (error) {
			console.log(error);
		});
	});
});

var downloadImage = function (uri, filename, callback) {
	request.head(uri, function (err, res, body) {
		if (err) console.log(err);
		else if (res) console.log(res);
		request(uri)
			.pipe(fs.createWriteStream(`./media/${filename}.png`))
			.on("close", callback);
	});
};
