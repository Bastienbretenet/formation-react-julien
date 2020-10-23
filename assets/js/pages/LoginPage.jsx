import React, { useContext, useState } from 'react';
import Field from '../components/forms/Fields';
import AuthContext from '../context/AuthContext';
import AuthAPI from '../services/authAPI';

const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })
    const [error, setError] = useState("");

    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/customers");
        }catch(error){
            console.log(error.response)
            setError("Aucun compte ne possède cette adresse ou les informations ne sont pas correctes.");
        }
    }

    return ( <>
        <h1>Connexion</h1>

        <form onSubmit={handleSubmit}>
            <Field 
                label="Adresse email"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Adresse email"
                error={error}
            />
            <Field 
                label="Mot de passe"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                type="password"
                error=""
            />
            <div className="form-group">
                <button className="btn btn-success" type="submit">Connexion</button>
            </div>
        </form>

    </> );
}
 
export default LoginPage;