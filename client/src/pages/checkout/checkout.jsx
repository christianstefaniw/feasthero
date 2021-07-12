import React from 'react'
import { Elements } from "@stripe/react-stripe-js";
import { Row, Col } from 'react-bootstrap';

import InjectedPaymentForm from './components/payment/payment';
import EnsureBookingDetailsHOC from '../../hoc/ensure-booking-details/ensure-booking-details';
import OrderProgressBar from '../../components/order-progress/order-progress-bar';

import { loadStripe } from "@stripe/stripe-js";

import { settings } from '../../settings';


import './checkout.scss';
import BookingSummary from './components/booking-summary/booking-summary';


class Checkout extends React.Component {
    constructor() {
        super();
        this.stripe = loadStripe(settings.STRIPE_PUBLISHABLE_KEY);
    }

    render() {
        return (
            <>
                <OrderProgressBar paymentDetails />
                <Row className='justify-content-around'>
                    <Col md={4}>
                        <Elements stripe={this.stripe}>
                            <InjectedPaymentForm bookingDetails={this.props.bookingDetails} />
                        </Elements>
                    </Col>
                    <Col md={4}>
                        <BookingSummary bookingDetails={this.props.bookingDetails} />
                    </Col>
                </Row>

            </>
        )
    }
}


export default EnsureBookingDetailsHOC(Checkout);