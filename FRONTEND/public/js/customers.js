document.addEventListener('DOMContentLoaded', async function () {
    await loadCustomers();
    await loadUpdateCustomerDropdown();

    // handles adding a customer
    document.getElementById('customer-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const firstname = document.getElementById('customer-firstname').value;
        const lastname = document.getElementById('customer-lastname').value;
        const email = document.getElementById('customer-email').value;
        const password = document.getElementById('customer-password').value;

        await axios.post('http://localhost:5000/customers', {
            firstname,
            lastname,
            email,
            password
        });

        await loadCustomers();
        await loadUpdateCustomerDropdown();
        this.reset();
    });

    // prefills update form when a customer is selected
    document.getElementById('update-customer-id').addEventListener('change', async function () {
        const id = this.value;
        if (!id) return;

        const res = await axios.get('http://localhost:5000/customers');
        const customer = res.data.find(c => c.id == id);

        document.getElementById('update-firstname').value = customer.firstname;
        document.getElementById('update-lastname').value = customer.lastname;
        document.getElementById('update-email').value = customer.email;
        document.getElementById('update-password').value = customer.password;
    });

    // handles updating a customer
    document.getElementById('update-customer-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const id = document.getElementById('update-customer-id').value;
        const firstname = document.getElementById('update-firstname').value;
        const lastname = document.getElementById('update-lastname').value;
        const email = document.getElementById('update-email').value;
        const password = document.getElementById('update-password').value;

        await axios.put(`http://localhost:5000/customers/${id}`, {
            firstname,
            lastname,
            email,
            password
        });

        alert('Customer updated successfully!');
        this.reset();
        await loadCustomers();
        await loadUpdateCustomerDropdown();
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
    await loadCustomers();
    await loadUpdateCustomerDropdown();
}

// loads customers into update dropdown
async function loadUpdateCustomerDropdown() {
    const res = await axios.get('http://localhost:5000/customers');
    const customers = res.data;
    const updateCustomerSelect = document.getElementById('update-customer-id');
    updateCustomerSelect.innerHTML = '<option value="">Select customer to update</option>';

    customers.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = `${c.firstname} ${c.lastname}`;
        updateCustomerSelect.appendChild(option);
    });
}