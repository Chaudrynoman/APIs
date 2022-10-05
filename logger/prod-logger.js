const {format,createLogger,transports} = require('winston');
const {combine,timestamp,errors,json}=format;

function buildProLogger(){
    return createLogger({
      level: 'info',
      format: combine(
        timestamp(),
        errors({stack: true}),
        json()
        ),
      defaultMeta: { service: 'user-service' },
      transports: [
        new transports.Console()
      ],
    });
} 
module.exports=buildProLogger;