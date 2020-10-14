const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require("fs");
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/health', (req, res) => {
   res.send('You keep using that word. I do not think it means what you think it means.');
});

//adds an order to orders.json. I made each order have an id, first and last name, Id of item, and number of item.
app.post('/addOrder', function (req, res) {
	
	//Grabs the non-orderId values from the json input.
	var lastName = req.body.lastName;
	var firstName = req.body.firstName;
	var itemId = req.body.itemId;
	var numberOfItems = req.body.numberOfItems;
	
	//checks to see if the Last name and First name belong to a customer from customers.json
	var entered = 0;
	fs.readFile( __dirname + "/../data/customers.json", 'utf8', function (err, data) {
		data = JSON.parse( data );
		val = 0;
		for(val = 0; val < Object.keys(data).length; val++){
			if(data[val].firstName === firstName && data[val].lastName === lastName)
			{
				entered = 1;
				//adds the new data to the orders.json file
				fs.readFile( __dirname + "/../data/orders.json", 'utf8', function (err, prevData) {
					//if the file isn't empty
					if(prevData.length > 0) {
						prevData = JSON.parse( prevData );
						const i = Object.keys(prevData).length + 1;
						var min = 10000;
						var max = 99999;
						var num = Math.floor(Math.random() * (max - min + 1)) + min;
						var newEntry = 
						{
							"orderId" : num + '',
							"lastName" : lastName,
							"firstName" : firstName,
							"itemId" : itemId,
							"numberOfItems" : numberOfItems
						}
						prevData[i] = newEntry;
						fs.writeFile(__dirname + "/../data/orders.json", JSON.stringify(prevData), 'ascii', function (err, d) {
							console.log(prevData);
							res.end(JSON.stringify(prevData));
						});
					} else {
						//if the file is empty
						var min = 10000;
						var max = 99999;
						var num = Math.floor(Math.random() * (max - min + 1)) + min;
						var newEntry = {
							1 : {
								"orderId" : num + '',
								"lastName" : lastName,
								"firstName" : firstName,
								"itemId" : itemId,
								"numberOfItems" : numberOfItems
							}
						}
						prevData = newEntry;
						fs.writeFile(__dirname + "/../data/orders.json", JSON.stringify(prevData), 'ascii', function (err, d) {
							console.log(prevData);
							res.end(JSON.stringify(prevData));
						});
					}
				});
			} else if(val === Object.keys(data).length -1 && entered === 0) {
				//Returns the unchanged orders.json 
				fs.readFile( __dirname + "/../data/orders.json", 'utf8', function (err, prevData) {
					console.log(JSON.parse(prevData));
					res.end(prevData);
				});
			}
		}
	});
});

//updates order from id
app.put('/updateOrder', (req,res) => {
	var orderId = req.body.orderId;
	var lastName = req.body.lastName;
	var firstName = req.body.firstName;
	var itemId = req.body.itemId;
	var numberOfItems = req.body.numberOfItems;
	var entered = 0;
	//checks to see if the new name is in customers.json
	fs.readFile( __dirname + "/../data/customers.json", 'utf8', function (err, data) {
		data = JSON.parse( data );
		val = 0;
		for(val = 0; val < Object.keys(data).length; val++){
			if(data[val].firstName === firstName && data[val].lastName === lastName)
			{
				entered = 1;
				//checks for the orderId in orders.json then updates it.
				fs.readFile( __dirname + "/../data/orders.json", 'utf8', function (err, prevData)
				{
					prevData = JSON.parse( prevData );
					if(Object.keys(prevData).length > 0) {
						var i = 1;
						for(i = 1; i <= Object.keys(prevData).length; i++)
						{
							var enter =0;
							if(prevData[i].orderId + '' === orderId + '')
							{
								enter = 1;
								var newEntry = 
								{
									"orderId" : orderId,
									"lastName" : lastName,
									"firstName" : firstName,
									"itemId" : itemId,
									"numberOfItems" : numberOfItems
								}
								prevData[i] = newEntry;
								fs.writeFile(__dirname + "/../data/orders.json", JSON.stringify(prevData), 'ascii', function (err, d) {
									console.log(prevData);
									res.end(JSON.stringify(prevData));
								});
							} else if(i === Object.keys(prevData).length && enter === 0) {
								console.log(prevData);
								res.end(JSON.stringify(prevData));
							}
						}
					} else {
						//returns the unchanged data
						console.log(prevData);
						res.end(JSON.stringify(prevData));
					} 
				});
			} else if(val === Object.keys(data).length -1 && entered === 0) {
				//returns the unchanged data
				fs.readFile( __dirname + "/../data/orders.json", 'utf8', function (err, prevData) {
					console.log(JSON.parse(prevData));
					res.end(prevData);
				});
			}
		}
	});
});
//deletes an order with orderId
app.delete('/cancelOrder', (req, res) => {
	var orderId = req.body.orderId;
	//builds a new json list with all elements but the one with orderId
	fs.readFile( __dirname + "/../data/orders.json", 'utf8', function (err, data)
	{
		data = JSON.parse( data );
		i = 1;
		j = 1;
		found = 0;
		var newData = {};
		startingSize = Object.keys(data).length;
		for(i = 1; i <= startingSize; i++){
			if(!(data[i].orderId === orderId)) {
				newData[j] = data[i];
				j++;
			}
			//returns the build json object
			if(i === startingSize) {
				fs.writeFile(__dirname + "/../data/orders.json", JSON.stringify(newData), 'ascii', function (err, d) {
					console.log(newData);
					res.end(JSON.stringify(newData));
				});	
			}
		}
	});
});
//reads the orders.json file and returns it
app.get('/listAll', (req, res) => {
	fs.readFile( __dirname + "/../data/orders.json", 'utf8', function (err, data) {
		console.log( data );
		res.end(data);
	});
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


module.exports = app;