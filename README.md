# node-chat-app
All commands will be executed in root directory of a project.

## Installation
### Download

As a [ZIP archive](https://github.com/MysticEyeBlink/node-chat-app/archive/master.zip) or clone in GIT:
```
    git clone https://github.com/MysticEyeBlink/node-chat-app.git
```
### Get libraries
- npm (node.js libraries)
```
    npm install
    npm install -g nodemon
```
- bower (3rd party front-end libraries)
```
    npm install -g bower
    bower install
```

### Mongo DB initialization and running
- mongo ver. 3.0.x

Change db, add user to Mongo and go on:

```
    use chat
    db.createUser({ user: "chat", pwd: "pass", roles: [ "readWrite", "dbAdmin" ]})
```
## Running
- Gulp

At first you should start Gulp task runner:
```
    gulp
```
- nodemon

... and then in different window run the project
```  
    nodemon appliaction.js
```
