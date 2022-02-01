/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type appConnectKlaviyoMutationVariables = {
    account_id: number;
    public_api_key: string;
    private_api_key: string;
};
export type appConnectKlaviyoMutationResponse = {
    readonly connectKlaviyoAccount: {
        readonly account_id: number;
        readonly public_api_key: string;
        readonly private_api_key: string;
    };
};
export type appConnectKlaviyoMutation = {
    readonly response: appConnectKlaviyoMutationResponse;
    readonly variables: appConnectKlaviyoMutationVariables;
};



/*
mutation appConnectKlaviyoMutation(
  $account_id: Int!
  $public_api_key: String!
  $private_api_key: String!
) {
  connectKlaviyoAccount(account_id: $account_id, public_api_key: $public_api_key, private_api_key: $private_api_key) {
    account_id
    public_api_key
    private_api_key
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "account_id"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "private_api_key"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "public_api_key"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "account_id",
        "variableName": "account_id"
      },
      {
        "kind": "Variable",
        "name": "private_api_key",
        "variableName": "private_api_key"
      },
      {
        "kind": "Variable",
        "name": "public_api_key",
        "variableName": "public_api_key"
      }
    ],
    "concreteType": "KlaviyoAccounts",
    "kind": "LinkedField",
    "name": "connectKlaviyoAccount",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "account_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "public_api_key",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "private_api_key",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "appConnectKlaviyoMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "appConnectKlaviyoMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "25e43a5984c469cf71ecab5451817a3e",
    "id": null,
    "metadata": {},
    "name": "appConnectKlaviyoMutation",
    "operationKind": "mutation",
    "text": "mutation appConnectKlaviyoMutation(\n  $account_id: Int!\n  $public_api_key: String!\n  $private_api_key: String!\n) {\n  connectKlaviyoAccount(account_id: $account_id, public_api_key: $public_api_key, private_api_key: $private_api_key) {\n    account_id\n    public_api_key\n    private_api_key\n  }\n}\n"
  }
};
})();
(node as any).hash = '97848514f800ac725e7aef39ce2cde23';
export default node;
