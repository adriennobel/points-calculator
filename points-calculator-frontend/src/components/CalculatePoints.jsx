import { useState, useEffect } from "react";
import axios from "axios";

const CalculatePoints = () => {

    let [resMessage, setResMessage] = useState('');
    const [isCustomerF, setIsCustomerF] = useState(false);

    let [customer, setCustomer] = useState('');
    let [fcustomer, setFcustomer] = useState('');

    function handleCustomer(e) {
        customer = e.target.value;
        setCustomer(customer);

        setResMessage('');
        setFcustomer('');

        const checkedradio = document.querySelector("[name=calc-period]:checked");
        checkedradio ? checkedradio.checked = false : null;
    }

    async function findThisCustomer() {

        if (customer == "") {
            fcustomer = "Customer ID field can not be empty";
            setFcustomer(fcustomer);
        }
        else {
            const response = await axios.get(`http://localhost:8001/api/customer/check/${customer}`);

            if (response.data === null) {
                fcustomer = `We didn't find an entry for id: ${customer}`;
                setFcustomer(fcustomer);
                setIsCustomerF(false);
            } else {
                fcustomer = `Welcome back, ${response.data.firstName} (id: ${customer})`;
                setFcustomer(fcustomer);
                setIsCustomerF(true);
            }
            console.log(response.data);
        }
    }

    /* points of the past month */
    let tpoints = 0;

    async function calcPointsOneMo() {

        if (isCustomerF == true) {
            const fromdate = new Date().getFullYear() + "-" + (new Date().getMonth() + 0) + "-" + new Date().getDate();
            const response = await axios.get(`http://localhost:8001/api/transaction/calcpoints/${customer}/${fromdate}`);

            response.data.forEach(transaction => {
                tpoints += transaction.points;
            })

            resMessage = `${tpoints} points in the past month!`;
            setResMessage(resMessage);

            console.log(response.data);
            console.log(`${tpoints} points`);
        }
        else {
            resMessage = `Start by searching the customer.`;
            setResMessage(resMessage);
        }
    }

    async function calcPointsThreeMos() {

        if (isCustomerF == true) {
            const fromdate = new Date().getFullYear() + "-" + (new Date().getMonth() - 2) + "-" + new Date().getDate();
            const response = await axios.get(`http://localhost:8001/api/transaction/calcpoints/${customer}/${fromdate}`);

            response.data.forEach(transaction => {
                tpoints += transaction.points;
            })

            resMessage = `${tpoints} points in the past 3 months!`;
            setResMessage(resMessage);

            console.log(response.data);
            console.log(`${tpoints} points`);
        }
        else {
            resMessage = `Start by searching the customer.`;
            setResMessage(resMessage);
        }
    }

    return (
        <div className="calculate-points-component">
            <h2>Calculate Points</h2>
            <fieldset className="customer-search">
                <legend>Which customer do you want to calculate points for</legend>
                <label htmlFor="customer-id2">Customer ID </label>
                <input type="text" id="customer-id2" placeholder="Enter ID"
                    value={customer} onChange={handleCustomer} className="text-input" />
                <button onClick={findThisCustomer}>Search</button>
            </fieldset>
            <div className="customer-greeting">
                <p><em>{fcustomer}</em></p>
            </div>
            <div className="calc-period">
                <div>
                    <input type="radio" name="calc-period" id="onemo" />
                    <label htmlFor="onemo" onClick={calcPointsOneMo}>Calculate points of the Past month</label>
                </div>
                <div>
                    <input type="radio" name="calc-period" id="threemo" />
                    <label htmlFor="threemo" onClick={calcPointsThreeMos}>Calculate points of the Past 3 months</label>
                </div>
            </div>
            <div className="customer-greeting">
                <p><em>{resMessage}</em></p>
            </div>
        </div>
    )
}

export default CalculatePoints;