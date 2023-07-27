# dictatemd
A simple web app to add posts and search posts. 


To get started with the application, ensure Node.js and npm are installed on your machine. Navigate to the root directory of the project and run npm install to install all necessary dependencies for both the client and server.

The server runs on port 80 and can be started with the npm start command in the server directory. It connects to a MongoDB database hosted on the cloud, so there's no need to worry about setting up a local MongoDB instance.

The client runs on port 3000 and can also be started with the npm start command but in the client directory. The client allows users to upload documents and search for them.

During a search, the application first checks a simple cache to avoid unnecessary database queries. If the search term is not in the cache, the application queries the MongoDB database and stores the results in the cache for future queries.
