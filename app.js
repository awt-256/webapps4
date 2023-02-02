const express = require("express");
const logger = require("morgan");
const db = require("./db/connection")

const PORT = process.env.PORT || 8080;

const app = express();

app.use(logger("dev"));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/app", (req, res) => {
    db.readAll((error, results) => {
        if (error) res.status(500).send(error);
        else {
            res.render("list", { items: results });
        }
    });
});

app.get("/app/item/:id", (req, res) => {
    db.read(req.params.id, (error, results) => {
        if (error) res.status(500).send(error);
        else {
            const item = results[0] || null;

            res.render("item", { item });
        }
    });
});

app.get("/app/item/:id/delete", (req, res) => {
    db.delete(req.params.id, (error, results) => {
        if (error) res.status(500).send(error);
        else {
            res.redirect("/app/")
        }
    });
});

const isLegalItemInfo = (name, description, quantity) => {
    if (typeof name !== "string" || name.length > 32) return false;
    if (typeof description !== "string" || name.length > 400) return false;
    if (!isFinite(quantity) || quantity < 0) return false;

    return true;
}

app.post("/app/item/new", (req, res) => {
    let {name, description, quantity} = req.body;
    quantity = parseInt(quantity);
    if (!isLegalItemInfo(name, description, quantity)) return res.status(400);

    db.insert(name, quantity, description, (error, results) => {
        if (error) res.status(500).send(error);
        else {
            res.redirect("/app/");
        }
    })
});

app.post("/app/item/:id/update", (req, res) => {
    const id = req.params.id;
    let {name, description, quantity} = req.body;
    quantity = parseInt(quantity);
    if (!isLegalItemInfo(name, description, quantity)) return res.status(400);

    db.update(id, name, quantity, description, (error, results) => {
        if (error) res.status(500).send(error);
        else {
            res.redirect("/app/item/" + id);
        }
    })
});

app.listen(PORT, () => {
    console.log(`App server listening on ${PORT}. (http://localhost:${PORT})`);
});