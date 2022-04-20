exports.getProductDetail = (err, res, next) => {
  console.error(err);
  return err.message === "No Product"
    ? res.status(404).json({
        code: 404,
        message: `Failed to get product's info by id of ${err.data}`,
      })
    : next(err);
};

exports.productFindAll = (err, res, next) => {
  console.error(err);
  return err.message === "No Product"
    ? res.status(500).json({
        code: 500,
        message: "Thers is no product, Add product more!",
      })
    : next(err);
};

exports.operateProduct = (err, res, next) => {
  console.error(err);
  return err.message === "Same Product"
    ? res.status(401).json({
        Update_ERROR: {
          code: 401,
          message: "A product with the same name exists",
        },
      })
    : next(err);
};

exports.getResult = (err, res, next) => {
  const purpose = err.purpose;
  console.error(err);
  return err.message === "No Product"
    ? res.status(500).json({
        [purpose + "_Error"]: {
          code: 500,
          message: `${err.id} is not exist id`,
        },
      })
    : next(err);
};
