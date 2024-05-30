import React, { useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import apiSlice from '../app/apiSlice';
import { useDispatch } from 'react-redux';
import { removeToken } from '../Slices/authSlice';
import useAuth from '../Hooks/useAuth';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import { Toast } from 'primereact/toast';

export default function NavBar() {
    const { name, role } = useAuth()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const toast = useRef(null);

    const getOut = () => {
        toast.current.show({ severity: 'success', summary: `${name}`, detail: 'התנתקת בהצלחה', life: 3000 });
        dispatch(removeToken())
        dispatch(apiSlice.util.resetApiState())
    }
    
    const heart = () => {
        if (!localStorage.token) {
            showSwal();
        }
        else {
            navigate('/favorite');
        }
    }

    const showSwal = () => {
        Swal.fire({
            reverseButtons:true,
            title: "<strong>משתמש יקר</strong>",
            icon: "warning",
            iconColor: '#1b5446',
            html: `יש לבצע כניסה למערכת לפני כניסה למועדפים`,
            showCloseButton: false,
            showCancelButton: true,
            focusConfirm: true,
            cancelButtonColor: '#1b5446',
            confirmButtonColor: '#1b5446',
            confirmButtonAriaLabel: "Thumbs up, great!",
            cancelButtonText: `<i class="fa fa-thumbs-down"></i>ביטול`,
            confirmButtonText: `<i class="sweetButton"></i> כניסה`,
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
                <div style={{ display: 'flex', backgroundColor: 'white',alignItems:'center',justifyContent:'space-between' }}>
                    <div className="logo" style={{ margin: '0 20px' }}>
                        <a href="/" target="_blank" style={{ cursor: 'pointer' }}>
                            <img alt="logo" src="../../logo.jpg" style={{ height: '70px', width: '300px', marginTop: '10px',marginBottom:'10px'}}></img>
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
                                <NavLink to="/register" className="nav-link" activeClassName="active">
                                    <i className="pi pi-user-plus"></i> הוספת מנהל
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/company" className="nav-link" activeClassName="active">
                                    <i className="pi pi-list"></i> חברות
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/sales" className="nav-link" activeClassName="active">
                                    <i className="pi pi-cart-plus"></i> ניהול רכישות
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="adminGallery" className="nav-link" activeClassName="active">
                                    <i className="pi pi-th-large"></i> גלרית שעונים
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link" activeClassName="active">
                                    <i className="pi pi-home"></i> דף הבית
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div> : role == "User" ? <div style={{ backgroundColor: 'gray'}}>
                    <nav className="navbar navbar-expand-sm bg-light" style={{ backgroundColor: 'gray' }} >
                        <ul className="navbar-nav mx-auto" >
                            <li className="nav-item">
                                <Link to='/' className="nav-link" onClick={getOut}>
                                    <i className="pi pi-user-minus"></i> יציאה
                                </Link>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/favorite" className="nav-link" onClick={heart} activeClassName="active">
                                    <i className="pi pi-heart"></i>מועדפים
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/gallery" className="nav-link" activeClassName="active">
                                    <i className="pi pi-th-large"></i> גלרית שעונים
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link" activeClassName="active">
                                    <i className="pi pi-home"></i> דף הבית
                                </NavLink>
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
        </>
    )}
