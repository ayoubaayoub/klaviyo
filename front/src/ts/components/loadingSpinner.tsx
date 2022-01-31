import React from 'react';
import {
 Pane,
 Spinner
}from 'evergreen-ui';
const LoadingSpinner = ()=>{
	return(
       <div>
       <Pane display="flex" alignItems="center" justifyContent="center" height={400}>
          <Spinner />
         </Pane>
       </div>
		)
}
export default LoadingSpinner;