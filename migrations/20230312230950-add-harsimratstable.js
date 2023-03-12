"use strict";

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = function(db, callback) {
	// create the comments table
	db.createTable("harsimrat", {
		age: {
			type: "int",
			notNull: true,
			primaryKey: true,
			autoIncrement: true
		},
		id: {
			type: "int",
			notNull: true,
		},
		id_number_2: {
			type: "int",
			notNull: true
		},
		name: {
			type: "string",
			notNull: true
		},
		/* eslint-disable */
    	timestamp: {
			type: "timestamp",
			notNull: true,
			defaultValue: new String("current_timestamp()")
		}
  }, callback);
};

exports.down = function(db, callback) {
	db.dropTable("harsimrat", callback);
};

exports._meta = {
	"version": 1
};
