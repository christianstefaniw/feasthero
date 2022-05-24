import React, { useState } from 'react';
import { CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { Col, Form, Row, Image } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import { useDispatch, useSelector } from 'react-redux';

import { settings } from '../../../../settings';
import poweredbystripe from '../../../../assets/resources/images/powered-by-stripe.png';

import { checkout as checkoutAction } from '../../../../services/checkout/actions';
import history from '../../../../history';
import { selectBookingDetails } from '../../../../services/checkout/selectors';

import './payment.scss';


const InjectedPaymentForm = (props) => {
    return (
        <ElementsConsumer>
            {({ elements, stripe }) => (
                <Payment elements={elements} stripe={stripe} {...props} />
            )}
        </ElementsConsumer>
    );
};

function Payment(props) {
    const [loading, setLoading] = useState(false);
    const [cardError, setCardError] = useState('');
    const recaptchaRef = React.createRef();
    const dispatch = useDispatch();

    const { stripe, elements } = props;

    const errors = useSelector(state => state.checkout.checkoutErrors);
    const bookingDetails = useSelector(selectBookingDetails);

    const handleChange = ({ error }) => {
        if (error)
            setCardError(error.message);
        else
            setCardError('');
    }


    const handleSubmit = async (evt) => {
        evt.preventDefault();

        if (cardError)
            return;

        if (stripeIsUninitialized())
            return;

        const card = elements.getElement(CardElement);

        setLoading(true);
        await dispatch(checkoutAction(card, stripe, recaptchaRef.current.getValue()));
        setLoading(false);

    }

    const stripeIsUninitialized = () => {
        return !stripe || !elements;
    }

    const cardElementOptions = () => {
        return {
            hidePostalCode: true,
            style: {
                base: {
                    color: '#303238',
                    fontSize: '16px',
                    fontSmoothing: 'antialiased',
                    '::placeholder': {
                        color: '#CFD7DF',
                    },
                },
                invalid: {
                    color: '#e5424d',
                    ':focus': {
                        color: '#303238',
                    },
                },
            },
        };
    }

    return (
        <div id='payment'>
            <Form onSubmit={handleSubmit}>
                <div id='card-element-container'>
                    <p className='text-center'>Pay with card</p>
                    <Form.Group>
                        <CardElement className='mb-3' onChange={handleChange} options={cardElementOptions()} />
                        <span className='text-danger'>{cardError}</span>
                        <div className='my-4'>
                            <div className='d-flex justify-content-center'>
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={settings.RECAPTCHA_SITE_KEY}
                                />
                            </div>
                            <span className='text-danger d-block text-center'>{errors['recaptcha']}</span>
                        </div>

                        <button className='pay-btn mat-btn' type='submit' disabled={!stripe}>
                            {
                                loading ? <div className='loader'></div> : <p>Pay ${bookingDetails.grandTotal}</p>

                            }
                        </button>
                        <button className='pay-btn mat-btn mt-3 danger' onClick={() => history.push('/')} type='submit' disabled={!stripe}>
                            Cancel
                        </button>
                        <span className='text-danger d-block text-center'>{errors['payment']}</span>
                        <span className='text-danger d-block text-center'>{errors['booking']}</span>
                    </Form.Group>
                    <Row className='secure-checkout'>
                        <Col md={8} xs={8}>
                            <h5>Guaranteed safe &#38; secure checkout</h5>
                        </Col>
                        <Col md={3} sm={3} xs={4}>
                            <a rel="noreferrer" target='_blank' href='https://www.stripe.com'><Image src={poweredbystripe} width='90%' /></a>
                        </Col>
                    </Row>
                </div>
            </Form>
        </div>
    );
}

export default InjectedPaymentForm;