import { useState, useEffect } from "react";
import axios from "axios";

const NewCustomer = () => {

    let [fname, setFname] = useState('');
    let [lname, setLname] = useState('');
    let [resMessage, setResMessage] = useState('');


    function handleFname(e) {
        fname = e.target.value;
        setFname(fname);
    }

    function handleLname(e) {
        lname = e.target.value;
        setLname(lname);
    }

    async function enrollThisCustomer() {
        if (fname == "") {
            resMessage = "First name field can not be empty";
            setResMessage(resMessage);
        }
        else {
            const response = await axios.post(`http://localhost:8001/api/customer/enroll`, {
                firstName: fname,
                lastName: lname
            });
            resMessage = response.data;
            setResMessage(resMessage);
            console.log(response.data);

            /* empty input fields */
            setFname("");
            setLname("");
        }
    }

    return (
        <div className="new-customer-component">
            <h2>Enroll New Customer</h2>
            <fieldset>
                <legend>Please provide a few info to get enrolled in our point system</legend>
                <div className="first-name-box">
                    <label htmlFor="new-customer-fname">First name: </label>
                    <input type="text" id="new-customer-fname" placeholder="Enter first name"
                        value={fname} onChange={handleFname} className="text-input" />
                </div>
                <div className="last-name-box">
                    <label htmlFor="new-customer-lname">Last name: </label>
                    <input type="text" id="new-customer-lname" placeholder="Enter last name"
                        value={lname} onChange={handleLname} className="text-input" />
                </div>
                <button onClick={enrollThisCustomer}>Enroll</button>
            </fieldset>
            <div className="customer-greeting">
                <p><em>{resMessage}</em></p>
            </div>
        </div>
    )
}

export default NewCustomer;