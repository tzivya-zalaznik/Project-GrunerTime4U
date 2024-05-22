import React from 'react';
import { InputText } from 'primereact/inputtext';

export default function Search(props) {
    return (
        <>
            <div className="card">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText onChange={(e)=>props.barcode(e.target.value)} placeholder="Search" />
                </span>
            </div>
        </>
    );
}
