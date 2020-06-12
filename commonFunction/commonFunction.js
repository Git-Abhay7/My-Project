const nodemailer=require('nodemailer');
const twilio=require('twilio');
module.exports={

    sendmail:(email,data,subject,callback)=>{
      
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'node-trainee@mobiloitte.com',
              pass: 'Mobiloitte1'
            }
          });
          
          var mailOptions = {
            from:'node-trainee@mobiloitte.com',
            to: email,
            subject: subject,
            text : data
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              callback(error,null)
            } else {
              callback(null,info)
            }
          });
    },
    sms:(mobileNumber,otp,subject,callback)=>{
    const accountSid = 'ACbe92138d0578b9a5358d8471d5cdb77d'
    const authToken = 'c1d1a18469e8c749989426ec4056aa80';
    
    client=new twilio(accountSid,authToken)
    client.messages .create({
         body: 'sms is:',
         from: '+17324167068',
         to: '+91 7065489953',
       },
    
    (err,result)=>{
      if(err)
      {
        callback(err,null)
      }
      else 
      {
        callback(null,result)
      }
    })
}};
  


    

    