## Database setup

The cloud-club-website database relies on the db-migrate NPM module for revision control. All migrations are stored in the migrations directory.

## First time setup

1. Install XAMPP from the link provided in the root Readme.

2. Open the XAMPP Control Panel.

3. Click on the Start buttons for Apache and MySQL. (Fig 1.) This step will turn on the MySQL database and the Apache server.


4. In your browser, navigate to http://localhost/phpmyadmin/

5. In the left sidebar, click on New. (Fig. 2)

6. Enter `cloudclub` in the textbox and click on Create (Fig. 3).

7. In a terminal navigate to where you have clones this repository.

8. Run `npm i` in the command line to install all packages.

9. Run at the root of the repository: `npx db-migrate up --config ./database/database.json`. The .env file is required to perform this step.

10. Refresh the phpmyadmin page to ensure that there are new tables inside it. (Fig 4.)



## Figures

### Figure 1.

![Figure 1](./../docs/docimg/db_figure_1.png)

### Figure 2.

![Figure 2](./../docs/docimg/db_figure_2.png)

### Figure 3.

![Figure 3](./../docs/docimg/db_figure_3.png)

### Figure 4.

![Figure 4](./../docs/docimg/db_figure_4.png)

### Troubleshooting - Only Follow if you Run into these Specific Errors!
If you get this error (in red) when starting MySQL on XAMPP: 
```
8:06:45 PM  [mysql] 	Problem detected!
8:06:45 PM  [mysql] 	Port 3306 in use by ""C:\Program Files\MariaDB 10.11\bin\mysqld.exe" "--defaults-file=C:\Program Files\MariaDB 10.11\data\my.ini" "MariaDB""!
8:06:45 PM  [mysql] 	MySQL WILL NOT start without the configured ports free!
8:06:45 PM  [mysql] 	You need to uninstall/disable/reconfigure the blocking application
8:06:45 PM  [mysql] 	or reconfigure MySQL and the Control Panel to listen on a different port
```

and `localhost/phpmyadmin` is displaying a series of errors including this: `mysqli::real_connect(): (HY000/2054): The server requested authentication method unknown to the client [auth_gssapi_client]`

Follow this video to resolve error: https://www.youtube.com/watch?v=8-8CYHJBCeQ

After following the steps to the video, navigating to `http://localhost/phpmyadmin/` you should see the regular database page.




