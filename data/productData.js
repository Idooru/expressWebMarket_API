const Product = require("../models/products");

async function FindOne(data, message) {
    let product;

    try {
        if (message === "By id") {
            product = await Product.findOne({ where: { id: data } });
        } else {
            product = await Product.findOne({ where: { name: data } });
        }
    } catch (err) {
        throw err;
    }

    if (product === null) {
        const error = new Error("no Product");
        error.noneData = data;
        throw error;
    }

    return product;
}

async function FindAll() {
    let products;

    try {
        products = await Product.findAll({});
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
    let createdProduct;

    try {
        createdProduct = await Product.create({
            id: Date.now().toString(),
            name,
            price,
            origin,
            type,
        });
    } catch (err) {
        let errMessage = err.message;
        if (errMessage === "Validation error") {
            throw new Error("same Product");
        } else if (errMessage.startsWith("notNull Violation")) {
            throw new Error("form Null");
        } else throw err;
    }

    return createdProduct;
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
    FindOne,
    FindAll,
    GetResult,
    Create,
    Update,
    Destroy,
};
