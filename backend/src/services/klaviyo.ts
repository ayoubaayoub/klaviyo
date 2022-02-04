import rp from 'request-promise';
import { SimpleError } from '../api/errors';
import knex from './db';

type options = {
	uri: string;
	account_id: number;
	public_api_key: string;
	private_api_key: string;
}

export default function callapi({uri,account_id,public_api_key,private_api_key}:options){
	 return  rp(uri).then(
		async response=>{

			if(JSON.parse(response).data.length){

				await knex
						.table('klaviyo_accounts')
						.insert({
							account_id,
							public_api_key,
							private_api_key
						})
						.onConflict()
						.merge({
							private_api_key: knex.raw('values(private_api_key)'),
							id: knex.raw('LAST_INSERT_ID(id)')   
						});

				return { 
			  	"public_api_key" :public_api_key,
		      "account_id" : account_id,
		      "private_api_key": private_api_key
				};
			}else{
				let er  = new KlError();
				er.errors = 'error api_key or private_ke is wrong'; 
				return Promise.reject(e);
			}
			}
)
.catch(e=>{
	let  error = JSON.stringify(e);
	let status = JSON.parse(error).statusCode;
  if(( status !== 200) || (status === 403))
  {
  	let e = new KlError();
  	e.errors = JSON.stringify(error).error; 
    return Promise.reject(e);
  };
});
}
class KlError extends Error{
	errors: any[]
}