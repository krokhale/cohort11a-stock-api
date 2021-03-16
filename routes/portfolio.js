var express = require('express');
var router = express.Router();
const {Portfolio, Wallet} = require('../lib/models');
const yahooStockPrices = require('yahoo-stock-prices')

// DELETE - perform DELETE request on http://localhost:3000/api/v1/stocks/:id - STEP 1 Done | STEP 2 - Perform Actual Queries
// UPDATE - perform PUT request on http://localhost:3000/api/v1/stocks/:id - STEP 1 Done | STEP 2 - Perform Actual Queries
// CREATE - - perform POST request on http://localhost:3000/api/v1/stocks - STEP 1 Done | STEP 2 - Perform Actual Queries

// NON-REST - CUSTOM
// GET /api/v1/stocks/search?symbol=AAPL
// GET /api/v1/stocks/search/AAPL
// GET /api/v1/stocks/search/MSFT
// POST /api/v1/stocks/search req.body

router.get('/search/:symbol', async function(req, res, next) {
    // console.log(req.query)
    // console.log(req.params)
    try {
        const data = await yahooStockPrices.getCurrentData(req.params.symbol);
        res.json({success: true, data: data});
    } catch(err){
        res.json({success: false, data: {}});
    }

})

// CREATE
router.post('/', async function(req, res, next) {
    console.log(req.body)
    let stock = await Portfolio.create(req.body);
    // after this point, the purchase has been made
    let currentWallet = await Wallet.findOne({});
    if(currentWallet){
        let currentWalletValue = currentWallet.value;
        let amountSpent = req.body.quantity * req.body.price;
        let newWalletValue = currentWalletValue - amountSpent;
        console.log('newWalletValue', newWalletValue);
        currentWallet.update({value: newWalletValue})
    }

    // Stock.create(req.body)
    //     .then((stock) => {
    //         res.json({success: true});
    //     })

    res.json(stock);
});

// UPDATE
router.put('/:id', async function(req, res, next) {
    // console.log(req.body)
    // console.log(req.params)
    // let stock = await Stock.update()
    // let stock = Stock.update(req.body, {where: req.params.id})
    let stock = await Portfolio.update(req.body, {
        where: {id: req.params.id}
    });
    res.json(stock);
});

// DELETE
router.delete('/:id', async function(req, res, next) {
    // console.log(req.params)

    let currentStock = await Portfolio.findOne({where: {id: req.params.id}});
    if(currentStock) {
        let symbol = currentStock.symbol;
        let quantity = currentStock.quantity;
        const data = await yahooStockPrices.getCurrentData(symbol);
        console.log(data)

        let cashEarnedFromStockSale = parseInt(parseInt(quantity) * data.price);

        let currentWallet = await Wallet.findOne({});
        if(currentWallet){
            let currentWalletValue = parseInt(currentWallet.value);
            let newWalletValue = currentWalletValue + cashEarnedFromStockSale;
            console.log('newWalletValue', newWalletValue);
            await currentWallet.update({value: newWalletValue})
        }

        let stock = await Portfolio.destroy({where: {id: req.params.id}});
        // update the wallet happens here
        // res.json(stock);
        res.json(stock);

    }



    // // let stock = await Portfolio.destroy({where: {id: req.params.id}});
    // // update the wallet happens here
    // // res.json(stock);
    // res.json({});
});


/* GET users listing. */
router.get('/', async function(req, res, next) {

    console.log('I WAS HERE *********')

    let items = await Portfolio.findAll({})

    // console.log(items);
    res.json(items);
});

module.exports = router;
