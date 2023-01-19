import NewCustomer from "./NewCustomer";
import ReturningCustomer from "./ReturningCustomer";

const NewSale = () => {

    return (
        <div className="new-sale-component">
            <h2>New Sale</h2>
            <div className="customer-type">
                <input type="radio" name="customer-type" id="new-customer" />
                <label htmlFor="new-customer">New Customer</label>
                <input type="radio" name="customer-type" id="old-customer" />
                <label htmlFor="old-customer">Returning Customer</label>
            </div>
            <NewCustomer />
            <ReturningCustomer />
        </div>
    )
}

export default NewSale;