exports.promiseOnJoin = (errs) => {
  const errStatus = [];
  const errType = [];

  for (let err of errs) {
    switch (err.message) {
      case "Exist Email":
        console.error(err);
        errStatus.push({
          code: 401,
          message: "Failed to join, The email is exist",
        });
        errType.push("Email_ERROR");
        break;

      case "Exist Nickname":
        console.error(err);
        errStatus.push({
          code: 401,
          message: "Failed to join, The nickname is exist",
        });
        errType.push("Nickname_ERROR");
        break;

      case "Password Inconsistency":
        console.error(err);
        errStatus.push({
          code: 401,
          message: "Failed to join, These passwords do not match each other",
        });
        errType.push("Password_ERROR");
        break;

      default:
        console.error(err);
        errStatus.push({ code: 500, message: err.message });
        errType.push("Server_Error");
        break;
    }
  }
  return { status: [...errStatus], type: [...errType] };
};

exports.FindEmailToGet = (err, res, next) => {
  console.error(err);
  return err.message === "Nonexist Id"
    ? res.status(401).json({
        Id_ERROR: {
          code: 401,
          message: "Failed to find email with user's id",
          userSecret: err.userSecret,
        },
      })
    : next(err);
};

exports.promiseOnChangePassword = (errs) => {
  const errStatus = [];
  const errType = [];

  for (let err of errs) {
    switch (err.message) {
      case "Nonexist Email":
        console.error(err);
        errStatus.push({
          code: 401,
          message: "Failed to change for password, The email is nonexist",
        });
        errType.push("Email_ERROR");
        break;

      case "Password Inconsistency":
        console.error(err);
        errStatus.push({
          code: 401,
          message: "Failed to join, These passwords do not match each other",
        });
        errType.push("Password_ERROR");
        break;

      default:
        console.error(err);
        errStatus.push({ code: 500, message: err.message });
        errType.push("Server_Error");
        break;
    }
  }

  return { status: [...errStatus], type: [...errType] };
};

exports.DisableHashing = (err, res, next) => {
  console.error(err);
  return res.status(401).json({
    Email_ERROR: {
      code: 401,
      message:
        "Failed to change for password, The password you entered is not your password",
    },
  });
};

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
