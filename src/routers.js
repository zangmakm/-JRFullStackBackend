const express = require("express");
const router = express.Router();
const userRouter = require("./routers/user");
const authRouter = require("./routers/auth");
const authGuard = require("./middlewares/authGuard");
const orderRouter = require("./routers/order");
const clientRouter = require("./routers/client");
const builderRouter = require("./routers/builder");
const commentRouter = require("./routers/comment");

router.use("/users", userRouter);
router.use("/auth", authRouter);

router.use("/clients", clientRouter);
router.use("/builders", builderRouter);
router.use("/orders", orderRouter);
router.use("/comments", commentRouter);

module.exports = router;
