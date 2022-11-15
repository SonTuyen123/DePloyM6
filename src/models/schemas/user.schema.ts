import mongoose, { Schema } from "mongoose";

const userSchemas = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  email_verify: String,
  google_id: String,
  image: String,
  password: String,
  listIdBroad: Array,
  listIdWorkSpace: Array, 
});



const Users = mongoose.model("Users", userSchemas);

export default Users;
