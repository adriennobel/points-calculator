const CalculatePoints = () => {

    return (
        <div className="calculate-points-component">
            <h2>Calculate Points</h2>
            <fieldset className="customer-search">
                <legend>Which customer do you want to calculate points for</legend>
                <label htmlFor="customer-id">Customer ID </label>
                <input type="text" id="customer-id" />
                <button>Search</button>
            </fieldset>
            <p><em>Customer full name</em></p>
            <div className="customer-type">
                <input type="radio" name="customer-type" id="new-customer" />
                <label htmlFor="new-customer">Past month</label>
                <input type="radio" name="customer-type" id="old-customer" />
                <label htmlFor="old-customer">Past 3 months</label>
            </div>
            <p><em>0 points</em></p>
        </div>
    )
}

export default CalculatePoints;