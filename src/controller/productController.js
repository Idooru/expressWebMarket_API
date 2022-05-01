import * as dataWorker from "../data/productData.js";
import * as errorWorker from "../errors/productControllerErr.js";

export async function getProductDetailById(req, res, next) {
  const productId = Number(req.query.id);

  try {
    const result = await dataWorker.productFindOne(productId);

    return res.status(200).json({
      code: 200,
      message: "Sucess to get product's info by id",
      result,
    });
  } catch (err) {
    errorWorker.getProductDetail(err, res, next);
  }
}

export async function getProductDetailByName(req, res, next) {
  const productName = req.query.name;

  try {
    const result = await dataWorker.productFindOne(productName);

    return res.status(200).json({
      code: 200,
      message: "Sucess to get product's info by name",
      result,
    });
  } catch (err) {
    errorWorker.getProductDetail(err, res, next);
  }
}

export async function getProductMain(req, res, next) {
  try {
    const products = await dataWorker.productFindAll();

    return res.status(200).json({
      code: 200,
      message: "Sucess to get all product's name",
      result: products,
    });
  } catch (err) {
    errorWorker.productFindAll(err, res, next);
  }
}

export async function createProduct(req, res, next) {
  const payLoad = req.body;

  try {
    const result = await dataWorker.Create(payLoad);
    return res.status(201).json({
      code: 201,
      message: "The product has been created",
      result,
    });
  } catch (err) {
    errorWorker.createProduct(err, res, next);
  }
}

export async function modifyProduct(req, res, next) {
  const productId = req.query.id;
  const payload = req.body;

  try {
    await dataWorker.Update(payload, productId);
    const purpose = "Update";
    const result = await dataWorker.GetResult(productId, purpose);
    return res.status(201).json({
      code: 201,
      message: "The product has been modified",
      result,
    });
  } catch (err) {
    err.message === "No Product"
      ? errorWorker.getResult(err, res, next)
      : errorWorker.updateProduct(err, res, next);
  }
}

export async function removeProduct(req, res, next) {
  const productId = req.query.id;

  try {
    await dataWorker.Destroy(productId);
    const purpose = "Delete";
    await dataWorker.GetResult(productId, purpose);
    return res.status(203).json({
      code: 203,
      message: "The product's info has been removed",
    });
  } catch (err) {
    errorWorker.getResult(err, res, next);
  }
}
