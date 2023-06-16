const express = require('express');
const fs = require('fs');
const app = express();

app.param('id', function (req, res, next, id) {
    req.id = id;
    next();
});

const loadedData = JSON.parse(fs.readFileSync('./data/productData.json', 'utf8'));
const productCount = Object.keys(loadedData['products']).length;




// Default url
app.use('/static', express.static(__dirname + '/public'));

// All Products Page Handler
app.get(['/', '/products'], function (req, res, next) {
    console.log(req.originalUrl);
    fs.readFile('./templates/all-products.html', 'utf-8', function (err, data) {
        if (err) return next(err);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        let productHTML = "";
        for (let n = 0; n < productCount; n++) {
            productHTML += `<div>\n`;
            productHTML += `<a href="/products/${n}">\n`;

            productHTML += `<div class="image-wrapper">\n`;
            productHTML += `<img src="${loadedData['products'][n]['images'][0]}" class="image" alt="normal" height="200" width="200">\n`;
            productHTML += `<img src="${loadedData['products'][n]['images'][1]}" class="image-hover" alt="hover" alt="Card Front" height="200" width="200">\n`;
            productHTML += `</div>\n`;

            productHTML += `<h4>${loadedData['products'][n]['name']}</h4>\n`;
            productHTML += `<h2>${loadedData['products'][n]['price']}</h2>\n`;
            productHTML += `</a>\n`;
            productHTML += `</div>\n`;
        }
        res.write(data.replace('#productData', productHTML));
        res.end();
    });
});

// All Products Page Handler
app.get('/products/', function (req, res, next) {
    console.log(req.originalUrl);
    res.redirect('/products');
});


app.get('/products/:id', function (req, res) {
    console.log(req.originalUrl);
    if (isNaN(parseInt(req.id))) {
        res.redirect('/products');
        console.log(`ID: ${res.id}, UNKNOWN`);
    } else {
        console.log(`ID: ${res.id}`);
        fs.readFile('./templates/product.html', 'utf-8', function (err, data) {
            let currentProduct = loadedData['products'][req.id];

            let productHTML = "";
            productHTML += `<img src="${currentProduct['images'][0]}" height="200" width="200"/>\n`;
            productHTML += `<h4>${currentProduct['name']}</h4>\n`;
            productHTML += `<h2>${currentProduct['price']}</h2>\n`;
            productHTML += `<p>${currentProduct['description']}</p>\n`;

            res.write(data.replace('#productData', productHTML));
            res.end();
        });
    }

});


app.listen(process.env.PORT || 3000, () => console.log(`App available on http://localhost:3000`))

// DEFAULT JSON TEMPLATE
// {
//     "name": "",
//     "price": "",
//     "description": "",
//     "collection": "",
//     "images": [
//       "",
//       ""
//     ]
//   }