const productsRouter = require("express").Router();
const multer = require('multer');
const Orders = require('../models/orders')
const Products = require("../models/products");
const Ingredients = require("../models/ingredients");
const { checkJwt, isAdmin } = require('../middlewares/checkJwt')

const upload = multer({ dest: 'assets' });

productsRouter.get('/', (req, res) => {
    Products.findMany()
        .then((products) => {
            res.json(products);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error retrieving products from database');
        });
});

productsRouter.get('/count', (req, res) =>
    Products.count()
    .then(result => res.json(result))
    .catch(err => {
        console.log(`count ${err}`)
        res.status(500).send('Error retrieving products from database');
    })
);

productsRouter.get('/:id', (req, res) => {
    Products.findOne(req.params.id)
        .then((product) => {
            if (product) {
                Ingredients.ingredientsForProduct(product.id)
                    .then((ingredients) => {
                        product.ingredients = ingredients
                        res.json(product);
                    })
            } else {
                res.status(404).send('Product not found');
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send('Error retrieving product from database');
        });
});

productsRouter.get('/:id/orders', checkJwt, isAdmin, (req, res) => {
    return Orders.findForProduct(req.params.id)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).send('Error retrieving orders for user from database'))
});

productsRouter.get('/count', (req, res) =>
    Products.count()
    .then(products => res.json(products))
    .catch(err => {
        console.log(err)
        res.status(500).send('Erreur en cherchant le nombre des produits dans la base de données')
    })
)
const get_ingredients = (req) => {
    // pattern of field name : ingredient-i-field
    // field: Name or Description
    let ingredients = [];
    for (const key in req) {
        if (key.startsWith('ingredient-')) {
            const [x, i, field] = key.split('-');
            if (!ingredients[i])
                ingredients[i] = {}
            ingredients[i][field] = req[key].trim()
        }
    }
    return ingredients.filter(item => item.name && item.description) // not empty
}

productsRouter.post('/', upload.single('picture'), (req, res) => {
    console.log(req.file)
    const {
        value,
        error
    } = Products.validate(req.body);
    if (error) {
        console.log(error.details)
        res.status(422).json({
            validationErrors: error.details
        });
    } else {
        // begin transaction
        Products.create(value)
            .then((createdProduct) => {
                let ingredients = get_ingredients(req.body);
                for (let ingredient of ingredients) {
                    Ingredients.create(createdProduct.id,
                        ingredient.name,
                        ingredient.description)
                }

                res.status(201).json(createdProduct);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error saving the product');
            });
    }
});

// productsRouter.post('/', upload.single('picture'), async (req, res) => {
//     // const [{ insertId: id}] = await insertPost(req.body, req.file.path);
//     return res.json({
//         ...req.body,
//         id,
//         picture: req.file.filename
//     });
// });

productsRouter.put('/:id', (req, res) => {
    let existingProducts = null;
    Products.findOne(req.params.id)
        .then((products) => {
            existingProducts = products;
            if (!existingProducts) return Promise.reject('RECORD_NOT_FOUND');
            const {
                value,
                error
            } = Products.validate(req.body);
            if (error) {
                res.status(422).json({
                    validationErrors: error.details
                })
            } else return Products.update(req.params.id, value);
        })
        .then((value) => {
            res.status(200).json({
                ...existingProducts,
                ...value
            });
        })
        .catch((err) => {
            console.error(err);
            if (err === 'RECORD_NOT_FOUND')
                res.status(404).send(`Product with id ${req.params.id} not found.`);
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