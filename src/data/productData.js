const Product = require("../models/products");

async function productFindOne(data) {
  try {
    const product =
      typeof data === "number"
        ? await Product.findOne({
            where: { id: data },
          })
        : await Product.findOne({
            where: { name: data },
          });

    if (product === null) {
      const error = new Error("No Product");
      error.id = data;
      throw error;
    }

    return product;
  } catch (err) {
    throw err;
  }
}

async function productFindAll() {
  let products;

  try {
    products = await Product.findAll();
  } catch (err) {
    throw err;
  }

  if (products.length === 0) throw new Error("no Product");

  return products;
}

async function GetResult(paramsId) {
  let AfterProducts;

  try {
    AfterProducts = await Product.findOne({
      where: { id: paramsId },
    });
  } catch (err) {
    throw err;
  }

  AfterProducts = AfterProducts === null ? "removed" : AfterProducts.dataValues;
  return AfterProducts;
}

async function Create(package) {
  const { name, price, origin, type } = package;

  try {
    const createdProduct = await Product.create({
      id: Date.now().toString(),
      name,
      price,
      origin,
      type,
    });
    return createdProduct;
  } catch (err) {
    throw err.message === "Validation error" ? new Error("Same Product") : err;
  }
}

async function Update(package, paramsId) {
  try {
    const { name, price, origin, type } = package;
    await Product.update(
      {
        name,
        price,
        origin,
        type,
      },
      {
        where: { id: paramsId },
      }
    );
  } catch (err) {
    let errMessage = err.message;
    if (errMessage === "Validation error") {
      throw new Error("same Product");
    } else if (errMessage.startsWith("notNull Violation")) {
      throw new Error("form Null");
    } else throw err;
  }
}

async function Destroy(paramsId) {
  try {
    await Product.destroy({
      where: { id: paramsId },
    });
  } catch (err) {
    throw err;
  }
}

module.exports = {
  productFindOne,
  productFindAll,
  GetResult,
  Create,
  Update,
  Destroy,
};
