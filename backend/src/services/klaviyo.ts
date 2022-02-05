import rp from 'request-promise';
import { SimpleError } from '../api/errors';
import knex from './db';


export default function callApi({uri}:any){
	  	  
    return rp(uri).then(response=>{
        if(response.errors){
        	const er =new KlError();
        	er.errors = response.errors;
        	return Promise.reject(er);
        }
        return response;
      });
   }

class KlError extends Error{
	public errors: any[]
}