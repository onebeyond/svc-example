import React, { Component } from 'react'
import thunkMiddleware from 'redux-thunk';
import createBrowserHistory from 'history/createBrowserHistory'
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { reducer } from './reducer';
import { fetchCustomers } from './actions/customer-actions';
import './App.css'
import { Navbar, Nav, NavItem, Button, Alert } from 'react-bootstrap'
import { Router, Route, Switch } from 'react-router'
import CustomerTable from './components/customer/CustomerTable'

const history = createBrowserHistory()
const store = createStore(reducer, applyMiddleware(thunkMiddleware));
const ReduxCustomerTable = connect(mapStateToProps, mapDispatchToProps)(CustomerTable)

class App extends Component {

    constructor (props){
        super(props);
        this.state = { alert: {} }
        history.push('customers')
        this.handleLink = this.handleLink.bind(this)
        this.handleAlert = this.handleAlert.bind(this)
        this.handleAlertDismiss = this.handleAlertDismiss.bind(this)
    }

    componentWillMount() {
        store.dispatch(fetchCustomers());
    }

    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <div>
                        <Navbar>
                            <Nav>
                                <NavItem href='/customers' onClick={(e) => this.handleLink(e, 'customers')}><i className='fa fa-group'></i> Customers</NavItem>
                            </Nav>
                        </Navbar>

                        <div className='container'>

                            { this.state.alert.visible &&
                                <div className='row'>
                                    <div className='col-xs-6 col-sm-6 col-md-6 col-lg-6'>
                                        <Alert bsStyle={this.state.alert.style} onDismiss={this.handleAlertDismiss}>
                                          <h4>{this.state.alert.heading}</h4>
                                          <p>{this.state.alert.text}</p>
                                          <p>
                                            <Button onClick={this.handleAlertDismiss}>Dismiss</Button>
                                          </p>
                                        </Alert>
                                    </div>
                                </div>
                            }

                            <Switch>
                                <Route exact path='/customers' render={() => (
                                    <ReduxCustomerTable />
                                )}/>
                            </Switch>
                        </div>
                    </div>
                </Router>
            </Provider>
        )
    }

    handleLink(e, path) {
        e.preventDefault()
        history.push(path)
    }

    handleAlert(alert) {
        this.setState({ alert: alert})
    }

    handleAlertDismiss() {
        this.setState({ alert: {}})
    }

}

function mapStateToProps(state) {
    return {
        customers: state.customers,
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default App
