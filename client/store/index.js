import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import userReducer from './user'

const rootReducer = combineReducers({
  user: userReducer
  //add more reducers here if needed
})

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware,
     createLogger({collapsed:true}))
)

const store = createStore(rootReducer,middleware)

export default store
export * from './user'
