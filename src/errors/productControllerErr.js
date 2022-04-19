exports.createProduct = (errs) => {
  const errStatus = [];
  const errType = [];

  for (let err of errs) {
    switch (err.message) {
      case "Same Product":
        console.error(err);
        errStatus.push({
          code: 401,
          message: "A product with the same name exists",
        });
        errType.push("Name");
        break;

      default:
        console.error(err);
        errStatus.push({
          code: 500,
          message: err.message,
        });
        errType.push("Server Error");
    }
  }
};
