import React from 'react'
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
      <div>Hello Template</div>
  </Provider>,
  document.getElementById('app') //make sure this is the same as the id of the div in your public/index.html

)
