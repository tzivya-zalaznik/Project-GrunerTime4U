import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { useAddToFavoriteMutation, useGetGalleryQuery } from '../../Slices/galleryApiSlice';
import { useDispatch } from 'react-redux';
import { setToken } from '../../Slices/authSlice';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Image } from 'primereact/image';
import { Checkbox } from "primereact/checkbox";
import { Slider } from "primereact/slider";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import Swal from 'sweetalert2'
import { Toast } from 'primereact/toast';
import { useGetCompaniesQuery } from '../../Slices/companiesApiSlice';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';
import { RadioButton } from 'primereact/radiobutton';
const Gallery = () => {
  const { data: gallery, isSuccess: success, isLoading, isError, error } = useGetGalleryQuery()
  const { data: companies, isSuccess: sss } = useGetCompaniesQuery()
  const [AddToFavorite, { data, isSuccess }] = useAddToFavoriteMutation()
  const [visible, setVisible] = useState(false);
  const [watchDetails, setWatchDetails] = useState({});
  const [showWatchDetails, setShowWatchDetails] = useState(false);
  const [visibleRight, setVisibleRight] = useState(false);
  const [newProducts, setNewProducts] = useState([]);
  const [layout, setLayout] = useState('grid');
  const [showGallery, setShowGallery] = useState([]);
  const [checkedMen, setCheckedmen] = useState(false)
  const [checkedWomen, setCheckedwomen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [sortKey, setSortKey] = useState(1);
  const [sortOrder, setSortOrder] = useState(0);
  const [sortField, setSortField] = useState('');
  const [gender, setGender] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [value, setValue] = useState([0, 1000]);
  const toast = useRef(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const icon = (<i className="pi pi-search"></i>)

  useEffect(() => {
    if (success) {
      setShowGallery(gallery)
      setMaxPrice(Math.max(...gallery.map(item => item.disPrice)))
    }
  }, [success])
  useEffect(() => {
    if (gallery) {
      const filtered = gallery.filter(w => w.category.includes(gender) &&
        (selectedCompanies.length == 0 || selectedCompanies.includes(w.company.name))
        && w.disPrice >= value[0] && w.disPrice <= value[1])
      setShowGallery(filtered)
    }
  }, [gender, selectedCompanies])

  useEffect(() => {
    if (gallery) {
      const filtered = gallery.filter(w => w.category.includes(gender) &&
        (selectedCompanies.length == 0 || selectedCompanies.includes(w.company.name))
        && w.disPrice >= value[0] && w.disPrice <= value[1])
      setShowGallery(filtered)
    }
  }, [value])

  useEffect(() => {
    if (maxPrice > 0) setValue([0, maxPrice])
  }, [maxPrice])

  const onCategoryChange = (e) => {
    let _selectedCompanies = [...selectedCompanies];
    if (e.checked)
      _selectedCompanies.push(e.value.name);
    else
      _selectedCompanies = _selectedCompanies.filter(company => company != e.value.name);

    setSelectedCompanies(_selectedCompanies);
  };

  const HandleHeartClick = (watch) => {
    if (!localStorage.token) {
      showSwal();
    }
    else {
      let watches = JSON.parse(localStorage.getItem("user")).watches
      const duplicate = watches.filter(w => w == watch._id)
      if (!duplicate?.length) {
        toast.current.show({ severity: 'success', summary: `${watch.companyBarcode}`, detail: 'נוסף בהצלחה', life: 3000 });
        watches = [...watches, watch._id]
        AddToFavorite({ user: localStorage.getItem("user"), watches: watches })
      }
    }
  }
  const deleteProductDialogFooter = (
    <React.Fragment>
    </React.Fragment>
  );

  useEffect(() => {
    if (isSuccess) {
      dispatch(setToken({ accessToken: localStorage.getItem("token"), user: data.user }))
    }
  }, [isSuccess])

  const HandleWatchDetails = (id) => {
    setShowWatchDetails(true)
    const watch = gallery.filter(w => w._id == id)
    setWatchDetails(watch)
    setShowWatchDetails(true)

  }

  const hideDeleteProductDialog = () => {
    setShowWatchDetails(false)
  };


  const showSwal = () => {
    Swal.fire({
      reverseButtons: true,
      title: "<strong>משתמש יקר</strong>",
      icon: "warning",
      iconColor: '#1b5446',
      html: `יש לבצע כניסה למערכת לפני בחירת מועדפים`,
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

  const gridItem = (product) => {
    return (
      <div>
        <div className={product.quantity == 0 ? "outOfStock" : ""} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }} className="ccc">
              <div className="col-12 md:col-6 xl:col-3 p-3">
                <div className="surface-card shadow-2 border-round p-4 ccc">
                  <div className="flex flex-column align-items-center border-bottom-1 surface-border pb-3">
                    <img style={{ height: '50px', width: 'auto', marginBottom: '5px', opacity: `${product.quantity == 0 ? '30%' : '100%'}` }} src={"http://localhost:3150/uploads/" + product.company.imageUrl.split("\\")[2]} /*alt={product.name}*/ indicatorIcon={icon} alt="Image" preview width="250" />
                    <div class="container">
                      <img className={product.quantity == 0 ? "watchImageOutOfStock " : "watchImage"} src={"http://localhost:3150/uploads/" + product.imageUrl.split("\\")[2]} /*alt={product.name}*/ indicatorIcon={icon} alt="Image" preview width="250" />
                      {product.price != product.disPrice ? <span class="onsale sold-out" style={{ opacity: `${product.quantity == 0 ? '30%' : '100%'}` }}>מבצע!</span> : null}

                      {product.quantity == 0 ? <div class="caption" style={{ opacity: '80%', fontSize: '120px', color: 'gray' }}>
                        אזל
                      </div> : null}</div>
                    <span className="text-xl text-900 font-medium mb-2" style={{ opacity: `${product.quantity == 0 ? '30%' : '100%'}` }}>
                      {product.companyBarcode}
                    </span>
                    <span className="text-600 font-medium mb-3" style={{ opacity: `${product.quantity == 0 ? '30%' : '100%'}` }}>
                      {product.category}
                    </span>
                    <div class="price-container">
                      <span className="text-2xl font-semibold current-price" style={{ opacity: `${product.quantity == 0 ? '30%' : '100%'}` }}>₪{product.disPrice}</span>
                      {product.price == product.disPrice ? <span style={{ opacity: '0%' }}>----</span> : <span className=" font-medium line-through original-price" style={{ opacity: product.price == product.disPrice ? '100%' : '70%', fontSize: product.price == product.disPrice ? 'xxl' : 'small' }} >₪{product.price}</span>}
                    </div>
                  </div>
                  <div className="flex pt-3 justify-content-between align-items-center">
                    <button className="p-element p-ripple p-button-text p-button p-component" disabled={product.quantity == 0} onClick={() => HandleWatchDetails(product._id)}>
                      <span className="p-button-icon p-button-icon-left pi pi-plus" aria-hidden="true"></span>
                      <span className="p-button-label">
                        פרטי מוצר
                      </span>
                      <span className="p-ink"></span>
                    </button>
                    <button className="p-element p-ripple p-button-text p-button p-component" disabled={product.quantity == 0} onClick={() => HandleHeartClick(product)}>
                      <span className="p-button-icon p-button-icon-left pi pi-heart" aria-hidden="true"></span>
                      <span className="p-button-label">
                        הוסף למועדפים
                      </span>
                      <span className="p-ink"></span>
                    </button>
                  </div>
                  <Dialog visible={showWatchDetails} style={{ width: '50rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                    <div className='details' style={{ display: 'flex', justifyContent: 'space-around', direction: 'rtl', textAlign: 'right' }}>
                      <div className="flex justify-content-center">
                        <Image src={watchDetails ? "http://localhost:3150/uploads/" + watchDetails[0]?.imageUrl.split("\\")[2] : ""} alt="Image" width="100%" preview />
                      </div>
                      <div style={{ float: 'left', width: '60%' }}>
                        <div style={{ textAlign: 'right' }}><h1>{watchDetails ? watchDetails[0]?.companyBarcode : null}</h1></div>
                        <div style={{ textAlign: 'right' }}>{watchDetails ? watchDetails[0]?.description : null}</div>
                        <div style={{ textAlign: 'right', fontSize: '25px' }}>₪{watchDetails ? watchDetails[0]?.disPrice : null}</div>
                        <div class="price-container">
                          {watchDetails ? watchDetails[0]?.price == watchDetails[0]?.disPrice ? null : <span className=" font-medium line-through original-price" style={{ opacity: watchDetails[0]?.price == watchDetails[0]?.disPrice ? '100%' : '70%', fontSize: watchDetails[0]?.price == watchDetails[0]?.disPrice ? 'xxl' : 'small', textAlign: 'right' }} >₪{watchDetails[0]?.price}</span> : null}
                          <hr></hr>
                          <div style={{ textAlign: 'right' }}><b>קטגוריה:</b> {watchDetails ? watchDetails[0]?.category : null}</div>
                          <div style={{ textAlign: 'right' }}><b>גודל השעון:</b> {watchDetails ? watchDetails[0]?.size : null}</div>
                          <div style={{ textAlign: 'right' }}><b>חברה:</b> {watchDetails ? watchDetails[0]?.company.name : null}</div>
                          <div style={{ textAlign: 'right' }}><b>קיים בצבעים:</b> {watchDetails ? watchDetails[0]?.otherColors : null}</div>
                        </div>
                      </div>
                    </div>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const onSortChange = (event) => {
    if (sortKey == 1) {
      setSortOrder(1);
      setSortField('price');
      setSortKey(-1);
    } else {
      setSortOrder(-1);
      setSortField('price');
      setSortKey(1);
    }
  };

  const barcodeFilter = (barcode) => {
    if (barcode != '') {
      const arr = showGallery.filter(w => w.companyBarcode.toLowerCase().includes(barcode.toLowerCase()));
      setShowGallery(arr)
    } else {
      const filtered = gallery.filter(w => w.category.includes(gender) &&
        (selectedCompanies.length == 0 || selectedCompanies.includes(w.company.name))
        && w.disPrice >= value[0] && w.disPrice <= value[1])
      setShowGallery(filtered)
    }

  }

  const listTemplate = (items) => {
    if (!items || items.length === 0) return <div style={{ width: '85%', display: 'flex', justifyContent: 'center', direction: 'rtl' }}><i className="pi pi-search" style={{ fontSize: '1rem' }}></i>&nbsp; לא נמצאו פריטים התואמים לחיפוש שלך...</div>;

    let list = items.map((product, index) => {
      return gridItem(product, index);
    });

    return <div className="grid grid-nogutter">{list}</div>;
  };

  if (isLoading) return (
    <div style={{ backgroundColor: '#ebeced', minHeight: '410px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h2 style={{ direction: 'rtl', justifyContent: 'center' }}><i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>  בטעינה... </h2>
    </div>
  )

  if (isError) return <h2>{error.data.message}</h2>
  return (
    <div style={{ minHeight: '410px', backgroundColor: 'white' }}>
      <button className="responsiveFilters p-element p-ripple p-button-text p-button p-component" onClick={() => setVisibleRight(true)}>
        <span className="p-button-label">
          חיפוש מתקדם
        </span>&nbsp;
        <span className="p-button-icon p-button-icon-left pi pi-search" aria-hidden="true"></span>
      </button>
      <Toast ref={toast} />
      <div className="card flex justify-content-center" style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#ffff' }}>
        <div className="card products" style={{ display: 'flex', justifyContent: 'center' }}>
          <DataView sortField={sortField} sortOrder={sortOrder} value={showGallery} listTemplate={listTemplate} />
        </div>
        <Sidebar style={{ width: "70vw" }} visible={visibleRight} position="right" onHide={() => setVisibleRight(false)}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="" style={{ height: '45vw' }}>
              <br />
              <div className="search">
                <div className="">
                  <span className="p-input-icon-left" style={{ display: 'flex', alignItems: 'center' }}>
                    <i className="pi pi-search" />
                    <InputText onChange={(e) => barcodeFilter(e.target.value)} placeholder="Search" style={{ flex: 1 }} />
                  </span>
                </div>
                <br /><br />
                <b style={{ marginLeft: '60%' }}>קטגוריות</b><br /><br />
                <div className="flex justify-content-center">
                  <label htmlFor="men" className="ml-2">גברים</label>&nbsp;&nbsp;
                  <Checkbox inputId='men' onChange={e => { setCheckedmen(!checkedMen); if (checkedWomen) setCheckedwomen(false); if (e.checked) setGender('גברים'); else setGender('') }} checked={checkedMen} />
                </div>
              </div>
              <br />
              <div className="flex justify-content-center">
                <label htmlFor="women" className="ml-2">נשים</label>&nbsp;&nbsp;
                <Checkbox inputId='women' onChange={e => { setCheckedwomen(!checkedWomen); if (checkedMen) setCheckedmen(false); if (e.checked) setGender('נשים'); else setGender('') }} checked={checkedWomen} />
              </div>
              <br /><br />
              <button className="p-element p-ripple p-button-text p-button p-component" style={{ color: '#1b5446' }} onClick={() => onSortChange()}>
                <span className="p-button-icon p-button-icon-left pi pi-sort-alt" aria-hidden="true"></span>
                <span className="p-button-label">
                  מיון לפי מחיר
                </span>
                <span className="p-ink"></span>
              </button>
              <br /><br />
              <br />
              <div className=" flex justify-content-center" style={{ justifyContent: 'center' }}>
                <div className="flex flex-row gap-0">
                  <Slider value={value} onChange={(e) => setValue(e.value)} className="w-8rem" range min={0} max={maxPrice} step={10} /><br />
                </div>
              </div>
              <span style={{ marginRight: '40%' }}>
                &nbsp; {"₪" + value[0]}
              </span>
              <span style={{ marginLeft: "6vw" }}>
                &nbsp;{"₪" + value[1]}
              </span>
              <br /><br />
              <br />
              <div><b style={{ marginLeft: '60%' }}>מותגים</b></div>
              <div class="inline-block text-center p-4 border-round">
                <div className=" flex justify-content-center">
                  <div className="flex flex-column gap-3" style={{ marginRight: '30%' }}>
                    {companies?.map((company) => {
                      return (
                        <div className="flex align-items-center"  >
                          <Checkbox name="company" value={company} onChange={onCategoryChange} checked={selectedCompanies.some((item) => item === company?.name)} />
                          <label className="ml-2">
                            {company.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Sidebar>
        <div class="vertical-line"></div>
        <div className="search-container" style={{ width: '15%', height: '45vw' }}>
          <br />
          <div className="search">
            <div className="card">
              <span className="p-input-icon-left" style={{ display: 'flex', alignItems: 'center' }}>
                <i className="pi pi-search" />
                <InputText onChange={(e) => barcodeFilter(e.target.value)} placeholder="Search" style={{ flex: 1, width: '50%' }} />
              </span>
            </div>
            <br /><br />
            <b>קטגוריות</b><br /><br />
            <label htmlFor="men" className="ml-2">גברים</label>&nbsp;&nbsp;
            <Checkbox inputId='men' onChange={e => { setCheckedmen(!checkedMen); if (checkedWomen) setCheckedwomen(false); if (e.checked) setGender('גברים'); else setGender('') }} checked={checkedMen} />
          </div>
          <br />
          <div className="flex justify-content-center">
            <label htmlFor="women" className="ml-2">נשים</label>&nbsp;&nbsp;
            <Checkbox inputId='women' onChange={e => { setCheckedwomen(!checkedWomen); if (checkedMen) setCheckedmen(false); if (e.checked) setGender('נשים'); else setGender('') }} checked={checkedWomen} />
          </div>
          <br /><br />
          <button style={{ color: '#1b5446' }} className="p-element p-ripple p-button-text p-button p-component" onClick={() => onSortChange()}>
            <span className="p-button-icon p-button-icon-left pi pi-sort-alt" aria-hidden="true"></span>
            <span className="p-button-label">
              מיון לפי מחיר
            </span>
            <span className="p-ink"></span>
          </button>
          <br /><br />
          <br />
          <div className=" flex justify-content-center" style={{ justifyContent: 'center' }}>
            <div className="flex flex-row gap-0">
              <Slider value={value} onChange={(e) => setValue(e.value)} className="w-8rem" range min={0} max={maxPrice} step={10} /><br />
            </div></div>
          <span style={{ marginTop: '100vw' }}>
            &nbsp;₪ {value[0]}&nbsp;
          </span>
          <span style={{ marginLeft: "6vw" }}>
            &nbsp; ₪&nbsp;{value[1]}
          </span>
          <br /><br />
          <br />
          <div><b>מותגים</b></div>
          <div class="inline-block text-center p-4 border-round">
            <div className=" flex justify-content-center">
              <div className="flex flex-column gap-3">
                {companies?.map((company) => {
                  return (
                    <div className="flex align-items-center"  >
                      <Checkbox name="company" value={company} onChange={onCategoryChange} checked={selectedCompanies.some((item) => item === company?.name)} />
                      <label className="ml-2">
                        {company.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Gallery;