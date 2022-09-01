/* eslint-disable no-undef */
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../index");
const db = require("../../config/sql-db");

const { expect } = chai;
chai.use(chaiHttp);
describe("/POST reset", () => {
	const testEmail = process.env.TEST_ACCOUNT_USERNAME;
	var userId;
	it("it should POST a password reset token", (done) => {
		chai.request(app)
			.post("/reset")
			.send({ email: testEmail })
			.end(() => {
				db.query(`SELECT * FROM cloudclub.logins WHERE email='${testEmail}'`, (err1, result) => {
					userId = result[0].id;
					if (err1) { console.log(err1); expect.fail("Database error.") }
					if (result.length != 0) { 
						db.query(`SELECT * FROM cloudclub.password_reset WHERE user_id='${result[0].id}' ORDER BY request_timestamp DESC`, (err2, result2) => {
							if (err2) { console.log(err2); expect.fail("Database error.") }
							if (result2.length != 0) { 
								done();
							}
							else { expect.fail("Database Error: password reset token was not found."); }
						});
					}
					else { expect.fail("Database Error: unable to find test email."); }
				});
			});
	});

	after((done) => { 
		db.query(`DELETE FROM cloudclub.password_reset WHERE user_id='${userId}'`, (err3) => {
			if (err3) { console.log(err3);  }
			done();
		}); 
	});
});