exports.join = (errs) => {
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
        errType.push("Email");
        break;
      case "Exist Nickname":
        console.error(err);
        errStatus.push({
          code: 401,
          message: "Failed to join, The nickname is exist",
        });
        errType.push("Nickname");
        break;
      case "Password Inconsistency":
        console.error(err);
        errStatus.push({
          code: 401,
          message: "Failed to join, These passwords do not match each other",
        });
        errType.push("Password");
        break;
      default:
        console.error(err);
        errStatus.push({ code: 500, message: "Server Error" });
        errType.push("ServerError");
        break;
    }
  }
  return { status: [...errStatus], type: [...errType] };
};

exports.changePassword = (errs) => {
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
        errType.push("Email");
        break;
      case "Password Inconsistency":
        console.error(err);
        errStatus.push({
          code: 401,
          message: "Failed to join, These passwords do not match each other",
        });
        errType.push("Password");
        break;
      default:
        console.error(err);
        errStatus.push({ code: 500, message: "Server Error" });
        errType.push("ServerError");
        break;
    }
  }

  return { status: [...errStatus], type: [...errType] };
};
