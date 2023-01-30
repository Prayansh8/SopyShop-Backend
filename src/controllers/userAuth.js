const { db } = require("../databases/index");
const catchAsyncErrors = require("../middlewere/catchAsyncErrors");

const getUsers = async (req, res) => {
  const data = await db.user.find({}, { name: 1, userName: 1, email: 1 });
  return res.send(data);
};

const getUser = async (req, res) => {
  const userId = req.params._id;
  const data = await db.user.findOne(userId, {
    name: 1,
    userName: 1,
    email: 1,
  });
  return res.send(data);
};

const updateUser = async (req, res) => {
  const userId = req.params._id;
  if (req.user._id != userId) {
    return res.send("user are unothorised");
  }
  const data = await db.user.findByIdAndUpdate(
    { userId },
    { name: 1, userName: 1, email: 1 }
  );
  return res.send(data);
};

const deleteUser = async (req, res) => {
  const userId = req.params._id;
  if (req.user._id != userId) {
    return res.send("user are unothorised");
  }
  const data = await db.user.findByIdAndDelete(userId);
  return res.send({ detail: "User Deleted" });
};

// logOut user
const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).send({ success: true, massage: "Logged Out User" });
});

module.exports = {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  logoutUser,
};
