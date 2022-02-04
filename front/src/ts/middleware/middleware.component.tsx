import React , 
{ 
useMemo,
useEffect, 
useState,
Suspense,
Fragment } from 'react';
export const Loaders = React.createContext<ReturnType<typeof setupLoaders>>(null as any);
import {Relay} from '../relay';
import { ErrorBoundary } from '../components';
import {
 Button,
 Pane,
}from 'evergreen-ui';
import LoadingSpinner from '../components/loadingSpinner.component';
import qs from 'qs';
import store from 'store';
import App from '../pages/app';
import {
	useLazyLoadQuery,
	graphql,
	useRelayEnvironment,
	fetchQuery,
	useMutation,
	loadQuery,
	usePreloadedQuery,
} from 'react-relay';
import DataLoader from 'dataloader';
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
}//end setupLoader
function Provider(props: {children: React.ReactNode}) {
	const env = useRelayEnvironment();
	const loaders = useMemo(
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

export function Middleware(props){
	
	const q = useMemo(() => {
		return qs.parse(props.location.search, {ignoreQueryPrefix: true});
	}, [props.location.search]);

	const [token, setToken] = useState<undefined|string>(() => {
		return q['installation-id'] && store.get(installToKey(q['installation-id']))
	});

	useEffect(
    		function(){
            console.log('hello .....)');
			if(q.code && q.state && q['account-id']){
				// console.log('query',q);
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
					// console.log(resp);
					// console.log('1-',resp);
					window.location.href = resp;
				});
			}
		},[]
	);

	if(!token){
		return (
			<Fragment children={<LoadingSpinner/>} />
		);
	}
	
	return (
		<Suspense fallback= {<LoadingSpinner />}>
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

function installToKey(id){
	return 'i' + id + '_token';
}
