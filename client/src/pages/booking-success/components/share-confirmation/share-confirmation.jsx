import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Button from '../../../../components/button/button';
import Loader from '../../../../components/loader/loader';

import { sendConfirmations } from '../../../../services/booking/api';
import { sessionActiveWrapper, statusEnum } from '../../../../helpers/session-active-wrapper';

import './share-confirmation.scss';


class ShareConfirmation extends React.Component {
    constructor() {
        super();
        const firstInput = React.createRef();
        this.state = {
            inputs: [firstInput],
            loading: false,
            didSend: null,
        }
    }

    appendInput = () => {
        const ref = React.createRef();
        this.setState(prevState => ({
            inputs: [...prevState.inputs, ref]
        }))
    }

    handleSubmit = async (evt) => {
        evt.preventDefault();
        this.setState({
            loading: true,
            didSend: null,
        })
        let refs = this.state.inputs;
        let emails = this.emailsFromRefs(refs);

        if (emails.length === 0) {
            this.setState({
                loading: false,
            });
            return;
        }

        const response = await sessionActiveWrapper(sendConfirmations, emails);

        if (response === statusEnum.sessionNotActive)
            return

        if (response === statusEnum.error)
            this.setState({
                didSend: false,
                loading: false
            });
        else
            this.setState({
                didSend: true,
                loading: false
            });
    }

    emailsFromRefs = (refs) => {
        let emails = [];
        refs.forEach(ref => {
            if (ref.current.value)
                emails.push(ref.current.value);
        })
        return emails;
    }

    render() {
        const { inputs, loading, didSend } = this.state;
        return (
            <section id='share-confirmation'>
                <Loader show={loading} />
                <form onSubmit={this.handleSubmit}>
                    {
                        inputs.map((ref, i) => {
                            return (
                                <Row>
                                    <Col md={11}>
                                        <Form.Control placeholder='Email Address' type='email' ref={ref} />
                                    </Col>
                                    {
                                        i === 0
                                            ?
                                            <Col md={11} lg={1}>
                                                <FontAwesomeIcon size={'2x'} style={{ color: '#FA7580' }} onClick={this.appendInput} icon={faPlus} />
                                            </Col>
                                            :
                                            <></>
                                    }

                                </Row>
                            )
                        })
                    }
                    {
                        didSend === false
                            ?
                            <p className='text-danger text-center mb-0'>Failed to send</p>
                            :
                            didSend === true
                                ?
                                <p className='text-success text-center mb-0'>Sent</p>
                                :
                                <></>
                    }
                    <Row className='justify-content-center'>
                        <Col lg={4}>
                            <Button isButton={true} secondary={true}>Send Confirmation</Button>
                        </Col>
                    </Row>
                </form>
            </section>
        );
    }
}

export default ShareConfirmation;