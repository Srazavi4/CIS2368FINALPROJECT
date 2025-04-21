document.addEventListener('DOMContentLoaded', function () {
    loadCustomers();

    // handles adding a customer
    document.getElementById('customer-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const firstname = document.getElementById('customer-firstname').value;
        const lastname = document.getElementById('customer-lastname').value;
        const email = document.getElementById('customer-email').value;
        const password = document.getElementById('customer-password').value;

        // post request to add new customer
        await axios.post('http://localhost:5000/customers', {
            firstname,
            lastname,
            email,
            password
        });

        loadCustomers();
        this.reset();
    });
});

// loads all customers
async function loadCustomers() {
    const res = await axios.get('http://localhost:5000/customers');
    const customers = res.data;
    const customersList = document.getElementById('customers-list');
    customersList.innerHTML = '';

    customers.forEach(customer => {
        const div = document.createElement('div');
        div.innerHTML = `
            ${customer.firstname} ${customer.lastname} - ${customer.email}
            <button onclick="deleteCustomer(${customer.id})">Delete</button>
        `;
        customersList.appendChild(div);
    });
}

// deletes a customer
async function deleteCustomer(id) {
    await axios.delete(`http://localhost:5000/customers/${id}`);
    loadCustomers();
}