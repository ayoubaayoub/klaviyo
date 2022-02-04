import React, {Suspense, Fragment, useState} from 'react';
import {render} from 'react-dom';
import store from 'store';
import { Middleware } from './middleware/middleware.component';
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
	// Button,
	Modal,
	useRelayErrors,
	ErrorStripe,
	FormGroup,
	InputComponent,
	DeleteModalComponent,
	FunnelsListPickerApp,
} from '../../../lightfunnels-front/assets/js/components';
import { ErrorBoundary } from './components'
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
import '../styles/style.scss';

console.log('here');

const history = createBrowserHistory();

render(
	<div className="appContainer">
		<Router history={history}>
			<Switch>
				<Route path="/app" component={Middleware} />
				<Route component={Home} />
			</Switch>
		</Router>
	</div>,
	window.app
);

function Redirect(props) {

	const code = props.location.search;

	React.useEffect(
		function() {
			if(code){
				// sent code to parent
				window.opener.postMessage({code, from: 'shopify'}, '*');
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


