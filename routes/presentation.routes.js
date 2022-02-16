const presentationRouter = require("express").Router();
const Presentation = require('../models/presentation');

presentationRouter.get('/', (req, res) => {
  Presentation.findOne()
    .then((presentation) => {
      if (presentation) res.json(presentation);
      else res.status(404).send('Presentation not found');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving presentation from database');
    });
});

router.put('/', (req, res) => {
  Presentation.update(req.body)
    .then(() => {
      res.status(200).json({
        ...req.body
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error updating a presentation');
    });
});

module.exports = presentationRouter;