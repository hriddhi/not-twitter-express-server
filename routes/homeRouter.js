const express = require('express');
const bodyParser = require('body-parser');

const homeRouter = express.Router();

homeRouter.use(bodyParser.json());

homeRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})  
.get((req, res, next) => {
    res.end('Retrieves all the post and shows then in the homepage');
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
    
module.exports = homeRouter;