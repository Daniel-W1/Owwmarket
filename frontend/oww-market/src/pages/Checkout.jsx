import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';



const PaymentForm = () => {
  const [error, setError] = useState(null);
    var params = useParams()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const the_userId = params.userId ? params.userId : JSON.parse(localStorage.getItem("user"))._id;
    fetch("http://localhost:3000/createpayment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: the_userId,
        items: [{ id: 1, quantity: 1, name: 'Premuim' }],
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        window.location = url;
      })
      .catch((e) => {
        console.error(e.error);
      });

    
  };

  return (
    <div>
      <h2>Payment Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div id="card-errors" role="alert">
            {error && <span>{error}</span>}
          </div>
        </div>
        <button className='bg-black text-white font-bold py-2 px-6 rounded' type="submit">Pay $1.00</button>
      </form>
    </div>
  );
};

const Payment = () => {

    const redirect = () => {
       return window.location.href = "/"
    }

    const path = useLocation();
    if(path.pathname == "/subscribe/success") {
       return (
        <div className="success-animation">
        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
            <center>
            <p className=' text-black font-semibold mt-4'>Subscribed Successfully, to return to home page <button className="underline" onClick={redirect}>Click here!</button></p>
            </center>
       </div>
       );
    } else {
        return (
            <PaymentForm />
            );
        }
};

export default Payment;
