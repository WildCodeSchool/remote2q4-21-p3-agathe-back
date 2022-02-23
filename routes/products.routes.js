const productsRouter = require("express").Router();
const Products = require("../models/products");


productsRouter.get('/', (req, res) => {
    // const {  } = req.query;
    Products.findMany()
        .then((products) => {
            res.json(products);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error retrieving products from database');
        });
});

productsRouter.get('/:id', (req, res) => {
    Products.findOne(req.params.id)
        .then((products) => {
            if (products) {
                res.json(products);
            } else {
                res.status(404).send('Product not found');
            }
        })
        .catch((err) => {
            res.status(500).send('Error retrieving product from database');
        });
});

productsRouter.post('/', (req, res) => {
    // const error = Movie.validate(req.body);
    // if (error) {
    //   res.status(422).json({ validationErrors: error.details });
    // } else {
    Products.create(req.body)
        .then((createdProducts) => {
            res.status(201).json(createdProducts);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error saving the product');
        });
    // }
});

productsRouter.put('/:id', (req, res) => {
    let existingProducts = null;
    // let validationErrors = null;
    Products.findOne(req.params.id)
        .then((products) => {
            existingProducts = products;
            if (!existingProducts) return Promise.reject('RECORD_NOT_FOUND');
            // validationErrors = Movie.validate(req.body, false);
            // if (validationErrors) return Promise.reject('INVALID_DATA');
            return Products.update(req.params.id, req.body);
        })
        .then(() => {
            res.status(200).json({...existingProducts, ...req.body });
        })
        .catch((err) => {
            console.error(err);
            if (err === 'RECORD_NOT_FOUND')
                res.status(404).send(`Product with id ${req.params.id} not found.`);
            // else if (err === 'INVALID_DATA')
            //   res.status(422).json({ validationErrors: validationErrors.details });
            else res.status(500).send('Error updating a product.');
        });
});

productsRouter.delete('/:id', (req, res) => {
    Products.destroy(req.params.id)
        .then((deleted) => {
            if (deleted) res.status(200).send('Product deleted!');
            else res.status(404).send('Product not found');
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error deleting a product');
        });
});


module.exports = productsRouter;