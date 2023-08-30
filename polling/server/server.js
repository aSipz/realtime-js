import express from "express";
import bodyParser from "body-parser";
import nanobuffer from "nanobuffer";
import morgan from "morgan";

const msg = new nanobuffer(50);
const getMsgs = () => Array.from(msg).reverse();

msg.push({
	user: "Angel",
	text: "Hello",
	time: Date.now(),
});

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.static("client"));

app.get("/poll", function (req, res) {
	res.json({
		msg: getMsgs()
	});
});

app.post("/poll", function (req, res) {
	const { user, text } = req.body;
	msg.push({
		user,
		text,
		time: Date.now(),
	});
	res.json({
		status: 'ok'
	});
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Server listening on http://localhost:${port}`);