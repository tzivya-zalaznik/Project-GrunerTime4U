import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { useAddToFavoriteMutation, useGetFavoriteQuery } from '../../Slices/galleryApiSlice';
import { useDispatch } from 'react-redux';
import { setToken } from '../../Slices/authSlice';
import { Dialog } from 'primereact/dialog';
import { Image } from 'primereact/image';

const Favorite = () => {
    const { data: full_favourites, isLoading, isError, error } = useGetFavoriteQuery()
    const [Delete, { data, isSuccess }] = useAddToFavoriteMutation()
    const [showWatchDetails, setShowWatchDetails] = useState(false);
    const [watchDetails, setWatchDetails] = useState({});
    const dispatch = useDispatch()
    const HandleHeartClick = (watchId) => {
        Delete({ user: localStorage.getItem("user"), watches: full_favourites.filter(w => w?._id != watchId) })
    }
    useEffect(() => {
        if (isSuccess) {
            dispatch(setToken({ accessToken: localStorage.getItem("token"), user: data.user }))
        }
    }, [isSuccess])

    const HandleWatchDetails = (id) => {
        setShowWatchDetails(true)
        const watch = full_favourites.filter(w => w?._id == id)
        setWatchDetails(watch)
        setShowWatchDetails(true)

    }

    const hideDeleteProductDialog = () => {
        setShowWatchDetails(false)
    };

    const deleteProductDialogFooter = (
        <React.Fragment>
        </React.Fragment>
    );


    const gridItem = (product) => {
        return (
            <div>
                <div className={product.quantity == 0 ? "outOfStock" : ""} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }} className="ccc">
                            <div className="col-12 md:col-6 xl:col-3 p-3">
                                <div className="surface-card shadow-2 border-round p-4 ccc">
                                    <div className="flex flex-column align-items-center border-bottom-1 surface-border pb-3">
                                        <img style={{ height: '50px', width: 'auto', marginBottom: '5px', opacity: `${product.quantity == 0 ? '30%' : '100%'}` }} src={"http://localhost:3150/uploads/" + product.company.imageUrl.split("\\")[2]} alt="Image" preview width="250" />
                                        <div class="container">
                                            <img className={product.quantity == 0 ? "watchImageOutOfStock " : "watchImage"} src={"http://localhost:3150/uploads/" + product.imageUrl.split("\\")[2]} alt="Image" preview width="250" />
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
                                            {product.price == product.disPrice ? <span style={{ opacity: "0%" }}>----</span> : <span className=" font-medium line-through original-price" style={{ opacity: product.price == product.disPrice ? '100%' : '70%', fontSize: product.price == product.disPrice ? 'xxl' : 'small' }} >₪{product.price}</span>}
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
                                        <button className="p-element p-ripple p-button-text p-button p-component" disabled={product.quantity == 0} onClick={() => HandleHeartClick(product._id)}>
                                            <span className="p-button-icon p-button-icon-left pi pi-heart" aria-hidden="true"></span>
                                            <span className="p-button-label">
                                                הסר מהמועדפים
                                            </span>
                                            <span className="p-ink"></span>
                                        </button>
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
            </div>
        );
    };
    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;
        let isWatch = false
        let list = items.map((product, index) => {
            if (product) {
                isWatch = true
                return gridItem(product, index);
            }
        });
        if (isWatch)
            return <div className="grid grid-nogutter">{list}</div>;
        return <div style={{height:'410px',display: 'flex',flexDirection: 'column',justifyContent: 'center',backgroundColor:'#ffff'}}><div style={{ display: 'flex', justifyContent: 'center',direction:'rtl' }}><i className="pi pi-search" style={{ fontSize: '1rem' }}></i>&nbsp; לא נמצאו פריטים התואמים לחיפוש שלך...</div></div>;
    };

    if (isLoading) return (
        <div style={{ backgroundColor: '#ebeced', minHeight: '410px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ direction: 'rtl', justifyContent: 'center' }}><i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>  בטעינה... </h2>
        </div>
    )

    if (!full_favourites?.length) return <div style={{height:'410px',display: 'flex',flexDirection: 'column',justifyContent: 'center',backgroundColor:'#ffff'}}><div style={{ display: 'flex', justifyContent: 'center',direction:'rtl' }}><i className="pi pi-search" style={{ fontSize: '1rem' }}></i>&nbsp; לא נמצאו פריטים התואמים לחיפוש שלך...</div></div>;

    if (isError) return <h2>{error.data.message}</h2>
    return (
        <>
            <div style={{ backgroundColor: '#ffffff', minHeight: '410px' }}>
                <div >
                    <DataView value={full_favourites} listTemplate={listTemplate} />
                </div>
            </div>
        </>
    )
}
export default Favorite;
