define({ "api": [
  {
    "type": "get",
    "url": "/logout",
    "title": "Logout and destroy user session.",
    "name": "GET-logout",
    "group": "Authentication",
    "success": {
      "fields": {
        "302": [
          {
            "group": "302",
            "optional": false,
            "field": "redirects",
            "description": "<p>to landing page (‘/’)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "Internal",
            "description": "<p>Server Error 500</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/GET-logout.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/login",
    "title": "Login to the website",
    "name": "POST-login",
    "group": "Authentication",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "message",
            "description": "<p>Login Successful.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "Missing",
            "description": "<p>data, request must include all of: email, password.</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "Password",
            "description": "<p>incorrect.</p>"
          },
          {
            "group": "401",
            "optional": false,
            "field": "Email",
            "description": "<p>not found.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "Internal",
            "description": "<p>Server Error 500.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/POST-login.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/register",
    "title": "Register an account",
    "name": "POST-register",
    "group": "Authentication",
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "optional": false,
            "field": "message",
            "description": "<p>Successfully registered, you may now login.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "Missing",
            "description": "<p>data, request must include all of: email, password, first, last.</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "Password",
            "description": "<p>too weak! Must be at least 8 characters and have at least one of each: capital letter, lowercase letter, number.</p>"
          }
        ],
        "409": [
          {
            "group": "409",
            "optional": false,
            "field": "User",
            "description": "<p>already exists with that email!</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "Internal",
            "description": "<p>Server Error 500.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/POST-register.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "/members",
    "title": "Get list of all of CloudClub’s members.",
    "name": "GET-members",
    "group": "ClubMembers",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>Member list</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.name",
            "description": "<p>Name of Members</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.bio",
            "description": "<p>Members Biography</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "You",
            "description": "<p>are not authorized to perform this action.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "Internal",
            "description": "<p>Server Error 500.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/GET-members.js",
    "groupTitle": "ClubMembers"
  },
  {
    "type": "get",
    "url": "/latest?num=:num",
    "title": "Get the latest forum posts",
    "name": "GET-latest",
    "group": "Forum",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "num",
            "description": "<p>integer between 1 and 100, determines the number of posts to return</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>Posts sorted by timestamp descending</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.postid",
            "description": "<p>Post ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.userid",
            "description": "<p>User ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.subject",
            "description": "<p>Post Title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.body",
            "description": "<p>Post Body</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.timestamp",
            "description": "<p>Timestamp of post YYYY-MM-DD HH-MM-SS</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "You",
            "description": "<p>are not authorized to perform this action.</p>"
          }
        ],
        "422": [
          {
            "group": "422",
            "optional": false,
            "field": "Request",
            "description": "<p>out of range, must be between 0 and 100.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "Internal",
            "description": "<p>Server Error 500.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/GET-latest.js",
    "groupTitle": "Forum"
  },
  {
    "type": "get",
    "url": "/post?id=:postid",
    "title": "Get a single post",
    "name": "GET-post",
    "group": "Forum",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>post ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.postid",
            "description": "<p>Post ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.userid",
            "description": "<p>User ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.subject",
            "description": "<p>Post Title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.body",
            "description": "<p>Post Body</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.timestamp",
            "description": "<p>Timestamp of post YYYY-MM-DD HH-MM-SS</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "You",
            "description": "<p>are not authorized to perform this action.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/GET-post.js",
    "groupTitle": "Forum"
  },
  {
    "type": "get",
    "url": "/posts",
    "title": "Get all posts titles",
    "name": "GET-posts",
    "group": "Forum",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>List of posts</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.postid",
            "description": "<p>Post ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.userid",
            "description": "<p>User ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.subject",
            "description": "<p>Post Title</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.timestamp",
            "description": "<p>Timestamp of post YYYY-MM-DD HH:MM:SS</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "You",
            "description": "<p>are not authorized to perform this action.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "Internal",
            "description": "<p>Server Error 500.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/GET-posts.js",
    "groupTitle": "Forum"
  },
  {
    "type": "post",
    "url": "/newpost",
    "title": "Create a new forum post",
    "name": "POST-newpost",
    "group": "Forum",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "message",
            "description": "<p>Post created successfully.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "Missing",
            "description": "<p>data, request must include all of: subject, body.</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "You",
            "description": "<p>are not authorized to perform this action.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "optional": false,
            "field": "Internal",
            "description": "<p>Server Error 500.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/POST-newpost.js",
    "groupTitle": "Forum"
  }
] });
