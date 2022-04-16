exports.join = (err) => {
  for (let i of err) {
    switch (i.message) {
      case "Exist Email":
        console.error(i.reason);
        return {
          code: 401,
          message: "Failed to join, The email is exist",
        };
      case "Exist Nickname":
        console.error(i.reason);
        return {
          code: 401,
          message: "Failed to join, The nickname is exist",
        };
      case "Password Inconsistency":
        console.error(i.reason);
        return {
          code: 401,
          message: "Failed to join, The password is not matching",
        };
      default:
        return i;
    }
  }
};
