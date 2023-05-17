Here's the steps to run the Stellar MLS database, all the commands will be in bash terminal.

1. Download the latest information from the Stellar MLS API into a CSV file by using the following command:
   node downloadAPI.js
   This will take approximately 30min to an hour to complete.

2. Now you should have a file in the file tree called "data.csv". This is the full pull of "Active" listings and all the categories

3. Now you'll want to insert that data into your MySQL Database. The database should be called "stellardb" and have a password of "password". If your MySQL database is set up correctly, you can now run the following command:
    python addToDatabase.py
    This will take approximately 5 minutes to complete.

4. Now you should have a database with all the information from the Stellar MLS API. You can now run the following command to start the server:
    node server.js
    This will start the server

5. Now that the server is running, in another bash terminal, start the app by running the following command:
    npm start
    This will start the app