import React, { useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { NavLink, useNavigate } from 'react-router-dom';
import Home from './Pages/Home';
import apiSlice from '../app/apiSlice';
import { useDispatch } from 'react-redux';
import { removeToken } from '../Slices/authSlice';
import { useState } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import useAuth from '../Hooks/useAuth';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import { Toast } from 'primereact/toast';

export default function NavBar() {
    const { name, email, role, watches } = useAuth()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false);
    const [inputValue, setInputValue] = useState('')
    const [isFavorite, setIsFavorite] = useState(false)
    const toast = useRef(null);
    const footerContent = (
        <div>
            <Button label="ביטול" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="כניסה" icon="pi pi-check" onClick={() => { setVisible(false); navigate('/login') }} autoFocus />
        </div>
    );
    const getOut = () => {
        // debugger
        // navigate('/')
        setIsFavorite(false)
        toast.current.show({ severity: 'success', summary: `${name}`, detail: 'התנתקת בהצלחה', life: 3000 });
        dispatch(removeToken())
        dispatch(apiSlice.util.resetApiState())
    }
    const heart = () => {
        if (!localStorage.token) {
            showSwal();
        }
        else {
            setIsFavorite(true)
            navigate('/favorite');
        }
    }


    const showSwal = () => {
        Swal.fire({
            reverseButtons:true,
            title: "<strong>משתמש יקר</strong>",
            icon: "warning",
            iconColor: '#1b5446',
            html: `
       יש לבצע כניסה למערכת לפני כניסה למועדפים
          `,
            showCloseButton: false,
            showCancelButton: true,
            focusConfirm: true,
            cancelButtonColor: '#1b5446',
            confirmButtonColor: '#1b5446',
            confirmButtonAriaLabel: "Thumbs up, great!",
            cancelButtonText: `
            <i class="fa fa-thumbs-down"></i>ביטול
          `,
            confirmButtonText: `
            <i class="sweetButton"></i> כניסה
          `,
            cancelButtonAriaLabel: "Thumbs down"

        }).then(res => {
            if (res.isConfirmed) {
                navigate('/login')
            }
        });

    }

    return (
        <>
            <Toast ref={toast} />
            <div className="header">
                <div style={{ backgroundColor: '#1b5446', height: '10px' }}></div>
                <div style={{ display: 'flex', backgroundColor: 'white' }}>
                    <div>
                        <h4 style={{ marginTop: '25px', marginLeft: '20px' }}>תמיד-בשבילכם</h4>
                        <h5 style={{ marginLeft: '20px' }}><i className="pi pi-phone"></i> 02-5860374</h5>
                    </div>
                    <div className="logo" style={{ width: '80%' }}>
                        <a href="/" target="_blank" style={{ cursor: 'pointer' }}>
                            <img alt="logo" src="../../logo.jpg" style={{ height: '70px', width: '300px', marginTop: '15px', marginLeft: '97%', marginRight: '0%' }} className="logo"></img>
                        </a>
                    </div>
                </div>
                {role == "Admin" ? <div style={{ backgroundColor: 'gray' }}>
                    <nav className="navbar navbar-expand-sm bg-light" style={{ backgroundColor: 'gray' }} >
                        <ul className="navbar-nav mx-auto" >
                            <li className="nav-item">
                                <Link to="/" className="nav-link" onClick={getOut}>
                                    <i className="pi pi-user-minus"></i> יציאה
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/register" className="nav-link">
                                    <i className="pi pi-user-plus"></i> הוספת מנהל
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/company" className="nav-link">
                                    <i className="pi pi-list"></i> חברות
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/sales" className="nav-link">
                                    <i className="pi pi-cart-plus"></i> ניהול רכישות
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="adminGallery" className="nav-link">
                                    <i className="pi pi-th-large"></i> גלרית שעונים
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/" className="nav-link">
                                    <i className="pi pi-home"></i> דף הבית
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div> : role == "User" ? <div style={{ backgroundColor: 'gray' }}>
                    <nav className="navbar navbar-expand-sm bg-light" style={{ backgroundColor: 'gray' }} >
                        <ul className="navbar-nav mx-auto" >
                            <li className="nav-item">
                                <Link to='/' className="nav-link" onClick={getOut}>
                                    <i className="pi pi-user-minus"></i> יציאה
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/favorite" className="nav-link" onClick={heart}>
                                    <i className="pi pi-heart"></i>מועדפים
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/gallery" className="nav-link">
                                    <i className="pi pi-shopping-cart"></i> גלרית שעונים
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/" className="nav-link" activeClassName="active">
                                    <i className="pi pi-home"></i> דף הבית
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div> : <div style={{ backgroundColor: 'gray' }}>
                    <nav className="navbar navbar-expand-sm bg-light" style={{ backgroundColor: 'gray' }} >
                        <ul className="navbar-nav mx-auto" >
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/register" activeClassName="active">
                                    <i className="pi pi-user-plus"></i> הרשמה
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/login" activeClassName="active">
                                    <i className="pi pi-user"></i> כניסה
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to='/Favorite' activeClassName="active" onClick={heart}>
                                    <i className="pi pi-heart"></i> מועדפים
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/gallery" activeClassName="active">
                                    <i className="pi pi-th-large"></i> גלרית שעונים
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/" activeClassName="active">
                                    <i className="pi pi-home"></i> דף הבית
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>}

            </div>
            {/* <nav className="navbar navbar-expand-sm bg-light">
            <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                    <NavLink className="nav-link" to="/" activeClassName="active">
                        Home
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/about" activeClassName="active">
                        About
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/contact" activeClassName="active">
                        Contact
                    </NavLink>
                </li>
            </ul>
        </nav> */}
        </>
    )
}
