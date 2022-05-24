import React from "react";
import { useSelector } from 'react-redux';
import { Spinner, Row, Col } from 'react-bootstrap';

import { loadClassDataForBooking } from '../../../../services/booking/actions';
import { selectCurrentClass } from "../../../../services/booking/selectors";

import BookingDetails from '../booking-details/booking-details';
import BookingSummary from '../booking-summary/booking-summary';
import ClassSummary from '../class-summary/class-summary';
import useFetch from "../../../../redux/hooks/fetch";

function Booking(props) {
    const getClassDataError = useSelector(state => state.booking.getClassDataError);
    const classData = useSelector(selectCurrentClass);

    const loading = useFetch(loadClassDataForBooking, props.classId);

    if (loading) {
        return (
            <div className='d-flex justify-content-center'>
                <Spinner animation='border' />
            </div>
        )
    }

    if (getClassDataError)
        return <p className='text-danger text-center'>Error loading class</p>

    if (classData) {
        return (
            <>
                <ClassSummary />
                <Row className='justify-content-center' id='booking-container'>
                    <Col lg={5}>
                        <BookingDetails />
                    </Col>
                    <Col lg={5}>
                        <BookingSummary />
                    </Col>
                </Row>
            </>
        )
    }

    return <></>
}

export default Booking;