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

    if (!product) {
      const error = new Error("No Product");
      error.data = data;
      throw error;
    }

    return product;
  } catch (err) {
    throw err;
  }
}

async function productFindAll() {
  try {
    const products = await Product.findAll({});
    if (!products.length) {
      throw new Error("No Product");
    }
    return products;
  } catch (err) {
    throw err;
  }
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
    await Product.update(package, {
      where: { id: paramsId },
    });
  } catch (err) {
    throw err.message === "Validation error" ? new Error("Same Product") : err;
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

async function GetResult(paramsId, purpose) {
  try {
    const product = await Product.findOne({
      where: { id: paramsId },
    });

    if (!product) {
      const error = new Error("No Product");
      error.id = paramsId;
      error.purpose = purpose === "Update" ? "Update" : "Delete";
      throw error;
    }

    return product;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  productFindOne,
  productFindAll,
  Create,
  Update,
  Destroy,
  GetResult,
};
