import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

export class ConnectDB {
  async connect() {
    await mongoose.connect(
      "mongodb+srv://case4:123456a@cluster0.vkbuyj0.mongodb.net/case20"
    );
  }
}
