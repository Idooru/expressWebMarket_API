const dataWorker = require("../data/userData");

async function modifyUser(req, res, next) {
  const paramsId = req.params.id;
  const package = req.body;
  let result;

  try {
    await dataWorker.Update(package, paramsId);
    result = await dataWorker.GetResult(paramsId);
  } catch (err) {
    if (err.message === "same User") {
      console.error(err);
      return res.status(401).json({
        code: 401,
        message: "A user with the same name exists",
      });
    } else if (err.message === "form Null") {
      console.error(err);
      return res.status(401).json({
        code: 401,
        message: "One of the forms is not filled in",
      });
    }
    return next(err);
  }

  return res.status(200).json({
    code: 200,
    message: "The user's info has been modified",
    result,
  });
}

async function removeUser(req, res, next) {
  const paramsId = req.params.id;

  try {
    await dataWorker.Destroy(paramsId);
  } catch (err) {
    console.error(err);
    return next(err);
  }

  return res.status(203).json({
    code: 203,
    message: "The user's info has been removed",
  });
}

module.exports = { modifyUser, removeUser };
