// routes to handle customer requests

import { Router } from "express";
import UserLogic from "../logic/UserLogic.js";
import authenticate from "../middleware/AuthMiddleware.js";
var UserHandler = Router();

UserHandler.get("/list", function (req, res) {
  const params= req.query;
  UserLogic.list(params, (result) =>{
    res.status(result.status).json(result);
  });
});

UserHandler.post("/create", function (req, res) {
 
  UserLogic.create(req.body, function (result) {
    res.json(result);
  });
});

UserHandler.post("/login", function (req, res) {
  UserLogic.login(req.body, function (result) {
    res.json(result);
  });
});

UserHandler.post('/update', (req, res) => {
  UserLogic.update(req.body, (result) => {
    res.status(result.status).json(result);
  });
});

UserHandler.delete('/delete/:userID', (req, res) => {
    const body = { userID: req.params.userID };
    UserLogic.deleteUser(body, (result) => {
        res.status(result.status).json(result);
    });
});

UserHandler.get("/details/:userId", function (req, res) {
  UserLogic.findById(req.params.userId, function (result) {
    res.json(result);
  });
});
 

UserHandler.post("/password/reset", (req, res) => {
  UserLogic.resetPassword(req.body, (results) => {
    res.json(results);
  });
});


 

export default UserHandler;