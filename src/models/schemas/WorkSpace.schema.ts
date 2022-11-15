import mongoose, { Schema } from "mongoose";

const workSpaceSchemas = new mongoose.Schema({
  id_user: String,
  name: String,
  des: String,
  id_listIdBroad: Array,
});

const WorkSpace = mongoose.model("workspaces", workSpaceSchemas);

export default WorkSpace;
