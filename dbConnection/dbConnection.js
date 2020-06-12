// const mongoose=require('mongoose');
// url='mongodb://172.16.6.89:27017/mdb'
// mongoose.connect(url),
// (err,result)=>{
//   console.log(err,result)
//   console.log('Connected to db:')

// }


const mongoose = require('mongoose');
const projectName = "mdb";
mongoose.connect(`mongodb://localhost:27017/${projectName}`,{
    useNewUrlParser : true,
    useUnifiedTopology : true
},
(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log(`Connected to Database ${projectName}`);
    }
}
);