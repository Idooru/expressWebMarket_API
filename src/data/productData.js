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
  try {
    const createdProduct = await Product.create(package);
    return createdProduct;
  } catch (err) {
    throw err.message === "Validation error" ? new Error("Same Product") : err;
  }
}

async function Update(package, productId) {
  try {
    await Product.update(package, {
      where: { id: productId },
    });
  } catch (err) {
    throw err.message === "Validation error" ? new Error("Same Product") : err;
  }
}

async function Destroy(productId) {
  try {
    await Product.destroy({
      where: { id: productId },
    });
  } catch (err) {
    throw err;
  }
}

async function GetResult(productId, purpose) {
  try {
    const product = await Product.findOne({
      where: { id: productId },
    });

    if (!product) {
      const error = new Error("No Product");
      error.id = productId;
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
