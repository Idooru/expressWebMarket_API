const dataWorker = require("../data/productData");
const errorWorker = require("../errors/productControllerErr.js");

async function getProductDetailById(req, res, next) {
  const productId = Number(req.query.id);

  try {
    const result = await dataWorker.productFindOne(productId);

    return res.json({
      code: 200,
      message: "Sucess to get product's info by id",
      result,
    });
  } catch (err) {
    return err.message === "No Product"
      ? res.status(404).json({
          code: 404,
          message: `Failed to get product's info by id of ${err.id}`,
        })
      : next(err);
  }
}

async function getProductDetailByName(req, res, next) {
  const productName = decodeURIComponent(req.query.name);

  try {
    const result = await dataWorker.productFindOne(productName);
  } catch (err) {
    if (err.message === "no Product") {
      console.error(err);
      return res.status(404).json({
        code: 404,
        message: `Failed to get product's info by name of ${err.noneData}`,
      });
    }
    return next(err);
  }

  id = product.id;
  productName = product.name;
  productPrice = product.price;
  productOrigin = product.origin;
  productType = product.type;

  return res.json({
    code: 200,
    message: "Sucess to get product's info by name",
    result: { id, productName, productPrice, productOrigin, productType },
  });
}

async function getProductMain(req, res, next) {
  let products;

  try {
    products = await dataWorker.FindAll();
  } catch (err) {
    if (err.message === "no Product") {
      console.error(err);
      return res.status(500).json({
        code: 500,
        message: "There is no product, Add product more!",
      });
    }
    return next(err);
  }

  // const productNames = products.map((value, index) => {
  //     const productNames = [];
  //     productNames.push(products[index].name);

  //     return productNames[0];
  // }); 임시 주석

  // const productIds = products.map((value, index) => {
  //     const productIds = [];
  //     productIds.push(products[index].id);

  //     return productIds[0];
  // });

  products.shift();
  // productNames.shift(); 임시 주석
  // productIds.shift();

  return res.json({
    code: 200,
    message: "Sucess to get all product's name",
    result: products,
  });
}

async function createProduct(req, res, next) {
  const package = req.body;

  try {
    const product = await dataWorker.Create(package);
    return res.status(201).json({
      code: 201,
      message: "The product has been created",
      product,
    });
  } catch (err) {
    console.error(err);
    return err.message === "Same Product"
      ? res.status(401).json({
          code: 401,
          message: "A product with the same name exists",
        })
      : next(err);
  }
}

async function modifyProduct(req, res, next) {
  const paramsId = req.params.id;
  const package = req.body;
  let result;

  try {
    await dataWorker.Update(package, paramsId);
    result = await dataWorker.GetResult(paramsId);
  } catch (err) {
    if (err.message === "same Product") {
      console.error(err);
      return res.status(401).json({
        code: 401,
        message: "A product with the same name exists",
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
    message: "The product's info has been modified",
    result,
  });
}

async function removeProduct(req, res, next) {
  const paramsId = req.params.id;

  try {
    await dataWorker.Destroy(paramsId);
  } catch (err) {
    console.error(err);
    return next(err);
  }

  return res.status(203).json({
    code: 203,
    message: "The product's info has been removed",
  });
}

module.exports = {
  getProductDetailById,
  getProductDetailByName,
  getProductMain,
  createProduct,
  modifyProduct,
  removeProduct,
};
