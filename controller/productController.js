const dataWorker = require("../data/productData");

async function routeQuarter(req, res, next) {
    if (req.query.name) {
        getProductDetailByName(req, res, next);
    } else {
        getProductMain(req, res, next);
    }
}

async function getProductDetailById(req, res, next) {
    const paramsId = req.params.id;
    const check = new Object();
    check.id = paramsId;
    let product;

    try {
        product = await dataWorker.FindOne(check);
    } catch (err) {
        if (err.message === "no Product") {
            console.error(err);
            return res.status(401).json({
                code: 401,
                message: "Failed to get product's info by id",
            });
        }
        return next(err);
    }

    id = paramsId;
    productName = product.name;
    productPrice = product.price;
    productOrigin = product.origin;
    productType = product.type;

    return res.json({   
        code: 200,
        message: "Sucess to get product's info by id",
        result: { id, productName, productPrice, productOrigin, productType },
    });
}

async function getProductDetailByName(req, res, next) {
    const querryName = decodeURIComponent(req.query.name);
    const check = new Object();
    check.name = querryName;
    let product;

    try {
        product = await dataWorker.FindOne(check);
    } catch (err) {
        if (err.message === "no Product") {
            console.error(err);
            return res.status(401).json({
                code: 401,
                message: "Failed to get product's info by name",
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

    const productNames = products.map((value, index) => {
        const productNames = [];
        productNames.push(products[index].name);

        return productNames[0];
    });

    // const productIds = products.map((value, index) => {
    //     const productIds = [];
    //     productIds.push(products[index].id);

    //     return productIds[0];
    // });

    productNames.shift();
    // productIds.shift();

    return res.json({
        code: 200,
        message: "Sucess to get all product's name",
        result: { productNames },
    });
}

async function createProduct(req, res, next) {
    const package = req.body;
    let result;

    try {
        result = await dataWorker.Create(package);
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

    return res.status(201).json({
        code: 201,
        message: "The product has been created",
        result,
    });
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
    routeQuarter,
    getProductDetailById,
    getProductDetailByName,
    getProductMain,
    createProduct,
    modifyProduct,
    removeProduct,
};
