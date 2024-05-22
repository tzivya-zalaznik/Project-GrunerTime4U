import React, { useEffect, useState } from 'react';
import { useRegisterMutation } from '../../Slices/authApiSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Password } from 'primereact/password';
import Swal from 'sweetalert2';
import { Card } from 'primereact/card';

const Register = () => {
    const [emailValid, setEmailValid] = useState(true);
    const navigate = useNavigate();
    const [registerFunc, { isError, isSuccess, data }] = useRegisterMutation();
    
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: ''
        },
        validate: (data) => {
            let errors = {};
            if (!data.email) {
                errors.email = 'Email is required.';
            } else if (!validateEmail(data.email)) {
                errors.email = 'Invalid email format.';
            }
            if (!data.name) {
                errors.name = 'Name is required.';
            }
            if (!data.password) {
                errors.password = 'Password is required.';
            }

            return errors;
        },
        onSubmit: (data) => {
            registerFunc(data);
        }
    });

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (formik.isValid) {
            registerFunc(formik.values);
        } else {
            setEmailValid(false);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            navigate("/login");
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "A user with this email already exists.",
                showConfirmButton: false
            });
        }
    }, [isError]);

    return (
        <div className="card flex justify-content-center">
            <Card style={{ width: '40%', marginBottom: '20px', marginTop: '20px', marginLeft: '30%', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <form onSubmit={handleFormSubmit} className="flex flex-column gap-2">
                    <br />
                    <h1>הרשמה</h1>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ maxWidth: '300px' }}>
                            <span className="p-float-label p-input-icon-right">
                                <InputText
                                    value={formik.values.name}
                                    onChange={(e) => {
                                        formik.setFieldValue('name', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': formik.errors.name })}
                                />
                                <label htmlFor="input_value">Name</label>
                                <i className="pi pi-user" style={{ marginRight: "7px" }} />
                            </span>
                            <br />
                            {formik.errors.name && <small className="p-error">{formik.errors.name}</small>}
                            <br />
                            <span className="p-float-label p-input-icon-right">
                                <InputText
                                    value={formik.values.email}
                                    autoFocus
                                    onChange={(e) => {
                                        formik.setFieldValue('email', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': !emailValid || formik.errors.email })}
                                />
                                <label htmlFor="input_value">Email</label>
                                <i className="pi pi-at" style={{ marginRight: "7px" }} />
                            </span>
                            <br />
                            {formik.errors.email && <small className="p-error">{formik.errors.email}</small>}
                            <br />
                            <span className="p-float-label">
                                <Password
                                    inputId="in_value"
                                    name="value"
                                    rows={5}
                                    cols={30}
                                    feedback={false}
                                    value={formik.values.password}
                                    onChange={(e) => {
                                        formik.setFieldValue('password', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': formik.errors.password })}
                                    toggleMask
                                />
                                <label htmlFor="input_value">Password</label>
                            </span>
                            {formik.errors.password && <small className="p-error">{formik.errors.password}</small>}
                        </div>
                        <br />
                    </div>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                        <Button type="submit" label="Register" style={{ width: '245px', backgroundColor: '#407467', hover: { backgroundColor: 'white' }, borderRadius: '5px' }} rounded />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Register;
