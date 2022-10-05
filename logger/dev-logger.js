const {format,createLogger,transports} = require('winston');
const {combine,timestamp,printf,errors,colorize}=format;

function buildDevLogger(){
    const logformat=printf(({level,message,timestamp,stack})=>{
        return `${timestamp} ${level} ${stack || message}`;
    });
    return createLogger({
      level: 'info',
      format: combine(
        colorize(),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        errors({stack: true}),
        logformat
        ),
      transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
        new transports.Console()
      ],
    });
} 
module.exports=buildDevLogger;