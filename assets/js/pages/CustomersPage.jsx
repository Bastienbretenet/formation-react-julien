import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import CustomerAPI from '../services/customerAPI';

const CustomersPages = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const fetchCustomers = async () => {
        try{
            const data = await CustomerAPI.findAll()
            setCustomers(data);
        }catch(error){
            console.log(error.response);
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, [] );

    const handleDelete = async (id) => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id));
        try{
            await CustomerAPI.delete(id)
        }catch(error){
            setCustomers(originalCustomers);
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1)
    }

    const itemsPerPage = 10;

    const filteredCustomers = customers.filter(
        c =>
          c.firstname.toLowerCase().includes(search.toLowerCase()) ||
          c.lastname.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    const paginatedCustomers = Pagination.getData(
        filteredCustomers,
        currentPage,
        itemsPerPage
    );

    return (
        <>
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>Liste des clients</h1>
            <Link to="/customers/new" className="btn btn-primary">Création d'un client</Link>
        </div>

            <div className="form-group">
                <input 
                    type="text" className="form-control"
                    onChange={handleSearch}
                    value={search}
                    placeholder="Rechercher ..."
                />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody> 
                    {paginatedCustomers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>
                                    <a href="#">{customer.firstName} {customer.lastName}</a>
                                </td>
                                <td>{customer.email}</td>
                                <td>{customer.company}</td>
                                <td className="text-center">
                                    <span className="badge badge-primary">{customer.invoices.length}</span>
                                </td>
                                <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                                <td>
                                    <button 
                                        onClick={() => handleDelete(customer.id)}
                                        disabled={customer.invoices.length > 0}
                                        className="btn-sm btn-danger"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        )
                    )}  
                </tbody>
            </table>
            { itemsPerPage < filteredCustomers.length && (
                <Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredCustomers.length}
                    onPageChanged={handlePageChange}
                />
            )}

        </>
     );
}
 
export default CustomersPages;