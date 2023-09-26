let SERVER_NAME = 'products-api'
let PORT = 3000;
let HOST = '127.0.0.1';

let postCounter = 0;
let getCounter = 0;

let errors = require('restify-errors');
let restify = require('restify')

  // Get persistence engine for the products
  , productsSave = require('save')('products')

  // Creating the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  // Log requests and responses
  server.use((req, res, next) => {
    console.log(`${req.method} ${req.url}: received request`);
    next();
  });

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('**** Resources: ****')
  console.log('********************')
  console.log(' /products')
  console.log(' /products/:id')    
})


// Get all products in the system
server.get('/products', function (req, res, next) {
    console.log('GET /products params=>' + JSON.stringify(req.params));
    getCounter++;
    console.log('GET:' + getCounter, 'POST: ' + postCounter)
  
    // Find every entity within the given collection
    productsSave.find({}, function (error, products) {
  
      // Return all products within the system
      res.send(products)
      console.log(`${req.method} ${req.url}: sending response`);
      console.log('GET /products: all products redeemed')
    })
  })

// Retrieve each product by product id
server.get('/products/:id', function (req, res, next) {
  console.log('GET /products/:id params=>' + JSON.stringify(req.params));
  getCounter++;
  console.log('GET:' + getCounter, 'POST: ' + postCounter)



  // Searching each product by id 
  productsSave.findOne({ _id: req.params.id }, function (error, product) {

    // If there are some errors
    if (error) {
      return next(new Error(JSON.stringify(error.errors)))
    }

    console.log(`${req.method} ${req.url}: sending response`);

    if (product) {
      // Release the product if no issues
      res.send(product)
      console.log('GET /products/:id: A product redeemed')
    } else {
      // if the product doesn't exist
      res.send(404)
    }
  })
})
