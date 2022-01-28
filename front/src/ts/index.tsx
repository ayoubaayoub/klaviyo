import React, { Suspense, Fragment, useState } from 'react';
import {render} from 'react-dom';
import store from 'store';
import qs from 'qs';
import DataLoader from 'dataloader';

import {
	Router,
	Route,
	Switch,
} from 'react-router-dom';

import {Relay} from './relay'

import {
	Card,
	AddLink,
	LoadingSpinner,
	Modal,
	useRelayErrors,
	ErrorStripe,
	FormGroup,
	InputComponent,
	DeleteModalComponent,
	FunnelsListPickerApp,
} from '../../../lightfunnels-front/assets/js/components';

import {
 Button,
 Pane,
 Dialog,
 TextInputField,

}from 'evergreen-ui';


import {ErrorBoundary} from './components'

import {
	useLocalStore,
	Loaders,
} from '../../../lightfunnels-front/assets/js/data';

import {createBrowserHistory} from 'history';

import {
	useLazyLoadQuery,
	graphql,
	useRelayEnvironment,
	fetchQuery,
	useMutation,
	loadQuery,
	usePreloadedQuery,
} from 'react-relay';

import type {tsAppQuery, tsAppQueryResponse} from './__generated__/tsAppQuery.graphql';
import type {tsFunnelsListQuery} from './__generated__/tsFunnelsListQuery.graphql';
import type {tsConnectMutation} from './__generated__/tsConnectMutation.graphql';
import type {tsConnectRespMutation} from './__generated__/tsConnectRespMutation.graphql';
import type {tsDeleteMutation} from './__generated__/tsDeleteMutation.graphql';
import type {tsCreateMutation} from './__generated__/tsCreateMutation.graphql';

import '../styles/style.scss';

console.log('here');

const history = createBrowserHistory();

render(
	<div className="appContainer">
		<Router history={history}>
			<Switch>
				<Route path="/app" component={Middleware} />
				<Route path="/redirects/klaviyo" component={Redirect} />
				<Route component={Home} />
			</Switch>
		</Router>
	</div>,
	window.app
);
//my interface
interface Credentials {
  api_key: string;
  secret_key: string;
  order_name?: string;
}


/***************  MY COMPONENTS *******************/
//klaviyo model
function LightfunnelsPopUp(){
   const [isShown,setIsShown] = useState(false);
   const ToggelShowPopUp = (e)=>{
       e.preventDefault();
       setIsShown(!isShown);
   }
   const [credentials,setCredentials] = useState<Credentials>({
   	 api_key : '',
   	 secret_key: '',
   	 order_name: '',
   });
   const [isLoading,setIsLoading] = useState(false);
   const handleChange = (e)=>{
    	e.preventDefault();
   	  const { name,value } = e.target;
   	  setCredentials({...credentials,[name]:value});
   }
   const handleSubmit = (e)=>{

     e.preventDefault();
     setIsLoading(!isLoading);
     console.log('is loading :)');
     const [connectResponse, loading] = useMutation<tsKlaviyoConnectMutation>(
		  graphql`
				mutation tsKlaviyoConnectMutation($query: String!){
					KlaviyoConnectResponse(query: $query) {
	  			  api_key
	  			  api_secret
	  			  order_name
					}
				}
			`
	  );
     //make a query here
   }
   const { api_key,secret_key,order_name } = credentials;
   console.log(api_key,secret_key,order_name);
	return(
		<>	
			<Pane>
         <Dialog
	        isShown={isShown}
	        title="KLAVIYO CREDENTAILS"
	        onCloseComplete={() => setIsShown(false)}
	        hasFooter={false}
	        >
	       <form onSubmit = {handleSubmit} id = "kaliviyo_form"> 
		       <TextInputField
						  required
						  label="A required Order Name"
						  description="please enter your order name."
						  name = "order_name"
						  onChange = {handleChange}
						  value = {order_name}
						/> 
	         <TextInputField
						  required
						  label="A required API Key"
						  description="please enter your api_key."
						  name = "api_key"
						  onChange = {handleChange}
						  value = {api_key}
						/>
						<TextInputField
						  required
						  label="A required API Secret"
						  description="please enter your api_secret."
						  name = "secret_key"
						  onChange = {handleChange}
						  value = {secret_key}
						/>
						<Button  appearance = "primary" type="submit"  intent="success" isLoading = {isLoading} >submit</Button>
					</form> 
         </Dialog>
         <Button marginRight={23} appearance="primary" onClick={ToggelShowPopUp}>Add New</Button>
        </Pane>
       </>
       )
}
/**************** END MY COMPONENT *****************/

function Redirect(props) {

	const code = props.location.search;

	React.useEffect(
		function() {
			if(code){
				// sent code to parent
				window.opener.postMessage({code, from: 'klaviyo'}, '*');
				window.close();
			}
		}, [code]
	);

	return (
		<div className="redirect">
      <LoadingSpinner />
	  </div>
	)
}

function setupLoaders(env){
	return {
		Funnel: new DataLoader<number, {name: string, id: string, _id: number}>(
			function (ids) {
				return fetchQuery<tsFunnelsListQuery>(
					env,
					funnelsListQuery,
					{
						ids: ids
					}
				)
				.toPromise()
				.then(
					function(response){
						return response.funnelsList
					}
				)
			}
		),
	}
}

function Provider(props: {children: React.ReactNode}) {
	const env = useRelayEnvironment();

	const loaders = React.useMemo(
		function () {
			return setupLoaders(env);
		},
		[env]
	);

	return (
		<Loaders.Provider value={loaders as any}>
			{props.children}
		</Loaders.Provider>
	)
}

function Middleware(props){
	
	const q = React.useMemo(() => {
		return qs.parse(props.location.search, {ignoreQueryPrefix: true});
	}, [props.location.search]);

	const [token, setToken] = React.useState<undefined|string>(() => {
		return q['installation-id'] && store.get(installToKey(q['installation-id']))
	});

	React.useEffect(
		function(){

			if(q.code && q.state && q['account-id']){
				fetch(process.env.ApiURL + 'lightfunnels/connect-response', {
					method:'POST',
					headers:{
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						code: q.code,
						state: q.state,
						accountID: q['account-id']
					})
				})
				.then(resp => resp.json())
				.then(function(resp){
					store.set(installToKey(resp.id), resp.token);
					setToken(resp.token);
				});
			} else if(!token && q['account-id']){
				fetch(process.env.ApiURL + 'lightfunnels/connect-url', {
					method:'POST',
					headers:{
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						accountID: q['account-id'],
						redirectUrl: window.location.origin + '/app'
					})
				})
				.then(resp => resp.text())
				.then(function(resp){
					// console.log('1-',resp);
					window.location.href = resp;
				});
			}

		},[]
	);
	if(!token){
		return (
			<Fragment children={<LoadingSpinner />} />
		);
	}
	
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<Relay token={token}>
				<Provider>
					<ErrorBoundary>
						<App token={token} />
					</ErrorBoundary>
				</Provider>
			</Relay>
		</Suspense>
	);
}


function App(props){
	const [state, open, close] = Modal.useModalState();

	// fetch infos
	const resp = useLazyLoadQuery<tsAppQuery>(
		graphql`
			query tsAppQuery($offset: Int){
				records(offset: $offset){
					payment_id
				  order_id
				  klaviyo_order_id
				  created_at
				}
				connections{
				  id
				  _id
				  klaviyo_account{
				  	id
				  	klaviyo_account
				  }
				  funnel{
				  	id
				  	name
				  }
				}
				account{
					id
					klaviyo_accounts {
						_id
						id
  					klaviyo_account
					}
				}
			}
		`,
		{}
	);

	const [connectResponse, loading] = useMutation<tsConnectRespMutation>(
		graphql`
			mutation tsConnectRespMutation($query: String!){
				connectShopifyResponse(query: $query) {
					id
  				klaviyo_accounts {
						_id
						id
  					klaviyo_account
					}
				}
			}
		`
	);

	const account = resp.account;
	const connections = resp.connections;
	const records = resp.records;

	const isConnected = account.shops.length>0;

	const [isOpen, openForm] = React.useState<boolean>(false);
	const [del, setDel] = React.useState<number|null>(null);
	const [onError, errors, setErrors] = useRelayErrors();
	const [deleteCon, deleteConLoading] = useMutation<tsDeleteMutation>(
		graphql`
			mutation tsDeleteMutation($id: Int!){
				deleteConnection(id: $id)
			}
		`
	);

	React.useEffect(
		function() {
			function receiveMessage(e) {
				if(e.data.from === 'shopify'){
					connectResponse({
						variables: {
							query: e.data.code
						}
					})
				}
			}
			window.addEventListener('message', receiveMessage);

			return function() {
				window.removeEventListener('message', receiveMessage);
			}
		}, []
	);

	return (
		<div className="app">
			{
				del && (
					<DeleteModalComponent
						children="Are you sure you want to delete this connection? It can't be undone."
						title="Delete Connection"
						error={errors[""]}
						close={close}
						loading={deleteConLoading}
						call={
							function () {
								deleteCon({
									variables:{
										id: del
									},
									onError,
									updater(store){
										const root = store.getRoot();
										const newCons = root.getLinkedRecords('connections')!.filter(w => w.getValue('_id') !== del);
										root.setLinkedRecords(newCons, "connections");
									},
									onCompleted(data){
										if(data.deleteConnection){
											setDel(null);
										}
									}
								});
							}
						}
					/>
				)
			}
			{
				state && (
					<ModalShopify close={close} />
				)
			}
			<h1 className="">Connet Your Klaviyo Account</h1>
			<LightfunnelsPopUp />
			
			
			{
				isOpen && (
					<ConnectionForm closeForm={() => openForm(false)} shops={account.shops as tsAppQueryResponse['account']['shops']}/>
				)
			}
		</div>
	)
}


function ConnectionForm(props: {closeForm: () => void; shops: tsAppQueryResponse['account']['shops'];}){
	const [onError, errors, setErrors] = useRelayErrors();
	// const [create, loading] = useMutation<tsCreateMutation>(
	// 	graphql`
	// 		mutation
	// 	`

	const [state, onChange] = useLocalStore<{klaviyo_account: number|null; funnel: number|null}>({
		klaviyo_account: null,
		funnel: null
	});

	return(
		<Card title="Add Connection">
			{
				errors[''] && <ErrorStripe message={errors['']} />
			}
			{
				errors.shop_id && <ErrorStripe message={errors.shop_id} />
			}
			<div className="form">
				<FormGroup label="List (required)">
					<Shops
						shops={props.shops}
						shop={state.shop}
						onChange={(s: number) => onChange(['shop'], s)}
					/>
				</FormGroup>
				<FormGroup label="Funnel">
					<FunnelsListPickerApp
						cancellable
						error={errors.funnel_id}
						fragment={funnelsPaginationFragment}
						query={funnelsQuery}
						label="No Funnels"
						value={state.funnel}
						noCreateButton
						onChange={
							function(funnel_id){
								onChange(['funnel'], funnel_id);
							}
						}
					/>
				</FormGroup>
				<Button
					disabled={!state.shop || !state.funnel}
					className="createButton"
					children="Create Connection"
					spinning={loading}
					primary
					onClick={
						function() {
							create({
								variables: {
									node: {
										funnel_id: state.funnel as number,
										shop_id: state.shop as number
									}
								},
								onError,
								updater(store, data) {
									const root = store.getRoot();
									root.setLinkedRecords(
										root.getLinkedRecords('connections')!.concat(store.getRootField('createConnection')),
										"connections"
									);
								},
								onCompleted(){
									props.closeForm();
								}
							})
						}
					}
				/>
			</div>
		</Card>
	)
}

function Shops(props: {shops: tsAppQueryResponse['account']['shops']; shop: number|null; onChange: (l: number) => void}){
	const shops = props.shops;

	return (
		<Fragment>
			{
				(shops.length > 0) ? (
					<div className="listsGrid">
						{
							shops.map(
								function(s) {
									const isSelected = props.shop === s._id;
									return (
										<div
											className={`list ${isSelected ? 'active' : ''}`}
											key={s._id}
											onClick={
												function() {
													props.onChange(s._id);
												}
											}
										>
											{s.shop}
										</div>
									)
								}
							)
						}
					</div>
				) : (
					<div className="emptyTags">
						There are no lists
					</div>
				)
			}
		</Fragment>
	)
}

function Home(){
	return (
		<div className="home">
			<div>
				Welcome to the Lightfunnels' Shopify application.
			</div>
			<a href="https://lightfunnels.com/admin/apps" className="install">
				Install app
			</a>
		</div>
	)
}

export function ModalShopify(props: {close: () => void}) {
	const [onError, errors, setErrors] = useRelayErrors();
	const [state, onChange] = useLocalStore({
		store: '',
	})

	const [connect, loading] = useMutation<tsConnectMutation>(
		graphql`
			mutation tsConnectMutation($shop: String!, $redirectUri: String!) {
				connectShopifyUrl(shop: $shop, redirectUri: $redirectUri)
			}
		`
	);

	return(
		<Modal close={props.close}>
			<div className="modalConnect">
				<Modal.Title>
					Connect to Shopify
					<i
						className="icon-cancel-music"
						onClick={
							function() {
								props.close();
							}
						}
					/>
				</Modal.Title>
				<Modal.Body className="modalBody">
					{
						errors[""] && (
							<ErrorStripe message={errors[""]} />
						)
					}
					<div className="text">Enter your Shopify store to connect it to Lightfunnels.</div>
					<FormGroup label="Shopify store URL">
						<InputComponent
							placeholder="yourstore.myshopify.com"
							error={errors['shop']}
							onChange={onChange}
							value={state.store}
							name="store"
						/>
					</FormGroup>
				</Modal.Body>
				<Modal.Footer className="modalFooter" >
					<Button
						className="cancelButton"
						onClick={props.close}
					>
						Cancel
					</Button>
					<Button
						children="Connect Shopify"
						primary
						disabled={state.store.length === 0}
						spinning={loading}
						onClick={
							function () {
								connect({
					    		variables:{
					    			redirectUri: window.location.origin + '/redirects/shopify',
					    			shop: state.store
					    		},
					    		onError,
					    		onCompleted(response){
					    			props.close();
										const features = 'width=800, height=600, left=200, top=200';
        						const child = window.open(response.connectShopifyUrl, '', features);
					    		}
					    	})
							}
						}
					/>
				</Modal.Footer>
			</div>
		</Modal>
	)
}

function installToKey(id){
	return 'i' + id + '_token';
}

const funnelsQuery = graphql`
	query tsFunnelsQuery($first: Int, $after: String, $query: String!){
		...tsFunnelsPagination
	}
`;

const funnelsPaginationFragment = graphql`
  fragment tsFunnelsPagination on Query
  @refetchable(queryName: "tsFunnelsPaginationQuery") {
  	pagination: funnels(first: $first, after: $after, query: $query)
  	@connection(key: "funnels_pagination", filters:["query"]){
  		edges {
				node{
					id
					_id
					name
				}
			}
  		pageInfo{
  			endCursor
  			hasNextPage
  		}
  	}
  }
`;

const funnelsListQuery = graphql`
	query tsFunnelsListQuery($ids: [Int!]!){
		funnelsList(ids: $ids) {
			_id
		  id
		  name
		}
	}
`
