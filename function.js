require("dotenv").config();
var openwhisk = require("openwhisk");
var fs = require("fs");
var randomWords = require("random-words");
const res = require("express/lib/response");

var ow = openwhisk();

async function listActions() {
	return ow.actions.list();
}

function getActionDetails() {
	ow.actions
		.get(name)
		.then((result) => {})
		.catch((err) => {
			console.error("failed to create action", err);
		});
}

function createAction(body, kind) {
	const namespace = "cloudspace";
	const name = randomWords();
    let language = "nodejs:default";
    if (kind === "Python") language = "python:default"

	var action = Buffer.from(body, "utf-8").toString();
	ow.actions
		.update({
			name,
			action,
            kind: language,
			annotations: { "web-export": true },
		})
		.catch((err) => {
			if (process.env.DEBUGLOG) {
				console.log(err);
			}
			throw "Error obtaining serverless function.";
		});
	return name;
}

function deleteAction(name) {
	ow.actions.delete(name).catch((err) => {
		if (process.env.DEBUGLOG) {
			console.log(err);
		}
		throw "Error obtaining serverless function.";
	});
}

// Create function
const create = async function (code, kind) {
	const result = createAction(code, kind);
	return result;
};

// Get its details
const details = async function () {
	const result = await getActionDetails();
};

// List functions
const list = async function () {
	const result = await listActions();
	return result;
};

// Remove function
const remove = async function (name) {
	const result = await deleteAction(name);
	return result;
};

module.exports = { create, list, remove };
