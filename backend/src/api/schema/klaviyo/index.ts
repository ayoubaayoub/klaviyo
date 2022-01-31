const types = require('../types');
import * as graphql from 'graphql';
import {globalIdField} from 'graphql-relay';
import qs from 'qs';
import rp from 'request-promise';
import knex from '../../../services/db';
import {SimpleError} from '../../errors';
import randomatic from 'randomatic';
import crypto from "crypto"
import {v4 as uuid} from 'uuid';
import nodeBase64  from 'nodejs-base64-converter';
export async function connectKlaviyoUrl( obj, args, ctx){
	
	const { account_id, public_api_key, private_api_key } = ctx.account;
	const klaviyo_account = await  knex.select('id')
	       .table('klaviyo_accounts')
	       .where('public_api_key')
	       .first();
	if(klaviyo_account.length > 0){
		//the secret api key maybe change.
        await knex('klaviyo_accounts').where('public_api_key',public_api_key)
        .update({
       	  private_api_key
        });
	}else{
		await knex.table('klaviyo_accounts').insert({
		account_id: account_id,
		public_api_key: public_api_key,
		private_api_key: private_api_key
	});
	}       		
    const uri = `https://a.klaviyo.com/api/v2/lists?api_key=${nodeBase64.encode(api_key)}`;
    rp(uri).then(response=>{
		// console.log(response);
		if(response.status === 200){
			return ctx.loaders.Account.load(ctx.account.id);
		}
	}).catch(e=>{
		return false;
	});
	
}
