const url = require('url');
const Connection = require('pg').Pool;
const myconnect = new Connection({
    user:'hnbbgcssrlmkrx',
	host:'ec2-3-234-22-132.compute-1.amazonaws.com',
	database:'d17kdnl5hlf2q1',
	password:'4f54c669f876c971f777ca7d49d4ed95824b54b8ca0adf50a3062a9acb38eaa2',
	port:'5432',
	ssl: {
		rejectUnauthorized: false,
  },
});
var queryResult;
myconnect.query('SELECT * FROM public."category"',(error,results)=>{
    if(error){
        console.log(error);
        return;
    }
    queryResult = results;
    console.log(results);
});
var queryResult1;
myconnect.query('SELECT * FROM public."customer"',(error,results)=>{
    if(error){
        console.log(error);
        return;
    }
    queryResult1 = results;
    console.log(results);
});

const express = require('express');
const app = express();
const path = require ('path');
const router = express.Router();
const port = process.env.PORT || 3000; 


router.get('/home',(req,res)=>{
   res.sendFile(path.join(__dirname +'/home.html'));
});
//customer
router.get('/customer',(req,res)=>{
	var q = url.parse(req.url,true);
	console.log(q);
	var qparams = q.query;
	console.log(qparams);
	if (qparams.cusid && qparams.cusname && qparams.cusaddr)
	{
		console.log(qparams);
		var queryString = `INSERT INTO public."customer" (customerid,customer_name,address,email,phone) 
			VALUES ('${qparams.cusid}','${qparams.cusname}','${qparams.cusaddr}','${qparams.cusemail}','${qparams.cusphone}')`; 
		console.log(queryString);
		myconnect.query(queryString, (error,results) => {if (error)
			{
				console.log(error);
				res.send('Error:Your Insert query has been Failed');
				return;
			}
				else console.log(results);
		});
		res.sendFile(path.join(__dirname + '/customer.html'));
	}
	else
		res.sendFile(path.join(__dirname + '/customer.html'));
});

router.get('/viewcustomer',(req,res)=>{
    var queryResult;
	myconnect.query('SELECT * FROM public."customer"',(error,results) => {
	if (error)
	{
		console.log(error);
		return;
	}
	queryResult = results;
	console.log(results);
	var tableRow = '';
	var i;
	for (i = 0; i < queryResult.rowCount; i++)
	{
		tableRow = tableRow + `<tr>
			<td >${queryResult.rows[i].customerid}</td>
			<td >${queryResult.rows[i].customer_name}</td>
			<td >${queryResult.rows[i].address}</td>
			<td >${queryResult.rows[i].email}</td>
			<td >${queryResult.rows[i].phone}</td>
		</tr>`;
	}
	res.send( `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">
		<title>ATN Sales Management </title>
	<body>
		<header>
			<div class="NavBox">
			<nav class="navbar navbar-default">
			<div class="container-fluid" style="margin-left: 500px;">
				<div class="navbar-header">
				<a class="navbar-brand" href="#">ATN SALES MANAGEMENT</a>
				</div>
				<ul class="nav navbar-nav">
					<li><a href="home"> Home</a></li>
					<li><a href="viewproduct"> View Product</a></li>
					<li><a href="viewcustomer"> View Customer</a></li>
					<li><a href="viewcategory"> View Category</a></li>
				</ul>
			</div>
			</nav>
				<div style="margin-left:200px;">
					<table style="width:80%" class="table table-striped">
						<tr>
						  <th>${queryResult.fields[0].name}</th>
						  <th>${queryResult.fields[1].name}</th>												  
						  <th>${queryResult.fields[4].name}</th>
						  <th>${queryResult.fields[2].name}</th>
						  <th>${queryResult.fields[3].name}</th>
						</tr>
						${tableRow}
					  </table>
				</div>
			</div>
		</header>
	</body>
	</html>`);
});
});
//end customer


router.get('/product',(req,res)=>{
	var queryResult;
	myconnect.query('SELECT catename FROM public."category" ',(error,results) => {
	if (error)
	{
		console.log(error);
		return;
	}
	queryResult = results;
	console.log(results);
	var tableRow = '';
	var i;
	var selettag ='<select name="category">';
	for (i = 0; i < queryResult.rowCount; i++)
	{
		selettag += `<option>${queryResult.rows[i].catename}</option>`
	}
	selettag += "</select>";

	res.send( `<!DOCTYPE html>
	<html lang="en">
	<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">
    <title>ATN Sales Management </title>
</head>
<body> 
<header>
        <div class="NavBox">
        <nav class="navbar navbar-default">
        <div class="container-fluid" style="margin-left: 500px;">
            <div class="navbar-header">
            <a class="navbar-brand" href="#">ATN SALES MANAGEMENT</a>
            </div>
            <ul class="nav navbar-nav">
                <li><a href="home"> Home</a></li>
                <li><a href="viewproduct"> View Product</a></li>
                <li><a href="viewcustomer"> View Customer</a></li>
                <li><a href="viewcategory"> View Category</a></li>
            </ul>
        </div>
        </nav>
             
        </div>
    </header>
	<div class="Form" style="margin-left:600px;margin-right:600px;">
		<form action="" method="get">
			<div class="form-group"> 
				<label>Product ID</label>

				<input type="text" class="form-control" value="" name="productid">
			</div>
			<div class="form-group"> 
				<label>Product Name</label>

				<input type="text" class="form-control" value="" name="productname">
			</div>
			<div class="form-group">
				<label>Product Category</label>

				${selettag}
			</div>
			<div class="form-group">
				<label>Product Price</label>

				<input type="text" class="form-control" value="" name="productprice">
			</div>
			<div class="form-group">
				<label>Product Descriptions</label>

				<input type="textarea" class="form-control" value="" name="productdesc">
			</div>
			<input class="submit" name="submit" type="submit" value="ADD PRODUCT">
		</form>
	</div>
	</body>
	</html>`);
	var q = url.parse(req.url,true);
	console.log(q);
	var qparams = q.query;
	console.log(qparams);
	if (qparams.productid && qparams.productname && qparams.category)
	{
		console.log(qparams);
		var queryString = `INSERT INTO product (id,product_name,category,price,description) 
			VALUES ('${qparams.productid}','${qparams.productname}','${qparams.category}','${qparams.productprice}','${qparams.productdesc}')`; 
		console.log(queryString);
		myconnect.query(queryString, (error,results) => {if (error)
			{
				console.log(error);
				res.send('Error:Your Insert query has been Failed');
				return;
			}
				else console.log(results);
		});
	}

});
});


router.get('/viewproduct',(req,res)=>{
    var queryResult;
	myconnect.query('SELECT * FROM public."product" ',(error,results) => {
	if (error)
	{
		console.log(error);
		return;
	}
	queryResult = results;
	console.log(results);
	var tableRow = '';
	var i;
	for (i = 0; i < queryResult.rowCount; i++)
	{
		tableRow = tableRow + `<tr>
			<td >${queryResult.rows[i].id}</td>
			<td >${queryResult.rows[i].product_name}</td>
			<td >${queryResult.rows[i].category}</td>
			<td >${queryResult.rows[i].price}</td>
			<td >${queryResult.rows[i].description}</td>
		</tr>`;
	}
	res.send( `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">
		<title>ATN Sales Management </title>	
	</head>
	<body>
		<header>
			<div class="NavBox">
			<nav class="navbar navbar-default">
			<div class="container-fluid" style="margin-left: 500px;">
				<div class="navbar-header">
				<a class="navbar-brand" href="#">ATN SALES MANAGEMENT</a>
				</div>
				<ul class="nav navbar-nav">
					<li><a href="home"> Home</a></li>
					<li><a href="viewproduct"> View Product</a></li>
					<li><a href="viewcustomer"> View Customer</a></li>
					<li><a href="viewcategory"> View Category</a></li>
				</ul>
			</div>
			</nav>
				<div style="margin-left:200px;">
					<table style="width:80%" class="table table-striped">
						<tr>
						  <th>${queryResult.fields[0].name}</th>
						  <th>${queryResult.fields[1].name}</th>
						  <th>${queryResult.fields[2].name}</th>
						  <th>${queryResult.fields[3].name}</th>
						  <th>${queryResult.fields[4].name}</th>
						</tr>
						${tableRow}
					  </table>
				</div>
			</div>
		</header>
	</body>
	</html>`);
});
});

//end product

//category
router.get('/category',(req,res)=>{
	var q = url.parse(req.url,true);
	console.log(q);
	var qparams = q.query;
	console.log(qparams);
	if (qparams.cateid && qparams.catename && qparams.catedesc)
	{
		console.log(qparams);
		var queryString = `INSERT INTO public."category" (cateid,catename,catedesc) 
			VALUES ('${qparams.cateid}','${qparams.catename}','${qparams.catedesc}')`; 
		console.log(queryString);
		myconnect.query(queryString, (error,results) => {if (error)
			{
				console.log(error);
				res.send('Error:Your Insert query has been Failed');
				return;
			}
				else console.log(results);
		});
		res.sendFile(path.join(__dirname + '/category.html'));
	}
	else
		res.sendFile(path.join(__dirname + '/category.html'));
});
router.get('/viewcategory',(req,res)=>{
    var queryResult;
	myconnect.query('SELECT * FROM public."category" ',(error,results) => {
	if (error)
	{
		console.log(error);
		return;
	}
	queryResult = results;
	console.log(results);
	var tableRow = '';
	var i;
	for (i = 0; i < queryResult.rowCount; i++)
	{
		tableRow = tableRow + `<tr>
			<td >${queryResult.rows[i].cateid}</td>
			<td >${queryResult.rows[i].catename}</td>
			<td >${queryResult.rows[i].catedesc}</td>
		</tr>`;
	}
	res.send( `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">
		<title>ATN Sales Management </title>	
	</head>
	<body>
		<header>
		<div class="NavBox">
		<nav class="navbar navbar-default">
		<div class="container-fluid" style="margin-left: 500px;">
			<div class="navbar-header">
			<a class="navbar-brand" href="#">ATN SALES MANAGEMENT</a>
			</div>
			<ul class="nav navbar-nav">
				<li><a href="home"> Home</a></li>
				<li><a href="viewproduct"> View Product</a></li>
				<li><a href="viewcustomer"> View Customer</a></li>
				<li><a href="viewcategory"> View Category</a></li>
			</ul>
		</div>
		</nav>
				<div style="margin-left:200px;">
					<table style="width:80%" class="table table-striped">
						<tr>
						  <th>${queryResult.fields[0].name}</th>
						  <th>${queryResult.fields[1].name}</th>
						  <th>${queryResult.fields[2].name}</th>
						</tr>
						${tableRow}
					  </table>
				</div>
			</div>
		</header>
	</body>
	</html>`);
});
});
//end category


router.get('/checkout',(req,res) => {
	var q = url.parse(req.url,true);
	console.log(q);
	var qparams = q.query;
	console.log(qparams);
	if (qparams.form)
	{
		console.log(qparams.form);
		switch (qparams.form)
		{
		case "ADD":
			myconnect.query(`SELECT * FROM public."product" WHERE public."product".id = '${qparams.productid}'`,
			(error,results) => {
				if (error)
				{
					console.log(error);
					returns;
				}
				var productPrice =results.rows[0].price;
				var productName = results.rows[0].product_name;
				console.log(productPrice);
				console.log(productName);
				var total = qparams.quantity * productPrice
				res.send(`<!DOCTYPE html>
				<html lang="en">
				<head>
				<meta charset="UTF-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
				<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">
				<title>ATN Sales Management </title>
				</head>
					<body>
					<header>
					<div class="NavBox">
					<nav class="navbar navbar-default">
					<div class="container-fluid" style="margin-left: 500px;">
						<div class="navbar-header">
						<a class="navbar-brand" href="#">ATN SALES MANAGEMENT</a>
						</div>
						<ul class="nav navbar-nav">
							<li><a href="home"> Home</a></li>
							<li><a href="viewproduct"> View Product</a></li>
							<li><a href="viewcustomer"> View Customer</a></li>
							<li><a href="viewcategory"> View Category</a></li>
						</ul>
					</div>
					</nav>
					</div>
				</header>
					<form action="checkout" method="get" style="margin-left:600px;margin-right:600px;">
						<div>	
							<h1>Check-out/Invoice Information</h1>
							<div class="form-group">
								<label>Invoice ID</label>
								<input class="form-control" type="text" name="invoiceid" value="${qparams.invoiceid}">
							</div>
							<div class="form-group">
								<label>Invoice Date</label>
								<input class="form-control" type="date" name="invoicedate" value="${qparams.invoicedate}">
							</div>
				
							<h1>Check-out/Invoice Details</h1>
							<div class="form-group">
								<label>Product ID</label>
								<input class="form-control" type="text" name="productid" value="${qparams.productid}">
							</div>
							<div class="form-group">
								<label>Quantity</label>
								<input class="form-control" type="text" name="quantity" value="${qparams.quantity}">	
							</div>  
							<div class="form-group">
								<label>Price</label>
								<input class="form-control" type="text" name="price" value="${productPrice}">	
							</div>  
							<div class="form-group">
								<label>Total</label>
								<input class="form-control" type="text" name="total" value="${total}">	
							</div>  
							<input type="submit" name="form" value="Submit">
							
						</div>
					</form>
					</body>
				</html>`);
			});
			break;
		case"Submit":
		var queryString = `INSERT INTO public."invoice" (id,date,productid,price,quantity,total) 
		VALUES ('${qparams.invoiceid}','${qparams.invoicedate}','${qparams.productid}','${qparams.price}','${qparams.quantity}','${qparams.total}')`; 
		console.log(queryString);
		myconnect.query(queryString, (error,results) => {if (error)
		{
			console.log(error);
			res.send('Error:Your Insert query has been Failed');
			return;
		}
			else console.log(results);
			res.sendFile(path.join(__dirname + '/checkout.html'));	
	});
		break;
		default:
			break;
		}
	}
	else
		res.sendFile(path.join(__dirname + '/checkout.html'));
});
app.use('/', router);

app.listen(port);