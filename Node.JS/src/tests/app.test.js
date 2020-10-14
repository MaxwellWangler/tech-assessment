//Ran out of time, couldn't get full test coverage of edge cases but each endpoint is tested.
const request = require('supertest');
const app = require('../app');
const fs = require("fs");

test('Should return 200 status', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
});

test('Test response text', async () => {
    const response = await request(app).get('/health');
    expect(response.text).toBe('You keep using that word. I do not think it means what you think it means.');
});

//tests if the correct values are returned
test('Test listAll', async () => {
	const response = await request(app).get('/listAll');
	var json_response = JSON.parse(response.text);
	expect(json_response[1].lastName + ' ' + json_response[1].firstName + ' ' + json_response[1].itemId + ' ' + json_response[1].numberOfItems).toBe('Rogers Steve 085 2');
	expect(json_response[2].lastName + ' ' + json_response[2].firstName + ' ' + json_response[2].itemId + ' ' + json_response[2].numberOfItems).toBe('Danvers Carol 009 10');
	expect(json_response[3].lastName + ' ' + json_response[3].firstName + ' ' + json_response[3].itemId + ' ' + json_response[3].numberOfItems).toBe('Stark Tony 750 1');
});

//adds a new order, checks to see if it correct, recordeds the orderId and then deletes it
test('Test addOrder', async () => {
	const data = {
		"lastName": "Rogers",
		"firstName": "Steve",
		"itemId": "085",
		"numberOfItems": "2",
	}
	const response = await request(app).post('/addOrder').send(data);
	var json_response = JSON.parse(response.text);
	expect(json_response[4].lastName + ' ' + json_response[4].firstName + ' ' + json_response[4].itemId + ' ' + json_response[4].numberOfItems).toBe('Rogers Steve 085 2');
	const undoData = {
		"orderId" : json_response[4].orderId,
	}
	await request(app).delete('/cancelOrder').send(undoData);
});

//updates an order, checks it and then changes it back.
test('Test updateOrder', async () => {
	const data = {
		"orderId": "40000",
		"lastName": "Danvers",
		"firstName": "Carol",
		"itemId": "705",
		"numberOfItems": "5",
	}
	const undoData = {
		"orderId": "40000",
		"lastName": "Rogers",
		"firstName": "Steve",
		"itemId": "085",
		"numberOfItems": "2",
	}
	const response = await request(app).put('/updateOrder').send(data);
	var json_response = JSON.parse(response.text);
	expect(json_response[1].lastName + ' ' + json_response[1].firstName + ' ' + json_response[1].itemId + ' ' + json_response[1].numberOfItems).toBe('Danvers Carol 705 5');
	await request(app).put('/updateOrder').send(undoData);
});

//adds a new order, checks to make sure it was add, deletes it and then checks if it is back to the orgininal state.
test('Test cancelOrder', async () => {
	expected = await request(app).get('/listAll');
	json_expected = expected.text;
	const dataToAdd = {
		"lastName": "Danvers",
		"firstName": "Carol",
		"itemId": "705",
		"numberOfItems": "5",
	}
	const added = await request(app).post('/addOrder').send(dataToAdd);
	json_added = JSON.parse(added.text);
	expect(added.text === expected.text).toBe(false);
	const data = {
		"orderId" : json_added[4].orderId,
	}
	const response = await request(app).delete('/cancelOrder').send(data);
	expect(response.text).toBe(json_expected);
	
});
