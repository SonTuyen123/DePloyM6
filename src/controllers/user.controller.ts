import mongoose from "mongoose";
import { Request, Response } from "express";
import Users from "../models/schemas/user.schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import BroadModels from "../models/schemas/Broad.schema";
import WorkSpace from "../models/schemas/WorkSpace.schema";

dotenv.config();
export class UserController {
  static async uploadAvatar(req: Request, res: Response) {
    let idUser = req.body.id;
    let image = req.body.image;
    Users.findOneAndUpdate(
      { _id: idUser },
      { $set: { image: image } },
      { new: true },
      (err, doc) => {
        if (err) {
          console.log(err);
        }
        res.status(200).json({
          message: "update thành công!",
        });
      }
    );
  }
  static async broadUpdate(req: Request, res: Response) {
    const idBroad = req.body._id;

    let newData = {
      title: req.body.title,
      mode: req.body.mode,
      columnOrder: req.body.columnOrder,
      columns: req.body.columns,
    };
    await BroadModels.findOneAndUpdate({ _id: idBroad }, newData);

    let newBroad = await BroadModels.findOne({
      _id: idBroad,
    });
  }
  static async broad(req: Request, res: Response) {
    const idUser = req.params.id;

    if (idUser) {
      let user = await Users.findById(idUser);
      let listBroad = await BroadModels.find({
        _id: user.listIdBroad,
      });
      let listWorkSpace = await WorkSpace.find({
        _id: user.listIdWorkSpace,
      });
      res.status(200).json({
        data: listBroad,
        listWorkSpace: listWorkSpace,
      });
    }
  }
  static async broadData(req: Request, res: Response) {
    console.log(req.body);

    const idBroad = req.params.id;

    const broadData = await BroadModels.findOne({
      _id: idBroad,
    });
    res.status(200).json({
      broad: broadData,
    });
  }

  //Thang lay du lieu 1 card - start
  static async dataAWorkspace(req: Request, res: Response) {
    const idAWorkspace = req.params.id;
    const dataAWorkspace = await WorkSpace.findOne({
      _id: idAWorkspace,
    });

    let user = await Users.find({ _id: dataAWorkspace.id_user }).select(
      " email "
    );

    let arr = [];
    for (let index = 0; index < dataAWorkspace.id_listIdBroad.length; index++) {
      let dataBoard = await BroadModels.findById({
        _id: dataAWorkspace.id_listIdBroad[index],
      });

      arr.push(dataBoard);
    }
    let dataUserId = [];
    for (let i = 0; i < arr.length; i++) {
      dataUserId.push(arr[i].useId);
    }
    if (user.length > 0) {
      return res.status(200).json({
        User: dataUserId,
        data: dataAWorkspace,
        User_admin: user[0].email,
      });
    } else {
      return res.status(200).json({
        User: dataUserId,
        data: dataAWorkspace,
        User_admin: "",
      });
    }
  }
  //end
  static async imageUser(req: Request, res: Response) {
    let id = req.params.id;
    let user = await Users.findOne({ _id: id });

    if (user.image) {
      return res.json({ message: user.image, name: user.name });
    } else {
      return res.json({ message: "Không có ảnh!", name: user.name });
    }
  }
  static async createWordSpace(req: Request, res: Response) {
    let data = req.body;
    let id = data.idUser;
    let workspaces = await WorkSpace.create({
      name: data.name,
      des: data.des,
      id_user: id,
    });
    let user = await Users.findOne({ _id: id });
    user.listIdWorkSpace.push(workspaces._id);
    await user.save();
    return res.status(200).json({ data: workspaces._id });
  }
  static async findUser(req: Request, res: Response) {
    let user = await Users.find();
    let email = [];
    user.forEach((item) => {
      email.push(item.email);
    });
    return res.status(200).json({ email: email });
  }

  static async sendEmail(req: Request, res: Response) {
    console.log(req.body);
    let emailMember = req.body.email;
    let emailAdmin = req.body.emailIdUser;
    let idBroad = req.body.idbroad;
    let dataIdbroad = await BroadModels.findById({ _id: idBroad });
    let workspace = await WorkSpace.findById({ _id: req.body.idWorkSpace });
    let data = {
      name: workspace.name,
      des: workspace.des,
    };
    let dataUserId = {
      role: req.body.role,
      email: emailMember,
    };
    let dataAdminUserId = {
      role: "admin",
      email: emailAdmin,
    };

    let uerMember = await Users.findOne({ email: emailMember });
    let arr = [];
    for (let index = 0; index < uerMember.listIdWorkSpace.length; index++) {
      let user = await WorkSpace.findOne({
        _id: uerMember.listIdWorkSpace[index],
      }).select("name");
      if (user) {
        arr.push(user);
      }
    }

    if (uerMember.listIdWorkSpace.length > 0) {
      console.log(1);
      for (let index = 0; index < uerMember.listIdWorkSpace.length; index++) {
        let user = await WorkSpace.findOne({
          _id: uerMember.listIdWorkSpace[index],
        });
        let flag = arr
          .map(function (e) {
            return e.name;
          })
          .indexOf(data.name);

        let idWork_space = arr.find((c) => c.name === data.name);

        if (flag != -1) {
          if (uerMember.listIdBroad.includes(dataIdbroad._id)) {
            console.log(2);
            return res
              .status(200)
              .json({ message: "Tài khoản đã tồn tại trong bảng" });
          } else {
            console.log(3);
            uerMember.listIdBroad.push(dataIdbroad._id);
            uerMember.save();
            let workspaceMember = await WorkSpace.findById({
              _id: idWork_space._id,
            });
            workspaceMember.id_listIdBroad.push(dataIdbroad._id);
            workspaceMember.save();
            let broad = await BroadModels.findById({ _id: idBroad });

            let flag = false;
            for (let i = 0; i < broad.useId.length; i++) {
              console.log(3.0);
              if (broad.useId[i].email === emailAdmin) {
                flag = true;
                break;
              }
            }
            if (flag) {
              console.log(3.1);
              broad.useId.push(dataUserId);
              broad.save();
              return res.status(200).json();
            } else {
              console.log(3.2);
              broad.useId.push(dataUserId);
              broad.useId.push(dataAdminUserId);
              broad.save();
              return res.status(200).json();
            }
          }
        } else {
          console.log(4);
          let WS = await WorkSpace.create({
            name: data.name,
            des: data.des,
            id_listIdBroad: dataIdbroad._id,
          });
          await WS.save();
          uerMember.listIdWorkSpace.push(WS._id);
          uerMember.listIdBroad.push(dataIdbroad._id);
          await uerMember.save();
          let broad = await BroadModels.findById({ _id: idBroad });
          let flag = false;
          let flag2 = false;
          for (let i = 0; i < broad.useId.length; i++) {
            if (broad.useId[i].email === emailAdmin) {
              flag = true;
              break;
            }
          }
          for (let index = 0; index < broad.useId.length; index++) {
            if (broad.useId[index].email === emailMember) {
              flag2 = true;
              break;
            }
          }
          if (flag && flag2) {
            return res
              .status(200)
              .json({ message: "Tài khoản đã tồn tại trong bảng" });
          } else if (flag) {
            broad.useId.push(dataUserId);
            broad.save();
            return res.status(200).json();
          } else if (flag2) {
            return res
              .status(200)
              .json({ message: "Tài khoản đã tồn tại trong bảng" });
          }
        }
      }
    } else {
      console.log(5);
      let WS = await WorkSpace.create({
        name: data.name,
        des: data.des,
        id_listIdBroad: dataIdbroad._id,
      });
      await WS.save();
      uerMember.listIdWorkSpace.push(WS._id);
      uerMember.listIdBroad.push(dataIdbroad._id);
      await uerMember.save();

      let broad = await BroadModels.findById({ _id: idBroad });
      if (broad.useId.length > 0) {
        let flag = false;
        for (let index = 0; index < broad.useId.length; index++) {
          if (broad.useId[index].email == emailAdmin) {
            flag = true;
            break;
          }
        }
        if (flag) {
          console.log(5, 3);
          broad.useId.push(dataUserId);
          broad.save();
          return res.status(200).json();
        }
      } else {
        broad.useId.push(dataUserId);
        broad.useId.push(dataAdminUserId);
        broad.save();
        return res.status(200).json();
      }
    }
  }

  static async dataMember(req: Request, res: Response) {
    let id = req.params.id;
    let broad = await BroadModels.findById({ _id: id });
    let UserID = broad.useId;
    let dataUser = [];
    for (let index = 0; index < UserID.length; index++) {
      let user = await Users.findOne({ email: UserID[index].email });

      dataUser.push(user);
    }

    return res.status(200).json({ user: dataUser });
  }
  static async ModeBoard(req: Request, res: Response) {
    let idBoard = req.params.id;

    let board = await BroadModels.findById({ _id: idBoard });

    return res.status(200).json({ mode: board.mode, userId: board.useId });
  }
  static async editModeBoard(req: Request, res: Response) {
    let idBoard = req.body.idBroad;
    let mailUser = req.body.email;

    let board = await BroadModels.findByIdAndUpdate(
      { _id: idBoard },
      { mode: "public", useId: [{ role: "admin", email: mailUser }] }
    );
    return res.status(200).json({ message: "Update success!" });
  }
  static async dataUserBoard(req: Request, res: Response) {
    let data = req.body;
  }
  static async getUserInBoard(req: Request, res: Response) {
    const data = req.body.data;

    let user = await Users.find({ email: { $in: data } }).select(
      "name email image"
    );
    return res.status(200).json({ data: user });
  }
  static async DeleteUserInBoard(req: Request, res: Response) {
    let data = req.body;
    let idboard = data.idboard;
    let emailUser = data.email;
    let idWorkSpace = data.idWorkSpace;
    let board = await BroadModels.find({ _id: idboard }).select("useId");
    for (let index = 0; index < board[0].useId.length; index++) {
      if (emailUser === board[0].useId[index].email) {
        board[0].useId.splice(index, 1);
        break;
      }
    }
    // let work_space = await WorkSpace.findById(idWorkSpace).select("name");
    // let user = await Users.findOne({ email: emailUser }).select(
    //   "listIdWorkSpace listIdBroad"
    // );
    // console.log(
    //   "🚀 ~ file: user.controller.ts ~ line 354 ~ UserController ~ DeleteUserInBoard ~ user",
    //   user.listIdBroad
    // );
    // for (let index = 0; index < user.listIdWorkSpace.length; index++) {
    //   let work_Space = await WorkSpace.findById({
    //     _id: user.listIdWorkSpace[index],
    //   }).select("_id name");
    //   // console.log(
    //   //   "🚀 ~ file: user.controller.ts ~ line 370 ~ UserController ~ DeleteUserInBoard ~ work_Space",
    //   //   work_Space
    //   // );
    //   if (work_Space.name === work_space.name) {
    //     // console.log(
    //     //   "🚀 ~ file: user.controller.ts ~ line 375 ~ UserController ~ DeleteUserInBoard ~ work_Space",
    //     //   work_Space._id
    //     // );
    //   }
    // }

    let user = await Users.findOne({ email: emailUser }).select(
      "listIdWorkSpace listIdBroad"
    );
    let work_space = await WorkSpace.findById(idWorkSpace);
    await BroadModels.updateOne({ _id: idboard }, { useId: board[0].useId });
    if (work_space.id_listIdBroad.length > 1) {
      for (let index = 0; index < work_space.id_listIdBroad.length; index++) {
        if (idboard == work_space.id_listIdBroad[index]) {
          console.log(1);
          work_space.id_listIdBroad.splice(index, 1);
          work_space.save();
          break;
        }
      }
      let a = user.listIdBroad.indexOf(idboard);
      user.listIdBroad.splice(a, 1);
      user.save();
      return res.status(200).json({ message: "delete thanh cong" });
    } else {
      console.log(2);
      // let user = await Users.findOneAndUpdate(
      //   { email: emailUser },
      //   { listIdWorkSpace: [], listIdBroad: [] }
      // );
      await WorkSpace.deleteOne({ _id: idWorkSpace });

      // for (let index = 0; index < user.listIdWorkSpace.length; index++) {
      //   if (idWorkSpace === user.listIdWorkSpace[index]) {
      //     user.listIdWorkSpace.splice(index, 1);
      //     break;
      //   }
      // }
      let a = user.listIdBroad.indexOf(idboard);
      user.listIdBroad.splice(a, 1);
      user.save();
      return res.status(200).json({ message: "delete thanh cong" });
    }
  }
}

export default new UserController();
