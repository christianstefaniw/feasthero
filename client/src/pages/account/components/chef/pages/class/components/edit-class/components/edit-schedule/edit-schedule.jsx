import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import dateTimeToString from '../../../../../../../../../../helpers/date-time-to-string';
import { selectCurrentClass } from '../../../../../../../../../../services/chef/selectors';

import AddTimeSlot from './components/add-time-slot/add-time-slot';
import DeleteTimeSlot from './components/delete-time-slot/delete-time-slot';

import './edit-schedule.scss';

function EditSchedule() {
    const classData = useSelector(selectCurrentClass);

    return (
        <>
            <h2 className='mt-5 mb-3 text-center'>Schedule</h2>
            <section id='edit-schedule'>
                {
                    classData.schedule.map((timeSlot, key) => {
                        return (
                            <div key={key} className={`schedule ${timeSlot.available ? '' : 'time-slot-unavailable'}`}>
                                <Row className='justify-content-center pt-2'>
                                    <Col sm={1}>
                                        <DeleteTimeSlot timeSlotId={timeSlot._id} />
                                    </Col>
                                    <Col sm={4}>
                                        <p>{dateTimeToString(timeSlot.dateTime)}</p>
                                    </Col>
                                </Row>
                            </div>
                        )
                    })
                }
            </section>
            <div>
                <AddTimeSlot />
            </div>
        </>
    )
}

export default EditSchedule;