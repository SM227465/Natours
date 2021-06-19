const express = require("express");
// const multer = require("multer");
const userController = require("../controllers/user");
const authController = require("../controllers/auth");

const router = express.Router();

// Signup, Login, Logout routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

// Forgot & Reset password routes
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

/* Adding a piece of middleware to execute rest of the code only for Authorized user just because middleware run in sequence*/
router.use(authController.protect);

// Change/Update password route
router.patch("/updateMyPassword", authController.updatePassword);

// Get won profile information route
router.get("/me", userController.getMe, userController.getUser);

// Update information of won profile route
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
// Delete won profile route
router.delete("/deleteMe", userController.deleteMe);

/* Adding another piece of middleware that indicate execution of rest of the code should be done by only admin */
router.use(authController.restrictTo("admin"));

router.route("/").get(userController.getUsers).post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
