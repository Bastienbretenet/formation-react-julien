import Axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Fields';
import usersAPI from '../services/usersAPI';

const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    })
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    })

    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setUser({...user, [name]: value})
    }
    
    const handleSubmit = async event => {
        event.preventDefault();
        const apiErrors = {};
        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Mot de passe différent !";
            setErrors(apiErrors);
            return
        }

        try{
            await usersAPI.register(user);
            setErrors({});
            history.replace('/login')
        }catch({response}){
            const {violations} = response.data;
            if(violations){
                violations.forEach( ({propertyPath, message}) => {
                    apiErrors[propertyPath] = message
                });
                setErrors(apiErrors);
            }
        }
    }

    return ( 
    <>
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
            <Field
                name="firstName"
                placeholder="Prénom"
                label="Prénom"
                onChange={handleChange}
                value={user.firstName}
                error={errors.firstName}
            />
            <Field
                name="lastName"
                placeholder="Nom de famille"
                label="Nom de famille"
                onChange={handleChange}
                value={user.lastName}
                error={errors.lastName}
            />
            <Field
                name="email"
                type="email"
                placeholder="Email"
                label="Email"
                onChange={handleChange}
                value={user.email}
                error={errors.email}
            />
            <Field
                name="password"
                type="password"
                placeholder="Mot de passe"
                label="Mot de passe"
                onChange={handleChange}
                value={user.password}
                error={errors.password}
            />
            <Field
                name="passwordConfirm"
                type="password"
                placeholder="Confirmation de mot de passe"
                label="Confirmation de mot de passe"
                onChange={handleChange}
                value={user.passwordConfirm}
                error={errors.passwordConfirm}
            />
            <div className="form-group">
                <button type="submit" className="btn btn-success">
                    Confirmation
                </button>
                <Link to="/login" className="btn btn-link">
                    J'ai déjà un compte
                </Link>
            </div>
            
        </form>
    </> 
    );
}
 
export default RegisterPage;