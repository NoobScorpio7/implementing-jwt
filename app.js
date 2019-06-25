const config = require("config");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


const routes = require("./routers/routes");


app.use((req, res, next)=>{
    //we say what we want to allow, you can whitelist IPs here or domains
    res.header("Access-Control-Allow-Origin", "*"); 
    //what kind of headers we are allowing
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");  
  
    //check for the options request from browsers
    //this will always be sent
    if(req.method === "OPTIONS"){
        //tell the browser what he can ask for
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        //we just respond with OK status code
        return res.status(200).json({
            "statusMessage": "ok"
        });
    }
   
    next();
  });
  
  app.use("/", routes);

  
  
  
  app.use((req,res,next)=>{
    const error = new Error("Unable to manage the request");
    //send a status code error
    error.status= 404;
    //forward the request with the error
    next(error);
  })
  
  //------------- error message
  app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        "error": {
            "message": error.message
        }
    })
  });
  
  if(!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtprivatekey is not defined');
    process.exit(1);
  }
  //listen function for Node / express
  app.listen(3000, ()=>{
    console.log("The server is running");
  })