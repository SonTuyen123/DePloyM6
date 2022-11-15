import express from "express";
import { Router, Request, Response } from "express";
const authRouter = express.Router();
import { userValidation, validateUserSignUp } from "../middleware/validation";
import { AuthController } from "../controllers/auth.controller";
import Users from "../models/schemas/user.schema";

authRouter.post("/login", (req, res, next) => {
  AuthController.login(req, res).catch((err) => {
    next(err);
  });
});
authRouter.post(
  "/register",
  validateUserSignUp,
  userValidation,
  (req, res, next) => {
    AuthController.register(req, res).catch((err) => {
      next(err);
    });
  }
);

authRouter.post("/verify", (req, res, next) => {
  AuthController.verify(req, res).catch((err) => {
    next(err);
  });
});
authRouter.post("/token", (req, res, next) => {
  AuthController.token(req, res).catch((err) => {
    next(err);
  });
});
authRouter.post("/google", (req, res, next) => {
  AuthController.registerGoogle(req, res).catch((err) => {
    next(err);
  });
});
authRouter.post("/resetPassword", (req, res, next) => {
  AuthController.resetPass(req, res).catch((err) => {
    next(err);
  });
});

authRouter.post("/broad", async (req: Request, res: Response, next) => {
  AuthController.board(req, res).catch((err) => {
    next(err);
  });
});

export default authRouter;
