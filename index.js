const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate.js');

//Blocking Synchronous

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is all what we know about: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log("Written successfully");


//Non-blocking Asynchronous

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     console.log(data1);
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);


//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, err => {
//                 console.log("Written successfully");
//             })
//         })
//     })
// });

// console.log("file reading...");

// -----------server-------------------
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');




const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);
const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);
const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    // console.log(req.url)
    // console.log(url.parse(req.url));


    // overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'content-type': 'text/html' });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join();
        const output = tempOverview.replace('{%PRODUCT_CARD%}', cardsHtml);


        res.end(output);
    }


    //products page
    else if (pathname === '/product') {
        res.writeHead(200, { 'content-type': 'text/html' });
        const slug = query.slug;
        const product = dataObj.find(el => slugify(el.productName, { lower: true }) === slug);
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }


    //API
    else if (pathname === '/api') {
        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
            const productsData = JSON.parse(data);
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(data);
        })

    }

    //page not found
    else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'Hello, world1'
        })
        res.end('<h1>page not found</h1>');
    }
})

server.listen(8000, 'localhost', () => {
    console.log('server listening on http://localhost:8000/');
});
