module.exports = (err, res) => {
    switch (err.message) {
        case "no Product":
            res.locals.warning = "No applicable products found";
            res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
            res.locals.error.status = 404;
            res.locals.message =
                "The requested product could not be found, please go back.";
            console.error(err);
            return res.status(404).render("occasionalError");

        case "same Product":
            res.locals.warning = "A product with the same name exists";
            res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
            res.locals.error.status = 400;
            res.locals.message =
                "The name of the product cannot be the same, so please reset the name";
            console.error(err);
            return res.status(400).render("occasionalError");

        case "Form Null":
            res.locals.warning = "One of the forms is not filled in";
            res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
            res.locals.error.status = 400;
            res.locals.message =
                "You forgot to fill out the form. Please check your input";
            return res.status(400).render("occasionalError");

        case "Exist Email":
            res.locals.warning = "Email already exists";
            res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
            res.locals.error.status = 401;
            res.locals.message =
                "Emails cannot overlap, so please use a new email.";
            return res.status(401).render("occasionalError");

        case "Exist Nickname":
            res.locals.warning = "Nickname already exists";
            res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
            res.locals.error.status = 401;
            res.locals.message =
                "Nickname cannot overlap, so please use a new nickname.";
            return res.status(401).render("occasionalError");

        default:
            res.locals.message = err.message;
            res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
            res.locals.error.status = 500;
            console.error(err);
            res.status(500).render("error");
    }
};
