const dataWorker = require("../data/userData");
const errorWorker = require("../errors/userControllerErr");
const bcrypt = require("bcrypt");

async function modifyUser(req, res, next) {
  const userId = req.params.id;
  const package = req.body;

  try {
    const hashed = bcrypt.hashSync(package.password, 12);
    package.password = hashed;

    await dataWorker.Update(package, userId);
    const purpose = "Update";
    const result = await dataWorker.GetResult(userId, purpose);

    return res.status(200).json({
      code: 200,
      message: "The user's info has been modified",
      result,
    });
  } catch (err) {
    err.message === "No User"
      ? errorWorker.getResult(err, res, next)
      : errorWorker.updateUser(err, res, next);
  }
}

async function removeUser(req, res, next) {
  const userId = req.query.id;

  try {
    await dataWorker.Destroy(userId);
    const purpose = "Delete";
    await dataWorker.GetResult(userId, purpose);
    return res.status(203).json({
      code: 203,
      message: "The user's info has been removed",
    });
  } catch (err) {
    errorWorker.getResult(err, res, next);
  }
}

module.exports = { modifyUser, removeUser };
