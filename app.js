/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Connect to the Database
mongoose.connect("mongodb://localhost:27017/todolistDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const itemsSchema = {
	name: String,
};

// Database Schema
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
	name: "Welcome to your todolist",
});

const item2 = new Item({
	name: "Hit the plus (+) button for a new item",
});

const item3 = new Item({
	name: "<--- Hit this to delete an item.",
});

//	Default items
const defaultItems = [item1, item2, item3];

//	Add defualt item to the Database
Item.insertMany(defaultItems, function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log("Successfully default items added to the database");
	}
});

app.get("/", function (req, res) {
	Item.find({}, function (err, foundItems) {
		console.log(foundItems);
		res.render("list", { listTitle: "Today", newListItems: foundItems });
	});
	
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
