const express = require("express");
const bodyParser= require("body-parser");
const request = require("request");

const app=express();

app.use(express.static("public")); //aloow to transfer style.css & image require inside signup.html
app.use(bodyParser.urlencoded({extended: true}));//to access to parm of the request

// app.listen(3000, function(){//this work on dev mode, working on local
// 	console.log("server is running on port 3000");
// });

app.listen(process.env.PORT || 3000, function(){//this work on dev mode or on heroku enviroment, working on local
	console.log("server is running on port 3000");
});


app.get("/", function(req,res){ 

	res.sendFile(__dirname + "/signup.html"); //__dirname es una variable que identifica la ruta donde esta almacenado el archivo calculator.js en el proyecto
	//con sendFile permite enviar como respuesta un archivo. en este caso un html
});


app.post("/", function(req, res){
	var firstName = req.body.fName;
	var lastName = req.body.lName;
	var email = req.body.email;

	var data = {
		members:  [     //name "members" is define on mailchimp api
			{
				email_address:email,
				status:"subscribed",
				merge_fields:{
					FNAME: firstName,
					LNAME: lastName
				}
			}
		]
	}

	var jsonData = JSON.stringify(data);

	var options = {
		url: process.env.API_URL, //set on config vars of heroku. URL get from mailchimp
		method:"POST",
		headers: {
			"Authorization": process.env.AUTHORIZATION, //set on config vars of heroku. APi KEY get from mailchimp
		},
		body: jsonData  //coment this line to make the conection fail with mailchimp so you'll be able to test failure page
	}

	request(options, function(error, response, body){

		if(error){
			res.sendFile(__dirname + "/failure.html");
		}else{
			if(response.statusCode === 200 ){
				res.sendFile(__dirname + "/success.html");
			} else {
				res.sendFile(__dirname + "/failure.html");
			}
		}

	});

	console.log(firstName, lastName, email);
})//end aap.post

app.post("/failure", function(req,res){ 

	res.redirect("/"); //__dirname es una variable que identifica la ruta donde esta almacenado el archivo calculator.js en el proyecto
	//con sendFile permite enviar como respuesta un archivo. en este caso un html
});