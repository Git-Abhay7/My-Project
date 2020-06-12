const express=require('express');
const app=express();
//const swaggerjs=require('swagger-jsdoc ')
//const swaggerui=require('swagger-ui-express')
// const morgan=require('morgan')
const bodyParser =require('body-parser')
require('./dbConnection/dbConnection')
const userRouter=require('./routes/userRouter')
 const hospitalRouter=require('./routes/hospitalRouter')
// app.use(morgan('tiny'))

app.use(bodyParser.urlencoded({extended:true,limit:'50 mb'}))

app.use(bodyParser.json());
app.use('/user',userRouter);
 app.use('/userhospital',hospitalRouter)
const port=8080;
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

var swaggerDefinition = {
  info: {
    title: 'PixalApp',
    version: '2.0.0',
    description: 'Documentation of Pixal Application',
  },
  host: '172.16.6.89:8080',
  basePath: '/',
};
var options = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./routes/*.js']
};

var swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);


});

// initialize swagger-jsdoc
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(port,(err,result)=>{
    if(err){
        console.log("err")
    }
    else{
        console.log(`Server is running at:${port}`)
    }
})

// var http = require('http');

// let server = http.createServer(app)
// let io = require('socket.io')(server)









// server.listen(port,()=>{
//     console.log(`Server is at ${port}`);
    
// })



// //********************************************* Socket Connection *****************************************/

// io.on('connection', (socket) => {
 
//     console.log('New user connected', "totalUser>>>>",
    
//     "socket Ids>>>", socket.id)

// })
