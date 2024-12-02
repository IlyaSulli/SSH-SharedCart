const fs = require('fs');
const http = require('http');
const url = require('url');
const { MongoClient, ObjectId } = require("mongodb");
const { stringify } = require('querystring');
const credentials = require('./credentials.js');

// Replace the uri string with your connection string.
const uri = credentials.connectionString; // Mongodb Connection String
const client = new MongoClient(uri); // Connect to Database Collection
const database = client.db('cartDB'); // stores cartDB database
// Updates the peopleItem database with a new quantity based on input from server

async function updateQuantity(personId ,itemId, quantityItem) {
    const items = database.collection('peopleItems'); // Connects to peopleItems
    const queryTemp = {"ItemId" : itemId, "PersonId" : personId}; // Searches for ItemId and PersonId are equal to inputs
    const updateDocument = {
        $set: {
           Quantity: quantityItem, // Set new quantity
        },
     };
    const item = await items.updateOne(queryTemp, updateDocument); // Update the matching document
    const jsonItem = JSON.stringify(item, null, "\t"); // Turn this into a JSON string
    fs.writeFileSync(`${__dirname}/response.json`, jsonItem, `utf-8`); // Write this info to a JSON file
}

// Deletes specific item from peopleItem database
async function deleteItem(personId ,itemId) {
    const items = database.collection('peopleItems'); // Stores pointer to peopleItems collection
    const queryTemp = {"ItemId" : itemId, "PersonId" : personId}; // Searches for ItemId and PersonId are equal to inputs
    const item = await items.deleteOne(queryTemp); // Deletes matching document item
    const jsonItem = JSON.stringify(item, null, "\t"); // Turns this output into a string
      fs.writeFileSync(`${__dirname}/response.json`, jsonItem, `utf-8`); // Write this info to a JSON file
}

// Update Confirmed Order Status for a specific user based on previous boolean value
async function updateStatus(personId) {
    const people = database.collection('people'); // Connects to people collection
    const queryTemp = {_id : new ObjectId(personId)}; // Searches for whether the personId is equal to the input
    var person = await people.findOne(queryTemp); // Finds specific person with this personId
    if (person.Confirmed === true) { // Checks whether they have confirmed or not
        const updateDocument = {
            $set: {
               Confirmed: false, // If True -> False
            },
         };
        person = await people.updateOne(queryTemp, updateDocument); // Change current value to new value
    } else {
        const updateDocument = {
            $set: {
               Confirmed: true, // If False -> True
            },
         };
        person = await people.updateOne(queryTemp, updateDocument); // Change current value to new value
    }
    const jsonItem = JSON.stringify(person, null, "\t"); // Turns this output into a string
    fs.writeFileSync(`${__dirname}/response.json`, jsonItem, `utf-8`); // Write this info to a JSON file
}

// Writes list of all items and relevant info to a JSON file
async function getListOfItems() {
    var collection = database.collection('people'); // Connects to people collection
    var queryTemp = {}; // No Query as this is finding all people
    const people = await collection.find(queryTemp).toArray(); // Stores an array of every person in the database

    var tempItem = []; // Initialises the JSON file input
    for (var i = 0; i < people.length; i++) { // Runs through every person in the database
        collection = database.collection('peopleItems'); // Connects to peopleItems Collection
        var cart = []; // Initialises Cart which will store all this persons Items
        queryTemp = {"PersonId" : people[i]._id.toString()}; // Sets Query to check for whether the PersonId is equal to current searching person in peopleItems Collection
        const itemIds = await collection.find(queryTemp).toArray(); // Stores Array of all items that are associated with this person
        collection = database.collection('items'); // Connects to items collection
        var tempListItems = []; // Initialises array to store the relevant info for items
        for (var j = 0; j < itemIds.length; j++) { // Runs through every item for this person
            queryTemp = {_id : new ObjectId(itemIds[j].ItemId)}; // Finds items which have corresponding ids from item Collection
            const item = await collection.find(queryTemp).toArray(); // Stores all info about that item
            console.log(item);
            tempListItems.push(item[0]); // Adds item to list of current items for this person
        }
        if (tempListItems.length != 0) { // Checks whether person has items -> Otherwise ignores them from JSON file
        cart = tempListItems; // Push all current items to the cart array
        const id = people[i]._id.toString();
        tempItem.push({[id] : {"name": people[i].FirstName +" " + people[i].Surname, "confirmed" : people[i].Confirmed,"cart" : cart}}); // Pushes all relevant info into tempItem array
        }
    }
    const jsonItem = JSON.stringify(tempItem, null, "\t"); // Converts array into a string
    fs.writeFileSync(`${__dirname}/response.json`, jsonItem); // Writes this all into a JSON file
}



const server = http.createServer((request,response) => {
    const {search, pathname} = url.parse(request.url, true); // Gets relevant URL info

    if (pathname === `/` || pathname === `/api`) { // Checks whether the Url has a relevant path within it
        if (search === `?updateQuantity`) { // Checks whether the query after /api is a certain value
            updateQuantity("6748975f6414acd158893bfb","674898306414acd158893c01", 10).catch(console.dir);
            response.end("Updating Quantity");
        } else if (search === `?removeitem`) {
            // id, itemid
            deleteItem("6748975f6414acd158893bfb", "674898306414acd158893c01").catch(console.dir);
            response.end("Removing Item");
        } else if (search === `?toggleConfirm`) {
           // Send additional info if everyone has confirmed
            updateStatus("6749ae96930928d87b893bf9");
            response.end("Updated Status");
        } else if (search === `?getListOfItems`) {
            getListOfItems();
            response.end("Gotten Items");
        }
    } else {
        response.end("Page not Found!");
    }
});

server.listen(8000, `127.0.0.1`, () => {
    console.log("Listening to requests on port: 8000");
});
