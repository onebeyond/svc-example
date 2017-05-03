import {
    FETCH_CUSTOMERS_REQUEST, FETCH_CUSTOMERS_SUCCESS, FETCH_CUSTOMERS_FAILURE
} from './actions/customer-actions'

const initialState = {
  customers: [],
  isLoading: false,
  alert: {},
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CUSTOMERS_REQUEST:
            return Object.assign({}, state, {
                isLoading: true
            });
            case FETCH_CUSTOMERS_SUCCESS:
                return Object.assign({}, state, {
                    customers: action.customers,
                    isLoading: false
                });
            default:
                return state;
            }
}
