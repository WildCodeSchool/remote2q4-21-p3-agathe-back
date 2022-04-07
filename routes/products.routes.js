const router = require("express").Router();
const multer = require('multer');
const Orders = require('../models/orders')
const Products = require("../models/products");
const Ingredients = require("../models/ingredients");
const { checkJwt, isAdmin } = require('../middlewares/checkJwt')

const upload = multer({ dest: 'assets' });

router.get('/', (req, res) => {
    Products.findMany()
        .then(products => res.json(products))
        .catch(err => {
            console.log(err);
            res.status(500).send('Error retrieving products from database');
        });
});

router.get('/count', (req, res) =>
    Products.count()
    .then(result => res.json(result))
    .catch(err => {
        res.status(500).send('Error retrieving products from database');
    })
);

router.get('/:id', (req, res) => {
    Products.findOne(req.params.id)
        .then(product => {
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
        .catch(err => {
            console.log(err)
            res.status(500).send('Error retrieving product from database');
        });
});

router.get('/:id/orders', checkJwt, isAdmin, (req, res) => {
    return Orders.findForProduct(req.params.id)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).send('Error retrieving orders for user from database'))
});

router.get('/:id/yearly_sales', (req, res) =>
    Orders.yearlySalesForProduct(req.params.id)
    .then(orders => res.json(orders))
    .catch(err => {
        console.log(err)
        res.status(500).send("Erreur en recherchant le montant des commandes sur l'année")
    })
);

router.get('/count', (req, res) =>
    Products.count()
    .then(products => res.json(products))
    .catch(err => {
        console.log(err)
        res.status(500).send('Erreur en cherchant le nombre des produits dans la base de données')
    })
)

const validateData = (req, res, next) => {
    console.log('req.body', req.body)
    try {
        const { value, error } = Products.validate(req.body);
        if (error) {
            console.log(error.details)
            return res.status(422).json({
                validationErrors: error.details
            });
        }
        req.data = value
        return next(); // call next middleware
    } catch (err) {
        return res.status(500).send(err)
    }
};

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

router.post('/', checkJwt, isAdmin, upload.single('picture'), validateData, (req, res) => {
    // begin transaction
    req.data['picture'] = req.file.filename
    Products
        .create(req.data)
        .then((createdProduct) => {
            let ingredients = get_ingredients(req.data);
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
});

router.put('/', checkJwt, isAdmin, validateData, async(req, res) => {
    try {
        let id = req.data.id
        let existingProduct = await Products.findOne(id)
        if (!existingProduct)
            return res.status(404).send(`Product with id ${id} not found.`);

        let value = await Products.update(id, req.data);

        //remove ingredients
        await Ingredients.destroyForProduct(id)

        //insert new ingredients
        let ingredients = get_ingredients(req.body);
        for (let ingredient of ingredients) {
            await Ingredients.create(id,
                ingredient.name,
                ingredient.description)
        }
        return res.status(200).json({...existingProduct, ...value });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating a product.');
    }
});

router.delete('/:id', checkJwt, isAdmin, (req, res) => {
    Products.update(req.params.id, { active: false })
        .then((deleted) => {
            if (deleted) res.status(200).send('Product deleted!');
            else res.status(404).send('Product not found');
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error deleting a product');
        });
});

module.exports = router;