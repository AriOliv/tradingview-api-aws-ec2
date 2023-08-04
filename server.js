
const express = require('express');

const PORT = 8888;
const HOST = '0.0.0.0';

const app = express();

const TradingView = require('./main');
// const client = new TradingView.Client();

let arr = [];

app.use(express.json());
app.get("/:asset", async function(req,res) {
    let ativo = req.params.asset;
    let range = req.query.range;
    let timeframe = req.query.timeframe;
    
    if (typeof timeframe === 'undefined') {
        timeframe = '1D';}
    
    if (typeof range === 'undefined') {
        range = 20000;}
    

    var obj = function () { /* Testing "Invalid symbol" */
        console.info(`\nGetting data for: ${ativo}`);

        const client = new TradingView.Client();
        const chart = new client.Session.Chart();
        
        chart.setMarket(`BMFBOVESPA:${ativo}`, {
            timeframe: `${timeframe}`,
            range: parseInt(range), // Can be positive to get before or negative to get after
            to: 1706039463,
        });
        
        chart.onUpdate(() => { // Listen for errors
            console.log(ativo,chart.periods[0]['close']);
            const out = {
                'asset': chart.infos.description,
                'exchange': chart.infos.exchange,
                'currency': chart.infos.currency_code,
                'seriesLength': chart.periods.length,
                'values': chart.periods,
            };
            // console.log(Object.entries(chart.infos));
            // console.log(Object.keys(chart.periods[0]));
            res.send(out);
        });

        client.onError((...err) => {
            console.error(' => Client error:', err);
            client.end();
        });

        chart.onError((...err) => {
            console.error(' => Chart error:', err);
            client.end();
        });
        };


    arr.push(obj());


    (async () => {
        for (const i in arr[-1]) await new Promise(i);
      })();
      
    })


app.listen(PORT, HOST, () => {
    console.log('Server started at http://' + HOST + ':' + PORT);
});