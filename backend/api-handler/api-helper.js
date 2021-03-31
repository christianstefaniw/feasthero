const Class = require("../schema/Class");
const Chef = require("../schema/Chef");
const Schedule = require("../schema/Schedule");
const Booking = require("../schema/Booking");
var ObjectId = require("mongoose").Types.ObjectId;

const moment = require("moment");
const { utc } = require("moment");
require("moment-timezone");

const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const updateSlot = async (class_id, date, value) => {
  let BookSlot = await Schedule.updateOne(
    {
      class_id: ObjectId(class_id),
      $and: [
        {
          date: { $gte: new Date(date) },
        },
        {
          date: {
            $lt: new Date(moment(date).add(1, "hour")),
          },
        },
      ],
    },
    { available: value }
  );
  return;
};

const updateBookingStatus = async (order_id, status) => {
  let updatedStatus = await Booking.updateOne(
    {
      _id: ObjectId(order_id),
    },
    status
  );

  return;
};

const sendMail = async (order) => {
  let classes = await Class.aggregate([
    {
      $match: { _id: order[0].class_id },
    },
    {
      $project: {
        title: 1,
        cost: 1,
        duration: 1,
        chef_id: 1,
        description: 1,
      },
    },
    {
      $lookup: {
        from: "chefs",
        localField: "chef_id",
        foreignField: "_id",
        as: "chefs",
      },
    },
  ]);
  classes = classes[0];
  const msg = {
    to: order[0].customer_email,
    from: process.env.SENDGRID_MAIL, // Use the email address or domain you verified above
    subject: "FeastHero Class Booking Confirmation",
    html: `Hi <b>${
      order[0].customer_first_name
    }</b>, thanks for booking with FeastHero!.
       <p>
        Here’s everything you need to know for you class with ${
          classes.chefs[0].name
        }:<p>
  
        <p>
        Class name: <b>${classes.title}</b></p>
        <p>
        Date: <b> ${moment
          .utc(order[0].booking_datetime)
          .tz("US/Eastern")
          .format("dddd, MMMM D,YYYY")} </b></p>
          <p>
        Time: <b>${moment
          .utc(order[0].booking_datetime)
          .tz("US/Eastern")
          .format("hh:mm a")}EST </b></p>
          <h3>
        Join with this link: <a href=${order[0].zoom_link}> ${
      order[0].zoom_link
    } </a> </h3>
  <br>
        <p>
        ${classes.description}
  </p>
       <p> Remember for this class you will need [recipes]. </p>
  
      <h4>  We look forward to having you join!</h4>
       `,
  };
  //ES6
  sgMail.send(msg).then(
    () => {},
    (error) => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  );
};

module.exports = {
  sendMail,
  updateSlot,
  updateBookingStatus,
};
