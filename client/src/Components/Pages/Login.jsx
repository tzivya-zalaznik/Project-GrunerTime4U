import React, { useEffect, useState } from 'react';
import { useLoginMutation } from '../../Slices/authApiSlice';
import { setToken } from '../../Slices/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Password } from 'primereact/password';
import useAuth from '../../Hooks/useAuth';
import { Card } from 'primereact/card';
import Swal from 'sweetalert2';

const Login = () => {
    const [emailCorrect, setEmailCorrect] = useState(true);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validate: (data) => {
            let errors = {};

            if (!data.email) {
                errors.email = '.שדה חובה';
            } else if (!validateEmail(data.email)) {
                errors.email = '.כתובת לא תקינה';
            }

            if (!data.password) {
                errors.password = '.שדה חובה';
            }

            return errors;
        },
        onSubmit: (data) => {
            loginFunc(data);
        }
    });

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(email).toLowerCase());
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (formik.isValid) {
            loginFunc(formik.values);
        } else {
            setEmailCorrect(false);
        }
    };

    const [loginFunc, { isError, isSuccess, data }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            dispatch(setToken(data));
            AuthNavigation();
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            showSwal()
        }
    }, [isError]);


    const showSwal = () => {
        Swal.fire({
            reverseButtons: true,
            title: "<strong>משתמש יקר</strong>",
            icon: "error",
            iconColor: '#1b5446',
            html: `שם משתמש או סיסמא שגויים `,
            showCloseButton: false,
            showCancelButton: true,
            focusConfirm: true,
            cancelButtonColor: '#1b5446',
            confirmButtonColor: '#1b5446',
            confirmButtonAriaLabel: "Thumbs up, great!",
            cancelButtonText: `<i class="fa fa-thumbs-down"></i>נסה שוב`,
            confirmButtonText: `<i class="sweetButton"></i> להרשמה`,
            cancelButtonAriaLabel: "Thumbs down"
        }).then(res => {
            if (res.isConfirmed) {
                navigate("/register")
            } else {
                navigate("/login");
            }
        });

    }

    const AuthNavigation = () => {
        const { isAdmin, isUser } = useAuth();
        isUser ? navigate("/gallery") : navigate("/adminGallery");
    };

    return (
        <div className="card flex justify-content-center" style={{ width: '100%', padding: '20px' }}>
            <Card style={{ width: '40%', margin: 'auto', minWidth: '350px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <form onSubmit={handleFormSubmit} className="flex flex-column gap-2">
                    <br />
                    <h1>כניסה</h1>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ maxWidth: '300px' }}>
                            <span className="p-float-label p-input-icon-right">
                                <InputText
                                    value={formik.values.email}
                                    autoFocus
                                    onChange={(e) => {
                                        formik.setFieldValue('email', e.target.value);
                                    }}
                                    className={classNames({ 'p-invalid': !emailCorrect || formik.errors.email })}
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
                        <Button type="submit" label="כניסה" style={{ width: '245px', backgroundColor: '#407467', hover: { backgroundColor: 'white' }, borderRadius: '5px' }} rounded />
                    </div>
                    <div class="links" style={{ width: '245px', display: 'flex', justifyContent: 'space-between',margin:'auto' }}>
                        <a href="/forgotPassword" style={{direction:'rtl',textDecoration:'none'}}>שכחתי סיסמא?</a>
                        <a href="/register" style={{textDecoration:'none'}}>הרשמה</a>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Login;
