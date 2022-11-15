import { checkToken } from "../middleware/checkToken";
import { UserController } from "../controllers/user.controller";
import express, { NextFunction } from "express";
import { Router, Request, Response } from "express";
import Users from "../models/schemas/user.schema";
import { ObjectId } from "mongoose";
const userRouter = express.Router();

// userRouter.use(checkToken);
userRouter.post(
  "/upload-avatar",
  (req: Request, res: Response, next: NextFunction) => {
    UserController.uploadAvatar(req, res).catch((err) => {
      next(err);
    });
  }
);
userRouter.post(
  "/broad-update/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    UserController.broadUpdate(req, res).catch((err) => {
      next(err);
    });
  }
);
userRouter.get(
  "/broad/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    UserController.broad(req, res).catch((err) => {
      next(err);
    });
  }
);

userRouter.get(
  "/broad-data/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    UserController.broadData(req, res).catch((err) => {
      next(err);
    });
  }
);
userRouter.get(
  "/image/:id",
  (req: Request, res: Response, next: NextFunction) => {
    UserController.imageUser(req, res).catch((err) => {
      next(err);
    });
  }
);
userRouter.post(
  "/create-work-space",
  (req: Request, res: Response, next: NextFunction) => {
    UserController.createWordSpace(req, res).catch((err) => {
      next(err);
    });
  }
);
userRouter.get("/find", (req: Request, res: Response, next: NextFunction) => {
  UserController.findUser(req, res).catch((err) => {
    next(err);
  });
});
userRouter.post(
  "/send-email",
  (req: Request, res: Response, next: NextFunction) => {
    UserController.sendEmail(req, res).catch((err) => {
      next(err);
    });
  }
);
userRouter.post(
  "/data-member/:id",
  (req: Request, res: Response, next: NextFunction) => {
    UserController.dataMember(req, res).catch((err) => {
      next(err);
    });
  }
);
userRouter.get(
  "/data-a-workspace/:id",
  (req: Request, res: Response, next: NextFunction) => {
    UserController.dataAWorkspace(req, res).catch((err) => {
      next(err);
    });
  }
);
userRouter.post(
  "/mode-board/:id",
  (req: Request, res: Response, next: NextFunction) => {
    UserController.ModeBoard(req, res).catch((err) => {
      next(err);
    });
  }
);
userRouter.post(
  "/edit-mode-board",
  (req: Request, res: Response, next: NextFunction) => {
    UserController.editModeBoard(req, res).catch((err) => {
      next(err);
    });
  }
);
userRouter.post(
  "/board-data-user",
  (req: Request, res: Response, next: NextFunction) => {
    UserController.dataUserBoard(req, res).catch((err) => {
      next(err);
    });
  }
);

userRouter.post(
  "/member-in-board",
  (req: Request, res: Response, next: NextFunction) => {
    UserController.getUserInBoard(req, res).catch((err) => {
      next(err);
    });
  }
);
userRouter.post(
  "/delete-user-board",
  (req: Request, res: Response, next: NextFunction) => {
    UserController.DeleteUserInBoard(req, res).catch((err) => {
      next(err);
    });
  }
);
export default userRouter;
