import { useState } from "react";
import NewCustomer from "./NewCustomer";
import ReturningCustomer from "./ReturningCustomer";
import CalculatePoints from "./CalculatePoints";

const MainComponent = () => {

    let [turnOn, setTurnOn] = useState('');
    let selected = turnOn ? "selected" : "";

    return (
        <main className="main-component">
            <div className={`main-selection-container ${selected}`}>
                <div className="option enroll-customer">
                    <input type="radio" name="customer-type" id="enrollCustomer" />
                    <label htmlFor="enrollCustomer" onClick={() => setTurnOn('enrollCustomer')}>Enroll New Customer</label>
                </div>
                <div className="option record-sale">
                    <input type="radio" name="customer-type" id="recordSale" />
                    <label htmlFor="recordSale" onClick={() => setTurnOn('recordSale')}>Record New Sale</label>
                </div>
                <div className="option calc-points">
                    <input type="radio" name="customer-type" id="calcPoints" />
                    <label htmlFor="calcPoints" onClick={() => setTurnOn('calcPoints')}>Calculate Points</label>
                </div>
                <div className="option reset-option">
                    <input type="radio" name="customer-type" id="reset" />
                    <label htmlFor="reset" onClick={() => setTurnOn('')}>Reset</label>
                </div>
            </div>
            {
                (turnOn == 'enrollCustomer') ?
                    <NewCustomer />
                    :
                    (turnOn == 'recordSale') ?
                        <ReturningCustomer />
                        :
                        (turnOn == 'calcPoints') ?
                            <CalculatePoints />
                            :
                            null
            }
        </main>
    )
}

export default MainComponent;