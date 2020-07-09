const express = require('express');
const bodyParser = require('body-parser');

const profileRouter = express.Router();

profileRouter.use(bodyParser.json());

profileRouter.route('/')
.get((req, res, next) => {
    res.end('Retrieves profile details and all tweets and replies');
})  
.post((req, res, next) => {
    res.end("Adding post: " + req.body.post + "\nAdding Comment: " + req.body.comment);
})  
.put((req, res, next) => {
    res.end("Editing Comment: " + req.body.comment);
})
.delete((req, res, next) => {
    res.end("Delete operation not allowed on /home");
});
    
module.exports = profileRouter;