const dataWorker = require("../data/productData");

async function getProductDetailById(req, res, next) {
    const paramsId = req.params.id;
    const check = new Object();
    check.id = paramsId;
    let product;

    try {
        product = await dataWorker.FindOne(check);
    } catch (err) {
        return next(err);
    }

    res.locals.id = paramsId;
    res.locals.productName = product.name;
    res.locals.productPrice = product.price;
    res.locals.productOrigin = product.origin;
    res.locals.productType = product.type;
    res.render("productInfo");
}

async function getProductDetailByName(req, res, next) {
    const querryName = decodeURIComponent(req.query.name);
    const check = new Object();
    check.name = querryName;
    let product;

    try {
        product = await dataWorker.FindOne(check);
    } catch (err) {
        return next(err);
    }

    res.locals.id = product.id;
    res.locals.productName = product.name;
    res.locals.productPrice = product.price;
    res.locals.productOrigin = product.origin;
    res.locals.productType = product.type;
    res.render("productInfo");
}

async function getProductMain(req, res, next) {
    let products;

    try {
        products = await dataWorker.FindAll();
    } catch (err) {
        return next(err);
    }

    const productNames = products.map((value, index) => {
        const productNames = [];
        productNames.push(products[index].name);

        return productNames[0];
    });

    const productIds = products.map((value, index) => {
        const productIds = [];
        productIds.push(products[index].id);

        return productIds[0];
    });

    productNames.shift();
    productIds.shift();

    res.locals.productNames = productNames;
    res.locals.productIds = productIds;
    res.render("productMain");
}

async function createProduct(req, res, next) {
    const package = req.body;
    let product;

    try {
        product = await dataWorker.Create(package);
    } catch (err) {
        return next(err);
    }

    const result = JSON.stringify(product);
    const message = "The product has been created";
    res.status(201).render("productCreate", { message, result });
}

async function modifyProduct(req, res, next) {
    const paramsId = req.params.id;
    const package = req.body;
    let getOld;
    let getNew;

    try {
        getOld = await dataWorker.getBefore(paramsId);
        await dataWorker.Update(package, paramsId);
        getNew = await dataWorker.getAfter(paramsId);
    } catch (err) {
        return next(err);
    }

    const message = "The product's info has been modified";
    res.status(200).render("productUpdateDelete", {
        message,
        getOld,
        getNew,
    });
}

async function removeProduct(req, res, next) {
    const paramsId = req.params.id;
    let getOld;
    let getNew;

    try {
        getOld = await dataWorker.getBefore(paramsId);
        await dataWorker.Destroy(paramsId);
        getNew = await dataWorker.getAfter(paramsId);
    } catch (err) {
        return next(err);
    }

    const message = "The product's info has been removed ";
    res.status(203).render("productUpdateDelete", {
        message,
        getOld,
        getNew,
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
