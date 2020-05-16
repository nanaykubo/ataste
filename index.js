//require the library needed
var express = require('express')

//mysql
var mysql = require('mysql');

//use the library
var app = express();

// to recognize incoming request
app.use(express.json());                        

//set the port
const port = 5000;

//load the express directory
app.use(express.static(__dirname));

//set mysql connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ataste"
});

//default 
app.post('/', function (req, res, next) {
    res.sendfile(__dirname + 'index.html');
    next();
});

//getStocks
app.get('/getStock', function (req, res , next) {
    var sql = "SELECT A.ItemCode,B.StockQty - SUM(OrderQty) as OrderQTY FROM `orders` A INNER JOIN stocks B ON A.ItemCode = B.ItemCode GROUP BY A.ItemCode";
    con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
    });
});

//getTodayOrders
app.get('/getTodayOrders', function (req, res , next) {
    var sql = "SELECT SUM(OrderQty) as OrderQTY FROM `orders` WHERE OrderDate = CURRENT_DATE()";
    con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
    });
});

//getOrders
app.get('/getOrders', function (req, res , next) {
    var sql = "SELECT * FROM `orders` A INNER JOIN `ordersdetail` B ON A.OrderID = B.OrderID WHERE B.DatePaid IS NOT NULL ORDER BY B.DatePaid ASC";
    con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
    });
});

//getTodaySales
app.get('/getTodaySales', function (req, res , next) {
    var sql = "SELECT SUM(B.Price) as Price FROM `orders` A INNER JOIN `ordersdetail` B ON A.OrderID = B.OrderID WHERE B.DatePaid IS NOT NULL AND B.OrderDate = CURRENT_DATE ORDER BY B.DatePaid ASC";
    con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
    });
});

//getTodayPendingPayment
app.get('/getTodayPendingPayment', function (req, res , next) {
    var sql = "SELECT SUM(B.Price) as Price FROM `orders` A INNER JOIN `ordersdetail` B ON A.OrderID = B.OrderID WHERE B.DatePaid IS NULL AND B.OrderDate = CURRENT_DATE ORDER BY B.DatePaid ASC";
    con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
    });
});

//getTodayPendingDelivery
app.get('/getTodayPendingDelivery', function (req, res , next) {
    var sql = "SELECT SUM(B.Price) as Price FROM `orders` A INNER JOIN `ordersdetail` B ON A.OrderID = B.OrderID WHERE B.DatePaid IS NOT NULL AND B.OrderDate = CURRENT_DATE ORDER BY B.DatePaid ASC";
    con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
    });
});

//getTodayPendingDelivery
app.get('/getTodayTrack', function (req, res , next) {
    var sql = `SELECT C.Picture,D.ItemName,COUNT(A.OrderID) as OrderQty, A.DateReceived, A.DatePaid
    FROM ordersdetail A
    INNER JOIN orders B
    ON A.OrderID = B.OrderID
    INNER JOIN users C 
    ON B.UserCode = C.UserCode
    INNER JOIN items D
    on B.ItemCode = D.ItemCode
    WHERE A.OrderDate = CURRENT_DATE
    GROUP BY A.OrderID
    ORDER BY A.OrderDate ASC`
    con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
    });
});

//getTodayPendingDelivery
app.get('/getTrack', function (req, res , next) {
    var sql = `SELECT C.Picture,D.ItemName,COUNT(A.OrderID) as OrderQty, A.DateReceived, A.DatePaid
    FROM ordersdetail A
    INNER JOIN orders B
    ON A.OrderID = B.OrderID
    INNER JOIN users C 
    ON B.UserCode = C.UserCode
    INNER JOIN items D
    on B.ItemCode = D.ItemCode
    GROUP BY A.OrderID
    ORDER BY A.OrderDate ASC`
    con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
    });
});

//getTotalSales
app.get('/getTotalSales', function (req, res , next) {
    var sql = "SELECT SUM(B.Price) as Price FROM `orders` A INNER JOIN `ordersdetail` B ON A.OrderID = B.OrderID WHERE B.DatePaid IS NOT NULL ORDER BY B.DatePaid ASC";
    con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
    });
});

//insertData
app.post('/insertData', function (req, res , next) {

    var sql = `INSERT INTO items (Name, Qty, Amount) VALUES ('${req.body.name}', '${req.body.qty}','${req.body.amt}')`;
    con.query(sql, function (err, result) {
    if (err) throw err;

    res.send(result);
    });
  
});

//updateData
app.post('/updateData', function (req, res , next) {

    var sql = `UPDATE items SET Name = '${req.body.name}',Qty = '${req.body.qty}',Amount = '${req.body.amt}' WHERE ID = '${req.body.id}'`;
    
    con.query(sql, function (err, result) {
        if (err) res.send(err);
        res.send(result);
    });
 
});

//deleteData
app.post('/deleteData', function (req, res , next) {
    var sql = `DELETE FROM items WHERE ID = '${req.body.id}'`;
    
    con.query(sql, function (err, result) {
        if (err) res.send(err);
        res.send(result);
    });
 
});

//site will listen to the port
var server = app.listen(port, function(){
    console.log('Server is running in port : ' + port);
});


