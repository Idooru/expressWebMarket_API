exports.FindEmailToJoin = () => {
  return { test: "test" };
};

exports.MatchPasswordToModify = () => {
  return {
    result: "error",
    code: 401,
    message: "Password Inconsistency",
  };
};
