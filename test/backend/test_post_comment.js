/* eslint-disable no-undef */
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../index");
const db = require("../../config/sql-db");

const { expect } = chai;
chai.use(chaiHttp);
describe("/POST comment", () => {
	const testEmail = process.env.TEST_ACCOUNT_USERNAME;
	var userId;
	var postId;
	before((done) => {
		db.query(`SELECT * FROM cloudclub.logins WHERE email='${testEmail}'`, (err1, result) => {
			userId = result[0].id;
			if (err1) { console.log(err1); expect.fail("Database error.") }
			if (result.length != 0) { 
				// Create a sample post
				let query = "INSERT INTO cloudclub.forum (userid, subject, body) VALUES (?,?,?)";
				let subject = "Sample Subject";
				let body = "Sample Body";
				db.query(query, [userId, subject, body], (err2) => {
					if (err2) { console.log(err2); expect.fail("Database error.") }
					// get postId
					db.query(`SELECT * FROM cloudclub.forum WHERE subject='${subject}'`, (err3, result2) => {
						if (err3) { console.log(err3); expect.fail("Database error.") }
						postId = result2[0].postid;
						done();
					});
				});
			}
			else { expect.fail("Database Error: unable to find test email."); }
		});
	})
	it("it should POST a comment", (done) => {
		chai.request(app)
			.post("/comment")
			.set("Cookie", `connect.sid=${process.env.TEST_COOKIE}`)
			.send({
				content: "Sample Content",
				post_id: postId,
				camefrom: "Test"
			})
			.end((err, res) => {
				if (err) console.log(err);
				if (res) console.log(res.status);
				db.query(`SELECT * FROM cloudclub.comments WHERE post_id='${postId}'`, (err1, result) => {
					if (err1) { console.log(err1); expect.fail("Database error.") }
					expect(result[0].content).to.equal("Sample Content");
					done();
				});
			});
	});

	after((done) => { 
		db.query(`DELETE FROM cloudclub.forum WHERE postid='${postId}'`, (err1) => {
			if (err1) { console.log(err1);  }
			db.query(`DELETE FROM cloudclub.comments WHERE post_id='${postId}'`, (err2) => {
				if (err1) { console.log(err2);  }
				done();
			});
		}); 
	});
});