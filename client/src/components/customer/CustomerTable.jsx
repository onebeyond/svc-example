import React, { Component } from 'react'

class CustomerTable extends Component {

    render() {
        return <div>
            <h5>Customers</h5>
            <table className='table table-condensed table-striped customer'>
                <thead>
                    <tr>
                        <th className='id'>Id</th>
                        <th className='title'>Title</th>
                        <th className='firstName'>First Name</th>
                        <th className='lastName'>Last Name</th>
                        <th className='dob'>Date Of Birth</th>
                    </tr>
                </thead>
                <tbody>
                    { this.props.customers.length > 0 && this.props.customers.map(customer => {
                        return <tr key={customer.id}>
                            <td className='id'>{customer.id}</td>
                            <td className='title'>{customer.title}</td>
                            <td className='firstName'>{customer.firstName}</td>
                            <td className='lastName'>{customer.lastName}</td>
                            <td className='dob'>{customer.dateOfBirth}</td>
                        </tr>
                    }) }
                    { this.props.customers.length === 0 &&
                        <tr>
                            <td className='empty' colSpan='5'>No customers</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    }
}

export default CustomerTable
