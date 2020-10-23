import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Fields';
import Select from '../components/forms/Select';
import customerAPI from '../services/customerAPI';
import invoicesAPI from '../services/invoicesAPI';

const InvoicePage = ({match, history}) => {

    const { id } = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    })
    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    })
    const [customers, setCustomers] = useState([])
    const [editing, setEditing] = useState(false);

    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setInvoice({...invoice, [name]: value})
    }

    const fetchCustomer = async () => {
        try{
            const data = await customerAPI.findAll();
            setCustomers(data);
            if(!invoice.customer && id === "new" ){
                setInvoice({...invoice, customer: data[0].id})
            } 
        }catch(error){
            console.log(error.response);
        }
    }

    const fetchInvoice = async id => {
        try{
            const { amount, customer, status } = await invoicesAPI.find(id);
            setInvoice({ amount, customer: customer.id, status });
        }catch(error){
            console.log(error.response);
            history.replace("/invoices");
        }
    }

    useEffect( () => {
        fetchCustomer()
    }, [])

    useEffect( () => {
        if(id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            if(editing){
                await invoicesAPI.update(id, invoice);
            }else{
                await invoicesAPI.create(invoice);
                history.replace("/invoices");
            }
            setErrors({});
        }catch({response}){
            const {violations} = response.data;
            if(violations){
                const apiErrors = {};
                violations.forEach( ({propertyPath, message}) => {
                    apiErrors[propertyPath] = message
                });
                setErrors(apiErrors);
            }
        }
    }

    return ( <>
        {!editing && <h1>Création d'une facture</h1> ||         
            <h1>Modification du la facture</h1> 
        }
        <form onSubmit={handleSubmit}>
            <Field
                name="amount"
                type="number"
                placeholder="Montant de la facture"
                label="Montant"
                onChange={handleChange}
                value={invoice.amount}
                error={errors.amount}
            />

            <Select 
                name="customer"
                label="Client"
                value={invoice.customer}
                error={errors.customer}
                onChange={handleChange}
            >
                {customers.map(customer => 
                    <option key={customer.id} value={customer.id}>
                        {customer.firstname} {customer.lastname}
                    </option>
                )}
            </Select>
            <Select 
                name="status"
                label="Status"
                value={invoice.status}
                error={errors.status}
                onChange={handleChange}
            >
                <option value="SENT">Envoyée</option>
                <option value="PAID">Payée</option>
                <option value="CANCELLED">Annulée</option>
            </Select>

            <div className="form-group">
                <button type="submit" className="btn btn-success">
                    Enregister
                </button>
                <Link to="/invoices" className="btn btn-link">
                    Retour aux factures
                </Link>
            </div>

        </form>
    </> );
}
 
export default InvoicePage;