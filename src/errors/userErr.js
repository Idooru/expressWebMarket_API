export function promiseOnJoin(errs) {
  const errStatus = [];
  const errType = [];

  switch (errs.message) {
    case "Exist Email":
      console.error(errs);
      errStatus.push({
        code: 401,
        message: "Failed to join, The email is exist",
      });
      errType.push("Email_ERROR");
      break;

    case "Exist Nickname":
      console.error(errs);
      errStatus.push({
        code: 401,
        message: "Failed to join, The nickname is exist",
      });
      errType.push("Nickname_ERROR");
      break;

    case "Password Inconsistency":
      console.error(errs);
      errStatus.push({
        code: 401,
        message: "Failed to join, These passwords do not match each other",
      });
      errType.push("Password_ERROR");
      break;

    default:
      console.error(errs);
      errStatus.push({ code: 500, message: errs.message });
      errType.push("Server_Error");
      break;
  }

  return { status: [...errStatus], type: [...errType] };
}

export function FindEmailToGet(err, res, next) {
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
}

export function promiseOnChangePassword(errs) {
  const errStatus = [];
  const errType = [];

  switch (errs.message) {
    case "Nonexist Email":
      console.error(errs);
      errStatus.push({
        code: 401,
        message: "Failed to change for password, The email is nonexist",
      });
      errType.push("Email_ERROR");
      break;

    case "Password Inconsistency":
      console.error(errs);
      errStatus.push({
        code: 401,
        message: "Failed to join, These passwords do not match each other",
      });
      errType.push("Password_ERROR");
      break;

    default:
      console.error(errs);
      errStatus.push({ code: 500, message: errs.message });
      errType.push("Server_Error");
      break;
  }

  return { status: [...errStatus], type: [...errType] };
}

export function DisableHashing(err, res, next) {
  console.error(err);
  return res.status(401).json({
    Email_ERROR: {
      code: 401,
      message:
        "Failed to change for password, The password you entered is not your password",
    },
  });
}

export function updateUser(err, res, next) {
  console.error(err);
  return err.message === "Same User"
    ? res.status(401).json({
        Update_ERROR: {
          code: 401,
          message: "A user with that email already exists",
        },
      })
    : next(err);
}

export function getResult(err, res, next) {
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
}
