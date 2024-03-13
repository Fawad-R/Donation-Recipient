import React from 'react';
import { Provider } from 'react-redux'; // Import Provider
// import store from './yourReduxStore'; // Import your Redux store
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../DashboardComponents/index';

function PageProfile3() {
  return (
    // <Provider store={''}> {/* Wrap your app with Provider and pass the store */}
      <div>
        {/* <AppSidebar /> */}
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
          {/* <AppHeader /> */}
          <div className="body flex-grow-1 px-3">
           <p>fdfdfdf</p>
          </div>
          {/* <AppFooter /> */}
        </div>
      </div>
     
    {/* </Provider> */}
  );
}

export default PageProfile3;
