class AppError extends Error{
    public statusCode:number;
    public isOperatinal:boolean

    constructor (message:string,statusCode:number,isOperational:true)
    {
        super(message);
        this.statusCode=statusCode;
        this.isOperatinal=isOperational;
         Error.captureStackTrace(this,this.constructor)
    }
}

class ValidationError extends AppError
{
    
}