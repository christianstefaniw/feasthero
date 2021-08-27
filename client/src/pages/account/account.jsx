import React from 'react';
import { connect } from 'react-redux';

import Logout from './components/logout/logout';
import WithAuth from '../../hoc/with-auth/with-auth';
import { CHEF, CUSTOMER } from '../../constants/app-constants';

import './account.scss';
import ChefAccount from './components/chef/chef-account';
import CustomerAccount from './components/customer/customer-account';

class Account extends React.Component {
    chooseWhichAccountComponentToRender() {
        const accountType = this.props.account.accountData.type;
        if (accountType === CHEF)
            return <ChefAccount account={this.props.account} />
        if (accountType === CUSTOMER)
            return <CustomerAccount account={this.props.account} />
        return <></>
    }

    render() {
        return (
            <>
                {this.chooseWhichAccountComponentToRender()}
                <Logout />
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        account: state.account,
    }
}


export default connect(mapStateToProps)(WithAuth(Account));