define({ "api": [
  {
    "type": "get",
    "url": "/auth",
    "title": "Check Auth State",
    "description": "<p>Get the authentication state associated with the current session.</p>",
    "name": "GET-auth",
    "group": "Authentication",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email associated with the current session</p>"
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
            "field": "-",
            "description": "<p>Indicates that there is no authentication state currently active (i.e. the user is not logged in)</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Internal Server Error 500&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/GET-auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "get",
    "url": "/logout",
    "title": "Log Out",
    "description": "<p>Log out from the website, destroying the session.</p>",
    "name": "GET-logout",
    "group": "Authentication",
    "success": {
      "fields": {
        "302": [
          {
            "group": "302",
            "type": "Redirect",
            "optional": false,
            "field": "Redirect",
            "description": "<p>Redirects to previous page (acts as a refresh).</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Internal Server Error 500&quot;</p>"
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
    "title": "Log In",
    "description": "<p>Log in to the website. Destroys any existing session.</p>",
    "name": "POST-login",
    "group": "Authentication",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User's Password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Login Successful!&quot;</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Missing fields, check our API docs at cloudclub.ca/api&quot;</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Password incorrect.&quot;</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Internal Server Error 500.&quot;</p>"
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
    "title": "Register",
    "description": "<p>Register an account.</p>",
    "name": "POST-register",
    "group": "Authentication",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User's Password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "first",
            "description": "<p>User's First Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "last",
            "description": "<p>User's Last Name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Successfully registered, you may now login.&quot;</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Missing fields, check our API docs at cloudclub.ca/api&quot;</p>"
          }
        ],
        "409": [
          {
            "group": "409",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;User already exists with that email!&quot;</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Internal Server Error 500&quot;</p>"
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
    "title": "Get Members",
    "description": "<p>Get a list of all of CloudClub’s team members.</p>",
    "name": "GET-members",
    "group": "Club_Members",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;All members fetched successfully.&quot;</p>"
          },
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
            "description": "<p>Member Name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.bio",
            "description": "<p>Member Bio</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;You are not authorized to perform this action.&quot;&quot;</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Internal Server Error 500&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/GET-members.js",
    "groupTitle": "Club_Members"
  },
  {
    "type": "get",
    "url": "/latest?num=:num",
    "title": "Get Latest Posts",
    "description": "<p>Get the latest <code>num</code> forum posts, with content, sorted by timestamp (latest first).</p>",
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
            "description": "<p>The number of posts to return (an integer between 1 and 100).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Latest <code>num</code> posts fetched successfully without body.&quot;</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>Latest <code>num</code> posts, sorted by timestamp (descending).</p>"
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
            "description": "<p>ID of user who submitted the post</p>"
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
            "description": "<p>Post Content (Markdown)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "data.timestamp",
            "description": "<p>Post Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;You are not authorized to perform this action.&quot;</p>"
          }
        ],
        "422": [
          {
            "group": "422",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Request out of range, check our API docs at cloudclub.ca/api&quot;</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Internal Server Error 500&quot;</p>"
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
    "title": "Get Single Post",
    "description": "<p>Fetch a single post by ID, with content.</p>",
    "name": "GET-post",
    "group": "Forum",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-100",
            "optional": false,
            "field": "id",
            "description": "<p>Post ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Post <code>id</code> fetched successfully.&quot;</p>"
          },
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
            "description": "<p>Post Content (Markdown)</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.timestamp",
            "description": "<p>Post Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;You are not authorized to perform this action.&quot;</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Internal Server Error 500&quot;</p>"
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
    "title": "Get All Posts (Metadata)",
    "description": "<p>Fetch <strong>ALL</strong> posts, without content, sorted by timestamp (latest first).</p>",
    "name": "GET-posts",
    "group": "Forum",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;All posts fetched successfully without body.&quot;</p>"
          },
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
            "description": "<p>Post Timestamp</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>You are not authorized to perform this action.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Internal Server Error 500&quot;</p>"
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
    "title": "New Post",
    "description": "<p>Create a new post.</p>",
    "name": "POST-newpost",
    "group": "Forum",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "subject",
            "description": "<p>Post Title</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body",
            "description": "<p>Post Content (Markdown)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Post created successfully.&quot;</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Missing fields, check our API docs at cloudclub.ca/api&quot;</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;You are not authorized to perform this action.&quot;</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Internal Server Error 500&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/POST-newpost.js",
    "groupTitle": "Forum"
  },
  {
    "type": "put",
    "url": "/editpost",
    "title": "Edit Post",
    "description": "<p>Edit a post.</p>",
    "name": "PUT-editpost",
    "group": "Forum",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "subject",
            "description": "<p>Post Title</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body",
            "description": "<p>Post Content (Markdown)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>&quot;Post edited successfully.&quot;</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Missing fields, check our API docs at cloudclub.ca/api&quot;</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;You are not authorized to perform this action.&quot;</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>&quot;Internal Server Error 500&quot;</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/PUT-editpost.js",
    "groupTitle": "Forum"
  }
] });
