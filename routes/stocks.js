var express = require('express');
var router = express.Router();
const {Stock} = require('../lib/models');


// DELETE - perform DELETE request on http://localhost:3000/api/v1/stocks/:id - STEP 1 Done | STEP 2 - Perform Actual Queries
// UPDATE - perform PUT request on http://localhost:3000/api/v1/stocks/:id - STEP 1 Done | STEP 2 - Perform Actual Queries
// CREATE - - perform POST request on http://localhost:3000/api/v1/stocks - STEP 1 Done | STEP 2 - Perform Actual Queries

// CREATE
router.post('/', async function(req, res, next) {
    console.log(req.body)
    let stock = await Stock.create(req.body);
    // Stock.create(req.body)
    //     .then((stock) => {
    //         res.json({success: true});
    //     })

    res.json(stock);
});

// UPDATE
router.put('/:id', async function(req, res, next) {
    console.log(req.body)
    console.log(req.params)
    // let stock = await Stock.update()
    // let stock = Stock.update(req.body, {where: req.params.id})
    let stock = await Stock.update(req.body, {
        where: {id: req.params.id}
    });
    res.json(stock);
});

// DELETE
router.delete('/:id', async function(req, res, next) {
    // console.log(req.params)
    let dog = await Stock.destroy({where: {id: req.params.id}});
    res.json(dog);
});


/* GET users listing. */
// router.get('/', function(req, res, next) {
//     res.send('respond with a stock');
// });

module.exports = router;
