import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { getAllClasses } from '../../services/classes/actions';
import { reset, updateClassId } from '../../services/booking/actions';

import OrderProgressBar from '../../components/order-progress/order-progress-bar';
import Loader from '../../components/loader/loader';
import ClassSummary from './components/class-summary/class-summary';
import BookingDetails from './containers/booking-details/booking-details';
import BookingSummary from './containers/booking-summary/booking-summary';

import './book-class.scss';

/**
 * page to allow user to book a class
 * 
 * @since 2.0.0
 */
class BookClass extends React.Component {
  constructor(props) {
    super(props);
    props.reset();
    this.state = {
      classData: null,
    }
  }

  static propTypes = {
    /**
     * reset all booking details in redux store
     */
    reset: PropTypes.func,

    /**
     * fetch all classes from the server and add to redux store
    */
    getAllClasses: PropTypes.func,

    /**
     * all of the classes currently in the redux store
     */
    allClasses: PropTypes.array,

    /**
     * update the current class id in the redux store
     */
    updateClassId: PropTypes.func
  }

  componentDidMount() {
    if (!this.props.allClasses) {
      this.props.getAllClasses();
    } else {
      this.initClassData(this.props);
    }
  }

  componentDidUpdate(prevProps) {
    const hasChanged = this.props.allClasses !== prevProps.allClasses;
    if (hasChanged) {
      this.initClassData(this.props);
    }
  }

  /**
   * all steps for initializing class data in the local state
   * 
   * @param {object} props - certian set of props to use to init class data 
   */
  initClassData = (props) => {
    const classData = props.allClasses.find(class_ => class_._id === props.match.params.id)
    props.updateClassId(classData._id);
    this.setState({ classData: classData });
  }

  render() {
    let { classData } = this.state;
    return (
      <>
        {
          classData !== null
            ?
            classData === false
              ?
              <p className='error'>Error loading class</p>
              :
              <>
                <OrderProgressBar bookingDetails />
                <ClassSummary classData={classData} chef={classData.chefs[0]} />
                <Row className='justify-content-center' id='booking-container'>
                  <Col lg={5}>
                    <BookingDetails classData={classData} />
                  </Col>
                  <Col lg={5}>
                    <BookingSummary classData={classData} />
                  </Col>
                </Row>
              </>
            :
            <Loader show={this.state.classData === null} />
        }


      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allClasses: state.classes.allClasses,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllClasses: () => dispatch(getAllClasses()),
    reset: () => dispatch(reset()),
    updateClassId: (classId) => dispatch(updateClassId(classId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookClass);