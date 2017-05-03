import uuid from 'uuid'

export const FETCH_CUSTOMERS_REQUEST = 'FETCH_CUSTOMERS_REQUEST'
function fetchCustomersRequest() {
    return { type: FETCH_CUSTOMERS_REQUEST }
}

export const FETCH_CUSTOMERS_SUCCESS = 'FETCH_CUSTOMERS_SUCCESS'
function fetchCustomersSuccess(customers) {
    return { type: FETCH_CUSTOMERS_SUCCESS, customers: customers }
}

export const FETCH_CUSTOMERS_FAILURE = 'FETCH_CUSTOMERS_FAILURE'
function fetchCustomersFailure(error) {
    return {type: FETCH_CUSTOMERS_FAILURE, error}
}

export function fetchCustomers() {
    return async (dispatch) => {
        dispatch(fetchCustomersRequest())

        const response = await fetch('/api/1.0/customers', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Request-ID': uuid.v4()
            }
        })
        const customers = await response.json()
        response.ok ? dispatch(fetchCustomersSuccess(customers))
                    : dispatch(fetchCustomersFailure({ alert: { visible: true, style: 'danger', heading: 'Error retriving customers', text: `${response.status}: ${response.statusText}` }}))
    }
}

