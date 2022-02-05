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
import klaviyo from '../../../services/klaviyo';

export async function connectKlaviyoAccount( _, args, ctx:ApiContext){
	// understand how global catch work
	// make sure this function returns the requested data
	// make sure the code is clean and well formated
	// create a function/class in the services folder to handle 3th party apis

	const { account_id, public_api_key, private_api_key } = args;
	const uri = `https://a.klaviyo.com/api/v1/lists?api_key=${private_api_key}`;
	
	return klaviyo({
					  uri
					}).then(async res=>{
						if(res.errors){
							throw new SimpleError('missing_klaviyo_keys');
						}else if(JSON.parse(res).data.length){
					    await knex.table('klaviyo_accounts')
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
					     }
					});
       }
