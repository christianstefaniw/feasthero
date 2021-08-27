import React from 'react';
import { Row, Col } from 'react-bootstrap';

import ClassCard from './components/class-card/class-card';
import Title from '../../../../components/title/title';
import { getAllClassesForBooking } from '../../../../services/classes/api';

import './classes.scss';

class Classes extends React.Component {
    constructor() {
        super();
        this.state = {
            classes: null,
        }
    }

    async componentDidMount() {
        const classes = await getAllClassesForBooking();
        this.setState({ classes });
    }

    tryToRenderAllClasses() {
        const { classes } = this.state;

        if (classes) {
            if (classes.error)
                return <h4 className='text-center text-danger'>Error loading classes</h4>

            return (
                <Row className='justify-content-center' id='classes'>
                    {
                        classes.map((classData, key) => {
                            return (
                                <Col key={key} className='class-card-container' md={11} lg={6} xl={5}>
                                    <ClassCard classData={classData} />
                                </Col>
                            )
                        })
                    }
                </Row>
            )
        }



        return <h4 className='text-center'>Loading...</h4>
    }

    render() {
        return (
            <section id='classes'>
                <Title className='mb-4 text-center'>Hands-on cooking classes taught by world class chefs</Title>

                {this.tryToRenderAllClasses()}
            </section>
        )
    }
}

export default Classes;