/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Connect to the Database
mongoose.connect("mongodb://localhost:27017/todolistDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

// Add Schema for the database
const itemsSchema = {
	name: String,
};

// Database Schema
const Item = mongoose.model("Item", itemsSchema);

// Create Object for new Item
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

// Create schema for the List Item with name
const listSchema = {
	name: String,
	items: [itemsSchema],
};

//	Create List Model
const List = mongoose.model("List", listSchema);

//	Add default item to the Database
app.get("/", function (req, res) {
	Item.find({}, function (err, foundItems) {
		if (foundItems.length === 0) {
			Item.insertMany(defaultItems, function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log("Successfully Added to the Database");
				}
			});
			res.redirect("/");
		} else {
			res.render("list", { listTitle: "Today", newListItems: foundItems });
		}
	});
});

//	Route to the custom list
app.get("/:customListName", function (req, res) {
	const customlistName = req.params.customListName;

	List.findOne({ name: customlistName }, function (err, foundList) {
		if (!err) {
			if (!foundList) {
				//Create a custom new list
				const list = new List({
					name: customlistName,
					items: defaultItems,
				});
				list.save();
				res.redirect("/" + customlistName);
				console.log("Added custom list name");
			} else {
				// Show and existing list
				res.render("list", {
					listTitle: foundList.name,
					newListItems: foundList.items,
				});
			}
		}
	});
});

// Redirect to Home Page
app.post("/", function (req, res) {
	const itemName = req.body.newItem;
	const listName = req.body.list;

	// Create item object
	const item = new Item({
		name: itemName,
	});
	if (itemName.length > 0) {
		if (listName === "Today") {
			item.save();
			console.log("Successfully Item Added");
			res.redirect("/");
		} else {
			console.log("Executed");
			List.findOne({ name: listName }, function (err, foundList) {
				foundList.items.push(item);
				foundList.save();
				res.redirect("/" + listName);
			});
			console.log("Added to existing item");
		}
	} else {
		console.log("Route to custome page");
		res.redirect("/" + listName);
	}
});

// Redirect to Delete Task Page
app.post("/delete", function (req, res) {
	console.log("Route to delete page");
	const checkItemID = req.body.checkbox;
	const listName = req.body.listName;

	if (listName === "Today") {
		Item.findByIdAndRemove(checkItemID, function (err) {
			if (!err) {
				console.log("Successfully deleted the checked item.");
				res.redirect("/");
			}
		});
	} else {
		List.findOneAndUpdate(
			{ name: listName },
			{ $pull: { items: { _id: checkItemID } } },
			function (err, foundList) {
				if(!err){
					res.redirect("/" + listName);
				}
			}
		);
	}
});

// Redirect to About Page
app.get("/about", function (req, res) {
	res.render("about");
});

// Port listener
app.listen(process.env.PORT || port, function () {
	console.log("Server is running on port " + port);
});
