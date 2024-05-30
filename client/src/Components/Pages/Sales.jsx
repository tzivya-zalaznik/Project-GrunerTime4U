import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useDeleteFromSalesMutation, useGetSalesQuery } from '../../Slices/salesApiSlice';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Sidebar } from 'primereact/sidebar';

export default function CustomFilterDemo() {
    const { data: sales, isLoading, isError, error, isSuccess } = useGetSalesQuery()
    const [visibleRight, setVisibleRight] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [watch, setWatch] = useState(0);
    const [visible, setVisible] = useState(false);
    const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [salesToShow, setSalesToShow] = useState(sales);
    const [incomesSum, setIncomesSum] = useState(0)
    const [outcomesSum, setOutcomesSum] = useState(0)
    const toast = useRef(null);
    const dt = useRef(null);
    const [filters, setFilters] = useState({
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'watch.companyBarcode': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        phone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        date: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    useEffect(() => {
        if (isSuccess) {
            setSalesToShow(sales)
            calculateIncomming(sales)
            calculateOutcomming(sales)
        }
    }, [isSuccess])

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const confirmDeleteProduct = (watchId) => {
        setWatch(watchId)
        setDeleteProductDialog(true);
    };

    const watchBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <img alt="flag" src={"http://localhost:3150/uploads/" + rowData.watch.imageUrl.split("\\")[2]} style={{ width: '100px' }} />
                <span>{rowData.watch.companyBarcode}</span>
            </div>
        );
    };
    const dateBodyTemplate = (rowData) => {
        let date = new Date(rowData.date);
        const formattedDate = date.toLocaleDateString('en-GB');
        return (
            <div>
                {
                    formattedDate
                }
            </div>
        )
    }

    const dateTemplate = (rowData) => {
        const date = new Date(rowData.date);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        return formattedDate;
    };

    const [lockedCustomers, setLockedCustomers] = useState([]);

    const lockTemplate = (rowData, options) => {
        const disabled = options.frozenRow ? false : lockedCustomers.length >= 2;
        return <Button type="button" icon="pi pi-trash" rounded outlined severity="danger" className="p-button-sm p-button-text" onClick={() => confirmDeleteProduct(rowData._id)} />
    };

    const exportWatch = (rowData, options) => {
        return rowData.watch.companyBarcode
    };

    const [Delete, { data }] = useDeleteFromSalesMutation()

    const HandleDeleteClick = (watchId) => {
        Delete(watch)
        setDeleteProductDialog(false);
        setWatch(0);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        toast.current.show({ severity: 'error', summary: 'שימו לב', detail: 'יש צורך לעדכן כמות במלאי השעונין', life: 3000 });
    }


    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="ביטול" icon="pi pi-times" outlined onClick={() => hideDeleteProductDialog()} />&nbsp;&nbsp;
            <Button label="אישור" icon="pi pi-check" severity="danger" onClick={HandleDeleteClick} />
        </React.Fragment>
    );

    const HandleDateSortingInDialogClick = (e) => {
        setVisible(false);
        let sortSale = sales?.filter((s) => (new Date(s.date) >= (startDate) && endDate >= (new Date(s.date))))
        setSalesToShow(sortSale)
        calculateIncomming(sortSale)
        calculateOutcomming(sales)
    }
    const HandleDateUnSortingClick = () => {
        setSalesToShow(sales)
        calculateIncomming(sales)
        calculateOutcomming(sales)
    }

    const calculateIncomming = (salesToCalculate) => {
        let salesToSum = 0
        salesToSum = salesToCalculate?.map((s) => {
            return s.paid
        })


        const x = String(salesToSum)?.split(",")
        let y = 0

        for (let i = 0; i < x.length; i++)
            y += Number(x[i]);
        setIncomesSum(y)
    }
    const calculateOutcomming = (salesToCalculate) => {
        let salesToSum = 0
        salesToSum = salesToCalculate?.map((s) => {
            return s.actualCost
        })


        const x = String(salesToSum)?.split(",")
        let y = 0

        for (let i = 0; i < x.length; i++)
            y += Number(x[i]);
        setOutcomesSum(y)
    }

    if (isLoading) return (
        <div style={{ backgroundColor: '#ebeced', minHeight: '410px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ direction: 'rtl', justifyContent: 'center' }}><i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>  בטעינה... </h2>
        </div>
    )

    return (
        <>
            <Toast ref={toast} />
            <div className="card">
                <br />
                <Button style={{ width: '150px', margin: 'auto', marginRight: '10px', backgroundColor: "#235447" }} label="אפשרויות נוספות" icon="pi pi-plus" onClick={() => setVisibleRight(true)} />
                <Toolbar className="mb-4" ></Toolbar>
                <DataTable ref={dt} tableStyle={{ direction: 'rtl' }} exportFilename={'Watches report ' + new Date().toLocaleDateString('en-GB')} value={salesToShow} filters={filters} paginator rows={10} dataKey="id" filterDisplay="row" emptyMessage="No purchase found.">
                    <Column field="watch" header="שעון" filterField="watch.companyBarcode" exportField={exportWatch} style={{ minWidth: '12rem' }} body={watchBodyTemplate} filter filterPlaceholder="Search by companyBarcode" />
                    <Column field="name" header="שם" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                    <Column field="phone" header="טלפון" filter filterPlaceholder="Search by phone" style={{ minWidth: '12rem' }} />
                    <Column field="originalPrice" header="מחיר מקורי" />
                    <Column field="paid" header="מחיר בקניה" />
                    <Column field="date" header="תאריך" exportField={dateTemplate} body={dateBodyTemplate} filter filterPlaceholder="Search by date" style={{ minWidth: '12rem' }} />
                    <Column header="הסר" style={{ flex: '0 0 4rem' }} body={lockTemplate}></Column>
                </DataTable>
            </div>
            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content" style={{ direction: 'rtl' }}>
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <br /><br />
                    <span>
                        אתה בטוח שברצונך למחוק מוצר זה?
                    </span>
                </div>
            </Dialog>

            <Sidebar style={{ display: "flex" }} visible={visibleRight} position="right" onHide={() => setVisibleRight(false)}><br />
                <Button label="הורדה" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} style={{ backgroundColor: "#235447" }} /><br /><br />
                <h2>סינון לפי טווח תאריכים</h2><br />
                <h4>מתאריך</h4>
                <DatePicker style={{ backgroundColor: "indigo" }} selected={startDate} dateFormat={"dd/MM/YYYY"} onChange={(date) => { setStartDate(date) }} />
                <h4>עד תאריך</h4>
                <DatePicker style={{ width: "50%", display: "flex" }} selected={endDate} dateFormat={"dd/MM/YYYY"} onChange={(date) => { setEndDate(date) }} />  <br />  <br /><br /><br />
                <div style={{ display: "flex" }}>
                    <Button label="  בטל סינון " style={{ margin: "auto", backgroundColor: "#235447" }} onClick={HandleDateUnSortingClick} />
                    <Button label="סנן" style={{ margin: "auto", backgroundColor: "#235447" }} onClick={HandleDateSortingInDialogClick} />
                </div><br />
                <span>
                    <h3>:סך ההכנסות</h3>
                    {incomesSum ? incomesSum : 0}₪

                    <h3>:סך הרווחים</h3>
                    {incomesSum > 0 ? (incomesSum - outcomesSum) : 0}₪
                </span>
            </Sidebar>
        </>
    );
}
