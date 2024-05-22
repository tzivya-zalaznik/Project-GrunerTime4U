
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { useAddToCompaniesMutation, useDeleteFromCompaniesMutation, useGetCompaniesQuery, useUpdateCompanyMutation } from '../../Slices/companiesApiSlice';
import "react-datepicker/dist/react-datepicker.css";
import { Tooltip } from 'primereact/tooltip';
import { ProgressBar } from 'primereact/progressbar';


export default function Company() {
    let emptyProduct = {
        id: '',
        name: '',
        imageUrl: '',
        isImgUpdate: false
    };

    const [AddCompany, { }] = useAddToCompaniesMutation()
    const [UpdateCompany, { }] = useUpdateCompanyMutation()
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    // const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedImg, setSelectedImg] = useState({})
    const toast = useRef(null);
    const dt = useRef(null);

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const rightToolbarTemplate = () => {
        return (
            <div>
                <Button label="הוספת חברה" icon="pi pi-plus" severity="success" onClick={openNew} style={{ backgroundColor:"#235447" }}/>&nbsp;&nbsp;
                <Button label="הורדה" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} style={{ backgroundColor:"#235447" }}/>
            </div>
        )
    };

    const imageUrlTemplate = (rowData) => {
        return rowData.imageUrl.split("\\")[2];
    };

    const { data: products, isSuccess: sss,isLoading } = useGetCompaniesQuery()

    const onTemplateSelect = (e) => {
        setSelectedImg(e.files[0])
        let _totalSize = totalSize;
        let files = e.files;
        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });
        setTotalSize(_totalSize);
    };

    const openNew = () => {
        setSelectedImg({})
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);
        if (product._id) {
            if (product.name?.trim()) {
                if (selectedImg.name) {
                    const formData = new FormData()
                    formData.append('imageUrl', selectedImg)
                    formData.append('_id', product._id);
                    formData.append('name', product.name);
                    formData.append('isImgUpdate', true);
                    UpdateCompany(formData)
                    setSelectedImg({})
                    setProductDialog(false);
                    setProduct(emptyProduct);
                }
                else {
                    UpdateCompany(product)
                    setSelectedImg({})
                    setProductDialog(false);
                    setProduct(emptyProduct);
                }
            }
        } else {
            if (product.name?.trim() && selectedImg.name) {
                const formData = new FormData()
                formData.append('imageUrl', selectedImg)
                formData.append('name', product.name);
                AddCompany(formData)
                setSelectedImg({})
                setProductDialog(false);
                setProduct(emptyProduct);
            }
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const onTemplateUpload = (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 1 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };
    const [Delete, {data: dd,error: error }] = useDeleteFromCompaniesMutation()

    const HandleDeleteClick = (companyId) => {
        Delete(companyId)
    }

    useEffect(() => {
        if (error?.originalStatus == 403) {
            toast.current.show({ severity: 'error', summary: 'אזהרה', detail: 'קיימים שעונים המשוייכים לחברה זו', life: 3000 });
            setDeleteProductDialog(false);
        }
        if (error?.originalStatus == 200) {
            setSelectedImg({})
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: ' החברה נמחקה בהצלחה', life: 3000 });
        }

    }, [error])

    const deleteProduct = () => {
         HandleDeleteClick(product._id)
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />&nbsp;&nbsp;
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={"http://localhost:3150/uploads/" + rowData.imageUrl.split("\\")[2]} alt={rowData.imageUrl} className="shadow-2 border-round" style={{ width: '200px' }} />;
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between" style={{direction:'rtl'}}>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="ביטול" icon="pi pi-times" outlined onClick={hideDialog} />&nbsp;&nbsp;
            <Button label="שמירה" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="ביטול" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />&nbsp;&nbsp;
            <Button label="אישור" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );

    if (isLoading) return (
        <div style={{ backgroundColor: '#ebeced', minHeight: '410px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ direction: 'rtl', justifyContent: 'center' }}><i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>  בטעינה... </h2>
        </div>
    )

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" /*left={leftToolbarTemplate}*/ right={rightToolbarTemplate}></Toolbar>
                <DataTable exportFilename={'Companies '+new Date().toLocaleDateString('en-GB')} tableStyle={{ direction: 'rtl' }} ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column field="imageUrl" header="תמונה" body={imageBodyTemplate} exportField={imageUrlTemplate} ></Column>
                    <Column field="name" header="שם חברה" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.imageUrl && <img src={"http://localhost:3150/uploads/" + product.imageUrl.split("\\")[2]} alt={product.imageUrl} className="product-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        שם חברה
                    </label>
                    <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="imageUrl" className="font-bold">
                        תמונה
                    </label>
                </div>
                <Tooltip value={product.imageUrl} target=".custom-choose-btn" content="Choose" position="bottom" />
                <FileUpload ref={fileUploadRef} name="demo[]" accept="image/*" maxFileSize={1000000}

                    onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                    headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                    chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
                {submitted && !selectedImg.name && <small className="p-error">imageUrl is required.</small>}
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content" style={{ direction: 'rtl' }}>
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <br /><br />
                    {product && (
                        <span>
                            אתה בטוח שברצונך למחוק מוצר זה?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
