import { useState, useEffect } from "react";
import axios from "axios";

const ReturningCustomer = () => {

    /* JS logic to retrive customers from mongodb */
    let [customer, setCustomer] = useState('');
    let [fcustomer, setFcustomer] = useState('');
    const [isCustomerF, setIsCustomerF] = useState(false);

    function handleCustomer(e) {
        customer = e.target.value;
        setCustomer(customer);

        setSale(0);
        setPoints(0);
        setIsCustomerF(false);
        setFcustomer('');
        setResMessage('');
    }

    async function findThisCustomer() {

        if (customer == "") {
            fcustomer = "Member ID field can not be empty";
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

    /* JS logic to dynamically calculate points based on sale */
    let [sale, setSale] = useState(0);
    let [points, setPoints] = useState(0);

    function handleSaleChange(e) {
        sale = e.target.value;
        setSale(sale);
        if (sale > 0 && sale < 50) {
            points = 0;
            setPoints(points);
        } else if (sale >= 50 && sale <= 100) {
            // points = sale - 50;
            setPoints(points => points = sale - 50);
        } else if (sale > 100) {
            points = 50 + 2 * (sale - 100);
            setPoints(points);
        }
        // console.log(sale);
        // console.log(points);
    }

    /* JS logic to record sale and POST to mongodb */
    let [resMessage, setResMessage] = useState('');

    async function recordThisSale() {

        if (isCustomerF == true) {
            if (sale > 0) {
                const today = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
                const response = await axios.post(`http://localhost:8001/api/sale/record`, {
                    customerID: customer,
                    sale: sale,
                    points: points,
                    date: today,
                });
                resMessage = response.data;
                setResMessage(resMessage);

                console.log(response.data);

                /* empty input field */
                setCustomer("");
            }
            else {
                resMessage = `$0 sales and below can't be recorded`;
                setResMessage(resMessage);
            }
        } else {
            resMessage = `You need to search and find a member before recording a sale.`;
            setResMessage(resMessage);
        }
    }

    return (
        <div className="returning-customer-component">
            <h2>Record New Sale</h2>
            <fieldset>
                <legend>Let's verify you</legend>
                <label htmlFor="customer-id">Enter your member ID </label>
                <input type="text" id="customer-id" placeholder="Enter ID"
                    value={customer} onChange={handleCustomer} className="text-input" />
                <button onClick={findThisCustomer}>Search</button>
            </fieldset>
            <div className="customer-greeting">
                <p><em>{fcustomer}</em></p>
            </div>
            <div className="customer-sale-component">
                <label htmlFor="purchase-sale">Enter the transaction sale $</label>
                <input type="number" id="purchase-sale"
                    value={sale} onChange={handleSaleChange} className="text-input" min="0" max="1000" />
                <p><em>${sale} sale earns {points} points!</em></p>
                <button onClick={recordThisSale}>Record Sale</button>
            </div>
            <div className="customer-greeting">
                <p><em>{resMessage}</em></p>
            </div>
        </div>

    )
}

export default ReturningCustomer;