import { body, validationResult } from "express-validator";

export const validateUserSignUp = [
  body("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("User name must be within 3 to 20 charater"),
  body("email")
    .normalizeEmail({ gmail_remove_dots: false })
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage(
      "Password is empty ! Password must be 4 to 20 characters long !"
    ),
  body("confirmpassword")
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
];
export const userValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();
  const error = [];
  for (let i = 0; i < result.length; i++) {
    const data = {
      nameErr: result[i].param,
      error: result[i].msg,
    };
    error.push(data);
  }
  // console.log(error);
  res.json({ success: false, message: error });
};
