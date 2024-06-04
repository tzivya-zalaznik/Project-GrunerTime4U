import React, { useEffect, useState } from 'react';
import { useSendEmailMutation, useUpdatePasswordMutation } from '../../Slices/mailApiSlice';
import { Card } from 'primereact/card';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';

const ForgotPassword = () => {
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [sendEmail, { isLoading }] = useSendEmailMutation();
    const [emailSent, setEmailSent] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [updatePasword, { data, isSuccess,isError }] = useUpdatePasswordMutation();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            console.log("updateeeeeeeeeeeeeeee");
            navigate('login')
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
            html: `אינך רשום במערכת`,
            showCloseButton: false,
            showCancelButton: true,
            focusConfirm: true,
            cancelButtonColor: '#1b5446',
            confirmButtonColor: '#1b5446',
            confirmButtonAriaLabel: "Thumbs up, great!",
            cancelButtonText: `<i class="fa fa-thumbs-down"></i> ביטול`,
            confirmButtonText: `<i class="sweetButton"></i> להרשמה`,
            cancelButtonAriaLabel: "Thumbs down"
        }).then(res => {
            if (res.isConfirmed) {
                navigate("/register")
            }
        });
    }

    const initialValues = {
        email: '',
    };

    const initialValues2 = {
        password: '',
    };

    const onSubmit = (values) => {
        try {
            const randomCode = generateRandomNumber();
            const response = sendEmail({ to: values.email, body: `Your verification code is: ${randomCode}` });
            if (response.error) {
                setMessage(response.error.message || 'Failed to send email');
            } else {
                setMessage('קוד אימות נשלח למייל שלך.');
                setVerificationCode(randomCode);
                setEmailSent(true);
                setEmail(values.email)
            }
        } catch (error) {
            setMessage('Failed to send email');
        }
    };

    const handlePasswordUpdate = (e) => {
        debugger
        updatePasword({ email: email, password: newPassword })
    };

    const validate = (values) => {
        const errors = {};
        if (!values.email) {
            errors.email = 'שדה חובה';
        } else if (!validateEmail(values.email)) {
            errors.email = 'כתובת אימייל לא תקינה';
        }
        return errors;
    };

    const validate2 = (values) => {
        const errors = {};
        if (!values.password) {
            errors.password = 'שדה חובה';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues,
        onSubmit,
        validate,
    });

    const formik2 = useFormik({
        initialValues:initialValues2,
        onSubmit:handlePasswordUpdate,
        validate:validate2,
    });

    const handleNewPasswordChange = (e) => {
        formik2.setFieldValue('password', e.target.value);
        setNewPassword(e.target.value);
    };

    const generateRandomNumber = () => {
        return Math.floor(100000 + Math.random() * 900000);
    };

    const validateCode = (e) => {
        if (verificationCode == e.target.value) {
            setIsCodeVerified(true);
        } else {
            setIsCodeVerified(false);
        }
    };

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(email).toLowerCase());
    };

    return (
        <div className="card flex justify-content-center" style={{ width: '100%', padding: '20px' }}>
            <Card style={{ width: '40%', margin: 'auto', minWidth: '350px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <form onSubmit={formik.handleSubmit}>
                    <br />
                    <h1>עדכון סיסמא</h1>
                    <br />
                    <span className="p-float-label p-input-icon-right">
                        <InputText
                            value={formik.values.email}
                            autoFocus
                            onChange={(e) => {
                                formik.setFieldValue('email', e.target.value);
                            }}
                            className={classNames({ 'p-invalid': !validateEmail || formik.errors.email })}
                        />
                        <label htmlFor="input_value">Email</label>
                        <i className="pi pi-at" style={{ marginRight: "7px" }} />
                    </span>
                    <br />
                    {formik.errors.email && <small className="p-error">{formik.errors.email}</small>}
                    <br />

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                        <Button disabled={isLoading} type="submit" label="שליחת סיסמא" style={{ width: '245px', backgroundColor: '#407467', hover: { backgroundColor: 'white' }, borderRadius: '5px' }} rounded />
                    </div>
                </form>
                {message && <p>{message}</p>}
                {emailSent && (
                    <div>
                        <span className="p-float-label p-input-icon-right">
                            <InputText
                                value={formik.values.name}
                                onChange={validateCode}
                                className={classNames({ 'p-invalid': formik.errors.name })}
                            />
                            <label htmlFor="input_value">Verification Code</label>
                            <i className="pi pi-send" style={{ marginRight: '7px' }}></i>
                        </span>
                    </div>
                )}
                {/* {formik.errors.email && <small className="p-error">{formik.errors.email}</small>} */}
                <br />
                {isCodeVerified && (
                    <form onSubmit={formik2.handleSubmit}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <span className="p-float-label">
                                <Password
                                    inputId="in_value"
                                    name="value"
                                    rows={5}
                                    cols={30}
                                    feedback={false}
                                    value={formik2.values.password}
                                    onChange={handleNewPasswordChange}
                                    className={classNames({ 'p-invalid': formik2.errors.password })}
                                    toggleMask
                                />
                                <label htmlFor="input_value">Password</label>
                            </span>
                        </div>
                        {formik2.errors.password && <small className="p-error">{formik2.errors.password}</small>}
                        <br />
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                            <Button type="submit" label="עדכון סיסמא" style={{ width: '245px', backgroundColor: '#407467', hover: { backgroundColor: 'white' }, borderRadius: '5px' }} rounded />
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default ForgotPassword;
