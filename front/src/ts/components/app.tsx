import React, { useState } from 'react';
import {
 Button,
 Pane,
 Dialog,
 TextInputField, 

}from 'evergreen-ui';
import {createPortal} from 'react-dom';
import hotkeys from 'hotkeys-js';
import {
	useLazyLoadQuery,
	graphql,
	useRelayEnvironment,
	fetchQuery,
	useMutation,
	loadQuery,
	usePreloadedQuery,
} from 'react-relay';

export function Modal(props) {
  return !(props.active === false) ? (
    createPortal(
      <SubmodalContent {...props} />,
      modalRoot
    )
  ) : null;
}
Modal.useModalState = function(initState: boolean = false) {

  let [s, ss] = React.useState(initState);

  return [
    s,
    function open () {ss(true)},
    function close () {ss(false)}
  ] as const;
}

export function SubmodalContent(props) {
  React.useEffect(
    function () {
      if(!props.close){
        return;
      }
      hotkeys(
        'escape',
        'all',
        function (event) {
          props.close();
        }
      );
    },
    []
  );
  return (
    <div className={styles.modal + ' ' + (props.className || '')} >
      <div className="overlay" onClick={props.close} />
      <props.children.type {...props.children.props} className={(props.children.props.className || '') + ' ' + styles.contentWrapper} />
    </div>
  )
}

interface Credentials {
  api_key: string;
  secret_key: string;
  order_name?: string;
}
//klaviyo model
function LightfunnelsPopUp(){
   const [isShown,setIsShown] = useState(false);
   const ToggelShowPopUp = (e)=>{
       e.preventDefault();
       //create a mutation query.
       


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
     setTimeout(()=>{
     	setIsLoading(false);
     },3000);
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
         {/*<Button marginRight={12} appearance="primary" onClick={Cancel}>Cancel</Button>*/}
        </Pane>
       </>
       )
}


const App = (props)=>{
	return (
		<div className="app">
			<h1 className="">Connet Your Klaviyo Account</h1>
			<LightfunnelsPopUp />
		</div>
	)
}
export default App;