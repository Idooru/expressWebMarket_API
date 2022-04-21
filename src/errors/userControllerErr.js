exports.updateUser = (err, res, next) => {
  console.error(err);
  return err.message === "Same User"
    ? res.status(401).json({
        Update_ERROR: {
          code: 401,
          message: "A user with that email already exists",
        },
      })
    : next(err);
};

exports.getResult = (err, res, next) => {
  const purpose = err.purpose;
  console.error(err);
  return err.message === "No User"
    ? res.status(404).json({
        [purpose + "_Error"]: {
          code: 404,
          message: `${err.id} is not exist id`,
        },
      })
    : next(err);
};
