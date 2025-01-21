# picVenture

## Overview

A website created by Ivy Yip, Hailey Lin, and Carol Li

## API endpoint documentation

Existing endpoints:
Get:

```
/user: get user information by user_id, expects query {userid: {insert_userid}}
/picturesbyuser: get all pictures uploaded by the user based on user_id, expects query {userid: {insert_userid}}
/group: get all groups user is in based on user_id, expects query {userid: {insert_userid}}
/code: generates a unique group code, does not expect any query
```

Post:

```
/upload: upload photo to AWS and mongoDB, expects FormData, advise not to change handleSubmit in Home.jsx
/update-bio: unsure (HAILEY PLZ ADVISE)
/newgroup: creating a new group, expects body containing {join_code: string, group_name: string, users: array}
/join: adding the new joining user to the existing group, expects body containing {join_code: string, userId: string}
```

## What you need to change in the skeleton

- Change the Frontend CLIENT_ID (Skeleton.js) to your team's CLIENT_ID (obtain this at https://bit.ly/gauth-mit) (done)
- Change the Server CLIENT_ID to the same CLIENT_ID (auth.js) (done)
- Change the Database SRV (mongoConnectionURL) for Atlas (server.js). You got this in the MongoDB setup. remember to replace <password> and <dbname> (should be no < or > in your SRV) (From: https://bit.ly/mongo-setup) (done)
- Change the Database Name for MongoDB to whatever you put in the SRV to replace <dbname> (server.js) (done)
- (Optional) Add a favicon to your website at the path client/dist/favicon.ico
- (Optional) Update website title in client/dist/index.html (done)
- (Optional) Update this README file ;)
- (Optional) Update the package.json file with your app name :) (line 2) (done)

## How to run this skeleton

First, 'npm install'
Then open two separate terminals, and 'npm run dev' in the first, and 'npm start' in the second.
Then open http://localhost:5173
Ask Ivy for the most recent .env file

<!-- ## How to go from this skeleton to your actual app

Check out this [How to Get Started Guide](http://weblab.is/get-started) -->

## Socket stuff

Note: we'll be getting to this in lecture in week 2, so don't worry if you don't know it yet

- If you're not using realtime updating or don't need server->client communication, you can remove socket entirely! (server-socket.js, client-socket.js, and anything that imports them)
- If you are using sockets, consider what you want to do with the FIXME in server-socket.js

## Edit at your own risk

the following files students do not need to edit. feel free to read them if you would like.

```
client/src/utilities.js
client/src/client-socket.js
server/validator.js
server/server-socket.js
.npmrc
.prettierrc
package-lock.json
vite.config.js
```
