/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function (req, res) {
	const day = date.getDate();
	res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {
	const item = req.body.newItem;
	if (req.body.list === "Work") {
		workItems.push(item);
		res.redirect("/work");
	} else {
		items.push(item);
		res.redirect("/");
	}
});

app.get("/work", function (req, res) {
	res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", function (req, res) {
	let item = req.body.newItem;
	if (item !== null || item.length !== 0 || item.undefined) {
		workItems.push(item);
		res.redirect("/");
	} else {
		res.redirect("/");
	}
});

app.get("/about", function (req, res) {
	res.render("about");
});

app.listen(process.env.PORT || port, function () {
	console.log("Server is running on port " + port);
});