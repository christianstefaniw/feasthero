import Item from "./Item";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getClasses } from "./redux";

// list() returns the list of classes offered by feasthero
const List = () => {
  // Upon load , the useDispatch will trigger an api call to the backend to fetch classes data
  const dispatch = useDispatch();

  // The classes data will be stored here.
  let data = useSelector((state) => state.class);

  useEffect(() => {
    dispatch(getClasses());
  }, []);

  // this function loops over the data returns an Item component for each class that's offered
  const classesList =
    data.state &&
    data.state.map((classes) => {
      const title = classes.title;
      const thumbnail = classes.thumbnail;
      const cost = classes.cost;
      const description = classes.description;
      const duration = classes.duration;
      const chef = classes.chefs[0];
      const schedule = classes.schedule;
      const chef_id = classes.chef_id;

      // console.log('here is tehd atteime', schedule)

      return (
        <Item
          key={classes._id}
          class_id={classes._id}
          chef_id={chef_id}
          title={title}
          thumbnail={thumbnail}
          cost={cost}
          description={description}
          duration={duration}
          chef={chef}
        />
      );
    });
  return (
    <section className="classchefsDetails-section" id="classlist">

    <div className="row">

      <div className="col-xl-12">

        <div className="section-title text-center">

          <h2>Hands-on cooking classes taught by world class chefs</h2>
        </div>
      </div>
    </div>

    <div className="chefs-classdetails-box">

      <div className="row">
        {/* <!-- ______________________________________________ --> */}

        {/* copied this out and pasted in Item.js*/}
        {classesList}

        {/* <!-- ______________________________________________ --> */}

      </div>
    </div></section>


    //=================================
    // <div className="main">
    //   <h1 style={{ marginBottom: "12%" }}>How it works</h1>
    //   <section className="instructions">
    //     <div className="instruction--card">
    //       <img
    //         className="instruction--card-icon"
    //         src="images/card-select.svg"
    //         alt=""
    //       />
    //       <h3>Select a class</h3>
    //     </div>
    //     <div className="instruction--card">
    //       <img
    //         className="instruction--card-icon"
    //         src="images/card-list.svg"
    //         alt=""
    //       />
    //       <h3>Enter booking details</h3>
    //     </div>
    //     <div className="instruction--card">
    //       <img
    //         className="instruction--card-icon"
    //         src="images/card-pay.svg"
    //         alt=""
    //       />
    //       <h3>Review and Pay</h3>
    //     </div>
    //   </section>

    //   <h1>Select a class</h1>

    //   <div>
    //     {classesList}{" "}
    //     {/* curly braces used to render the classesList function from above which renders each class as an 'Item' component */}
    //   </div>
    // </div>
  );
};
export default List;
