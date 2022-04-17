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
          message: "Failed to join, The password is not matching",
        });
        errType.push("Password");
        break;
      default:
        console.error(err);
        errStatus.push({ code: 500, message: "Server Error" });
        break;
    }
  }
  return { status: [...errStatus], type: [...errType] };
};
