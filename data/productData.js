const Product = require("../models/products");

async function FindOne(check) {
    let product;
    let checker;

    try {
        if (check.id) {
            checker = check.id;
            product = await Product.findOne({ where: { id: checker } });
        } else {
            checker = check.name;
            product = await Product.findOne({ where: { name: checker } });
        }
    } catch (err) {
        throw err;
    }

    if (product === null) throw new Error("no Product");

    return product;
}

async function FindAll() {
    let products;

    try {
        products = await Product.findAll({});
    } catch (err) {
        throw err;
    }

    if (products === null) throw new Error("no Product");

    return products;
}

async function getBefore(id) {
    let BeforeProducts;

    try {
        BeforeProducts = await Product.findOne({ where: { id } });
    } catch (err) {
        throw err;
    }

    if (BeforeProducts === null) throw new Error("no Product");
    BeforeProducts = JSON.stringify(BeforeProducts.dataValues);

    return BeforeProducts;
}

async function getAfter(id) {
    let AfterProducts;

    try {
        AfterProducts = await Product.findOne({
            where: { id },
        });
    } catch (err) {
        throw err;
    }

    AfterProducts =
        AfterProducts === null
            ? "removed"
            : JSON.stringify(AfterProducts.dataValues);
    return AfterProducts;
}

async function Create(package) {
    const { id, name, price, origin, type } = package;
    let createdProduct;

    try {
        createdProduct = await Product.create({
            id,
            name,
            price,
            origin,
            type,
        });
    } catch (err) {
        if (err.message === "Validation error") {
            throw new Error("same Product");
        } else if (
            err.message ||
            ("notNull Violation: Product.id cannot be null" &&
                "notNull Violation: Product.name cannot be null" &&
                "notNull Violation: Product.price cannot be null" &&
                "notNull Violation: Product.origin cannot be null" &&
                "notNull Violation: Product.type cannot be null")
        ) {
            throw new Error("Form Null");
        } else throw err;
    }

    return createdProduct;
}

async function Update(package, paramsId) {
    try {
        const { id, name, price, origin, type } = package;
        await Product.update(
            {
                id,
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
        if (err.message === "Validation error") {
            throw new Error("same Product");
        } else if (
            err.message ||
            ("notNull Violation: Product.id cannot be null" &&
                "notNull Violation: Product.name cannot be null" &&
                "notNull Violation: Product.price cannot be null" &&
                "notNull Violation: Product.origin cannot be null" &&
                "notNull Violation: Product.type cannot be null")
        ) {
            throw new Error("Form Null");
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
    getBefore,
    getAfter,
    Create,
    Update,
    Destroy,
};
