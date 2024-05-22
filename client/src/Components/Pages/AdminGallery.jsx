import React, { useState, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useAddToGalleryMutation, useDeleteFromGalleryMutation, useGetGalleryQuery, useUpdateWatchMutation } from '../../Slices/galleryApiSlice';
import { useAddToSalesMutation } from '../../Slices/salesApiSlice';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { useGetCompaniesQuery } from '../../Slices/companiesApiSlice';
import { Chips } from "primereact/chips";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export default function AdminGallery() {
    const [selectedImg, setSelectedImg] = useState({})
    const { data: products, isLoading, isError, error } = useGetGalleryQuery()
    const { data: brands, isSuccess: sss } = useGetCompaniesQuery()
    let emptyProduct = {
        id: '',
        company: '',
        companyBarcode: '',
        imageUrl: '',
        description: '',
        category: '',
        actualCost: 0,
        disPrice: 0,
        price: 0,
        quantity: 0,
        otherColors: [],
        size: 0,
        barcode: '',
        isImgUpdate: false
    };

    let emptyPurchase = {
        name: '',
        phone: '',
        originalPrice: 0,
        paid: 0,
        date: new Date(),
        watch_id: '',
        imageUrl: '',
        companyBarcode: ''
    };

    const [AddToSales, { }] = useAddToSalesMutation()
    const [AddWatch, { }] = useAddToGalleryMutation()
    const [UpdateWatch, { }] = useUpdateWatchMutation()

    const [startDate, setStartDate] = useState(new Date());
    const [purchase, setPurchase] = useState(emptyPurchase);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [purchaseDialog, setPurchaseProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [value, setValue] = useState([]);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false);

    const footerContent = (
        <div>
            <Button label="ביטול" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="הוספת חברה" icon="pi pi-check" onClick={() => { setVisible(false); navigate('/company') }} autoFocus />
        </div>
    );

    const toast = useRef(null);
    const dt = useRef(null);

    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    let IsPurchase = false

    const onTemplateSelect = (e) => {
        setSelectedImg(e.files[0])
        let _totalSize = totalSize;
        let files = e.files;
        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });
        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;
        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });
        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file, callback) => {
        setSelectedImg({})
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setSelectedImg({})
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

    // const formatCurrency = (value) => {
    //     //return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    //     return 
    // };

    const openNew = () => {
        if (!brands) {
            setVisible(true)
        }
        else {
            setSelectedImg({})
            setSelectedBrand(null)
            setProduct(emptyProduct);
            setSubmitted(false);
            setProductDialog(true);
        }
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setSubmitted(false);
        setPurchaseProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const imageUrlTemplate = (rowData) => {
        return rowData.imageUrl.split("\\")[2];
    };

    const saveProduct = () => {
        setSubmitted(true);
        if (product._id) {
            if ((product.company?._id?.trim() || selectedBrand) && product.companyBarcode?.trim() && product.actualCost && product.price
                && product.disPrice && product.size && product.description?.trim() && product.barcode?.trim()
                && product.quantity && product.category?.trim()) {
                if (selectedImg.name) {
                    const formData = new FormData()
                    formData.append('imageUrl', selectedImg)
                    formData.append('_id', product._id);
                    formData.append('company', selectedBrand ? selectedBrand._id : product.company._id);
                    formData.append('companyBarcode', product.companyBarcode);
                    formData.append('actualCost', product.actualCost);
                    formData.append('price', product.price);
                    formData.append('disPrice', product.disPrice);
                    formData.append('otherColors', product.otherColors);
                    formData.append('size', product.size);
                    formData.append('description', product.description);
                    formData.append('barcode', product.barcode);
                    formData.append('quantity', product.quantity);
                    formData.append('category', product.category);
                    formData.append('isImgUpdate', true);
                    UpdateWatch(formData)
                    setSelectedImg({})
                    setSelectedBrand(null)
                    setProductDialog(false);
                    setSubmitted(false);
                    setProduct(emptyProduct);
                }
                else {
                    debugger
                    product.company = selectedBrand ? selectedBrand : product.company
                    UpdateWatch(product)
                    setSelectedImg({})
                    setSelectedBrand(null)
                    setProductDialog(false);
                    setSubmitted(false);
                    setProduct(emptyProduct);
                }
            }
        } else {
            if (selectedBrand?.name?.trim() && product.companyBarcode?.trim() && product.actualCost && product.price
                && product.disPrice && product.size && product.description?.trim() && product.barcode?.trim()
                && product.quantity && product.category?.trim() && selectedImg.name) {
                const formData = new FormData()
                formData.append('imageUrl', selectedImg)
                formData.append('company', selectedBrand._id);
                formData.append('companyBarcode', product.companyBarcode);
                formData.append('actualCost', product.actualCost);
                formData.append('price', product.price);
                formData.append('disPrice', product.disPrice);
                formData.append('otherColors', product.otherColors);
                formData.append('size', product.size);
                formData.append('description', product.description);
                formData.append('barcode', product.barcode);
                formData.append('quantity', product.quantity);
                formData.append('category', product.category);
                AddWatch(formData)
                setSelectedImg({})
                setSelectedBrand(null)
                setProductDialog(false);
                setSubmitted(false);
                setProduct(emptyProduct);
            }
        }
    };

    const savePurchase = () => {
        setSubmitted(true);
        IsPurchase = true
        if (purchase.name.trim() && purchase.phone.trim() && purchase.paid) {
            if (product._id && product.company._id?.trim() && product.companyBarcode?.trim() && product.actualCost && product.price
                && product.disPrice && product.size && product.description?.trim() && product.barcode?.trim()
                && product.quantity && product.category?.trim()) {
                UpdateWatch({ '_id': product._id, 'company': product.company, 'companyBarcode': product.companyBarcode, 'actualCost': product.actualCost, 'price': product.price, 'disPrice': product.disPrice, 'otherColors': product.otherColors, 'size': product.size, 'description': product.description, 'barcode': product.barcode, 'quantity': product.quantity - 1, 'category': product.category, 'isImgUpdate': false })
            }
            AddToSales({ 'name': purchase.name, 'phone': purchase.phone, 'date': purchase.date, 'originalPrice': purchase.originalPrice, 'paid': purchase.paid, 'watch': { id: purchase.watch_id, imageUrl: purchase.imageUrl, companyBarcode: purchase.companyBarcode } })
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Purchase Created', life: 3000 });
            setPurchaseProductDialog(false);
            setPurchase(emptyProduct);
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product, 'isImgUpdate': false });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const addPurchase = (product) => {
        setProduct(product);
        setPurchaseProductDialog(true);
    };

    const [Delete, { data, isSuccess }] = useDeleteFromGalleryMutation()

    const HandleDeleteClick = (watchId) => {
        Delete(watchId)
    }

    const deleteProduct = () => {
        HandleDeleteClick(product._id)
        setSelectedImg({})
        setSelectedBrand(null)
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _product = { ...product };

        _product['category'] = e.value;
        setProduct(_product);
    };

    // const onQuantityChange = () => {
    //     let _product = { ...product };

    //     _product['quantity'] = product.quantity - 1;
    //     setProduct(_product);
    // };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputChangePurchase = (e, name) => {

        const val = (e.target && e.target.value) || e || '';
        let _purchase = { ...purchase };

        _purchase[`${name}`] = val;

        setPurchase(_purchase);
    };

    const onInputNumberChangePurchase = (e, name) => {
        const val = e.value || 0;
        let _purchase = { ...purchase };
        _purchase['watch_id'] = product._id;
        _purchase['imageUrl'] = product.imageUrl;
        _purchase['companyBarcode'] = product.companyBarcode;
        _purchase['originalPrice'] = product.disPrice;
        _purchase[`${name}`] = val;

        setPurchase(_purchase);
    };

    // const leftToolbarTemplate = () => {
    //     return (
    //         <div className="flex flex-wrap gap-2">
    //             <Button label="New Watch" icon="pi pi-plus" severity="success" onClick={openNew} />
    //             <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
    //         </div>
    //     );
    // };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="הוספת שעון" icon="pi pi-plus" severity="success" onClick={openNew} style={{ backgroundColor: "#235447" }} />
                <Button label="הורדה" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} style={{ backgroundColor: "#235447" }} />
            </div>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={"http://localhost:3150/uploads/" + rowData.imageUrl.split("\\")[2]} alt={rowData.imageUrl} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };

    const disPriceBodyTemplate = (rowData) => {
        return `₪${rowData.disPrice}`
    };
    const otherColorsBodyTemplate = (rowData) => {
        return "[" + rowData.otherColors + "]"
    };
    const priceBodyTemplate = (rowData) => {
        return `₪${rowData.price}`
    };
    const actualCostBodyTemplate = (rowData) => {
        return `₪${rowData.actualCost}`
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <div style={{display:'flex'}}>
                    <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />&nbsp;
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />&nbsp;
                    <Button icon="pi pi-cart-plus" rounded outlined severity="success" disabled={!rowData.quantity} onClick={() => addPurchase(rowData)} />
                </div>
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between" style={{ direction: 'rtl' }}>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />&nbsp;&nbsp;
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const purchaseDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />&nbsp;&nbsp;
            <Button label="Save" icon="pi pi-check" onClick={savePurchase} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="ביטול" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />&nbsp;&nbsp;
            <Button label="אישור" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
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
                <DataTable exportFilename={'Watches gallery ' + new Date().toLocaleDateString('en-GB')} tableStyle={{ direction: 'rtl' }} ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column field="companyBarcode" header="ברקוד חברה" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="company.name" header="שם חברה" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="barcode" header="ברקוד קופה" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="imageUrl" header="תמונה" body={imageBodyTemplate} exportField={imageUrlTemplate}></Column>
                    <Column field="actualCost" header="מחיר מקורי" body={actualCostBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="price" header="מחיר" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="disPrice" header="מחיר בהנחה" body={disPriceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="quantity" header="כמות" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="size" header="גודל" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="otherColors" header="צבעים נוספים" body={otherColorsBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="description" header="תיאור" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

             <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="פרטי שעון" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.imageUrl && <img src={"http://localhost:3150/uploads/" + product.imageUrl.split("\\")[2]} alt={product.imageUrl} className="product-image block m-auto pb-3" style={{ width: '200px' }} />}
                <div className=" flex justify-content-center" style={{ width: '100%' }}>
                    <Dropdown value={selectedBrand || product.company} onChange={(e) => setSelectedBrand(e.value)} options={brands} optionLabel="name"
                        placeholder="בחר חברה" className="w-full md:w-14rem" />
                </div>
                {submitted && (!selectedBrand?._id && !product.company) && <small className="p-error">company is required.</small>}
                <div className="field">
                    <label htmlFor="companyBarcode" className="font-bold">
                        ברקוד חברה
                    </label>
                    <InputText id="companyBarcode" value={product.companyBarcode} onChange={(e) => onInputChange(e, 'companyBarcode')} required className={classNames({ 'p-invalid': submitted && !product.companyBarcode })} />
                    {submitted && !product.companyBarcode && <small className="p-error">Company Barcode is required.</small>}
                </div>
                <div style={{ display: "flex" }}>
                    <span >
                        <label htmlFor="price" className="font-bold">
                            מחיר מהיבואן
                        </label>
                        <div className="formgrid grid">
                            <div className="field col">
                                <InputNumber value={product.actualCost} style={{ width: "100%" }} name="actualCost"
                                    id="actualCost" required onValueChange={(e) => onInputNumberChange(e, 'actualCost')} />&nbsp;
                                {submitted && !product.actualCost && <small className="p-error">Actual Cost is required.</small>}
                            </div>
                        </div>
                    </span>

                    <span >
                        <label htmlFor="price" className="font-bold">
                            מחיר ללקוח
                        </label>
                        <div className="formgrid grid">
                            <div className="field col">
                            &nbsp;<InputNumber value={product.price} style={{ width: "90%" }} name="price"
                                    id="price" required onValueChange={(e) => onInputNumberChange(e, 'price')} />&nbsp;
                                {submitted && !product.price && <small className="p-error">price is required.</small>}
                            </div>
                        </div>
                    </span>

                    <span >
                        <label htmlFor="disPrice" className="font-bold">
                            מחיר בהנחה
                        </label>
                        <div className="formgrid grid">
                            <div className="field col">
                                <InputNumber value={product.disPrice} style={{ width: "100%" }} name="disPrice"
                                    id="disPrice" required onValueChange={(e) => onInputNumberChange(e, 'disPrice')} />
                                {submitted && !product.disPrice && <small className="p-error">disPrice is required.</small>}
                            </div>
                        </div>
                    </span>
                </div>

                <div style={{ display: "flow" }}>
                    <div style={{ display: "flex" }}>
                        <span >
                            <label htmlFor="quantity" className="font-bold">
                                כמות במלאי
                            </label>
                            <div className="field">
                                <InputNumber value={product.quantity} style={{ width: "100%" }} name="quantity" id="quantity" required onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                                {submitted && !product.quantity && <small className="p-error">quantity is required.</small>}
                            </div>
                        </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span  >
                            <label htmlFor="size" className="font-bold">
                                גודל
                            </label>
                            <div className="field">
                                <InputNumber value={product.size} style={{ width: "100%" }} id="size" onValueChange={(e) => onInputNumberChange(e, 'size')} required className={classNames({ 'p-invalid': submitted && !product.size })} />
                                {submitted && !product.size && <small className="p-error">size is required.</small>}
                            </div>
                        </span>
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        תיאור השעון
                    </label>
                    <InputText value={product.description} id="description" onChange={(e) => onInputChange(e, 'description')} required className={classNames({ 'p-invalid': submitted && !product.description })} />
                    {submitted && !product.description && <small className="p-error">description is required.</small>}
                </div>



                <div className="field">
                    <label htmlFor="barcode" className="font-bold">
                        ברקוד קופה
                    </label>
                    <InputText value={product.barcode} id="barcode" onChange={(e) => onInputChange(e, 'barcode')} required className={classNames({ 'p-invalid': submitted && !product.barcode })} />
                    {submitted && !product.barcode && <small className="p-error">barcode is required.</small>}
                </div>
                <div style={{ display: "flow" }}>

                    <div className="field">
                        <label className="mb-3 font-bold">קטגוריה</label>

                        <div className="formgrid grid" style={{ display: "flex", marginLeft: "30%", marginRight: "30%" }}>
                            <div className="field-radiobutton col-6">
                                <label htmlFor="category1">נשים</label>&nbsp;&nbsp;
                                <RadioButton inputId="category1" name="category" value="נשים" onChange={onCategoryChange} checked={product.category === 'נשים'} />
                            </div>
                            <div className="field-radiobutton col-6">
                                <label htmlFor="category2">גברים</label>&nbsp;&nbsp;
                                <RadioButton inputId="category2" name="category" value="גברים" onChange={onCategoryChange} checked={product.category === 'גברים'} />
                            </div>
                        </div>
                        {submitted && !product.category && <small className="p-error">Category is required.</small>}
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="otherColors" className="font-bold">
                        קיים בצבעים
                    </label>
                    <div className=" p-fluid">
                        <Chips value={product.otherColors || value} onChange={(e) => { setValue(e.value); onInputChange(e, 'otherColors') }} required className={classNames({ 'p-invalid': submitted && !product.otherColors })} />
                    </div>
                    {submitted && !product.otherColors && <small className="p-error">otherColors is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="imageUrl" className="font-bold">
                        תמונה
                    </label>
                    <Tooltip value={product.imageUrl} target=".custom-choose-btn" content="Choose" position="bottom" />
                    <FileUpload ref={fileUploadRef} name="demo[]" accept="image/*" maxFileSize={1000000}

                        onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                        headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                        chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
                    {submitted && !selectedImg.name && <small className="p-error">imageUrl is required.</small>}
                </div>
            </Dialog>

            <Dialog visible={purchaseDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="פרטי רכישה" modal className="p-fluid" footer={purchaseDialogFooter} onHide={hideDialog}>
                {product.imageUrl && <img src={"http://localhost:3150/uploads/" + product.imageUrl.split("\\")[2]} alt={product.imageUrl} className="product-image block m-auto pb-3" style={{ width: '200px' }} />}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        שם לקוח
                    </label>
                    <InputText id="name" onChange={(e) => onInputChangePurchase(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !purchase.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="phone" className="font-bold">
                        טלפון לקוח
                    </label>
                    <InputText id="phone" onChange={(e) => onInputChangePurchase(e, 'phone')} required className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !purchase.phone && <small className="p-error">Phone is required.</small>}
                </div>

                <div className="field">
                    <DatePicker style={{ width: "50%" }} selected={startDate} dateFormat={"dd/MM/YYYY"} onChange={(date) => { onInputChangePurchase(date, 'date'); setStartDate(date) }} />
                    <label htmlFor="date" className="font-bold">
                        תאריך רכישה
                    </label>
                    {submitted && !purchase.date && <small className="p-error">Date is required.</small>}
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <InputNumber style={{ width: "50%" }} name="paid"
                            id="paid" required onValueChange={(e) => onInputNumberChangePurchase(e, 'paid')} />&nbsp;
                        <label htmlFor="paid" className="font-bold">
                            מחיר בקניה
                        </label><br />
                        {submitted && !purchase.paid && <small className="p-error">Paid is required.</small>}
                    </div>
                </div>

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

            <Dialog header="!מנהל יקר" visible={visible} style={{ width: '20vw' }} onHide={() => setVisible(false)} footer={footerContent}>
                <p className="m-0">
                    ):אין חברות במערכת
                </p>
                <p>
                    יש להוסיף חברה
                </p>
            </Dialog>
        </div >
    );
}
