export interface validationResult<T>
{
    success:boolean;
    data?:T;
    errors?:Record<string,string[]>;
}

export type UserRole='user'|"admin";
export interface {
    
}
