const types = require('./types');
import * as graphql from 'graphql';
import {forwardConnectionArgs} from 'graphql-relay';

import {connectShopifyUrl, connectShopifyResponse} from './shopify';
import { connectKlaviyoUrl }  from './klaviyo';
import {account} from './accounts';
import {
  records,
  connections,
  createConnection,
  deleteConnection,
  funnels,
  funnelsList,
  KlaviyoAccounts,
} from './resources';

const Query = new graphql.GraphQLObjectType({
  name: "Query",
  fields: () => ({
    records:{
      type: graphql.GraphQLNonNull(graphql.GraphQLList(graphql.GraphQLNonNull(types.Record))),
      args:{
        offset:{type: graphql.GraphQLInt},
      },
      resolve: records
    },
    connections:{
      type: graphql.GraphQLNonNull(graphql.GraphQLList(graphql.GraphQLNonNull(types.Connection))),
      resolve: connections
    },
    account:{
      type: graphql.GraphQLNonNull(types.Account),
      resolve: account
    },
    funnels: {
      type: new graphql.GraphQLNonNull(types.FunnelsConnection),
      args: {
        query: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
        ...forwardConnectionArgs
      },
      resolve: funnels
    },
    funnelsList:{
      type: graphql.GraphQLNonNull(graphql.GraphQLList((types.Funnel))),
      args:{
        ids: {type: graphql.GraphQLNonNull(graphql.GraphQLList(graphql.GraphQLNonNull(graphql.GraphQLInt)))}
      },
      resolve: funnelsList
    },
    klaviyo_accounts:{
      type: graphql.GraphQLNonNull(graphql.GraphQLList(types.KlaviyoAccounts)),
      resolve: KlaviyoAccounts
    }
  })
});

//make change here to generate new schema.graphql
const Mutation = new graphql.GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    connectShopifyUrl,
    connectShopifyResponse: {
      type: graphql.GraphQLNonNull(types.Account),
      args:{
        query: {type: graphql.GraphQLNonNull(graphql.GraphQLString)}
      },
      resolve: connectShopifyResponse
    },
    createConnection:{
      type: graphql.GraphQLNonNull(types.Connection),
      args:{
        node: {type: graphql.GraphQLNonNull(types.ConnectionInput)}
      },
      resolve: createConnection
    },
    deleteConnection:{
      type: graphql.GraphQLID,
      args:{
        id: {type: graphql.GraphQLNonNull(graphql.GraphQLInt)}
      },
      resolve: deleteConnection
    },
    //klaviyo mutation
    createKlaviyoResponse: {
      type: graphql.GraphQLNonNull(types.Account),
      args:{
        query: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        resolve: connectKlaviyoUrl
      }
    }
  })
});

export default new graphql.GraphQLSchema({
	query: Query,
	mutation: Mutation
});