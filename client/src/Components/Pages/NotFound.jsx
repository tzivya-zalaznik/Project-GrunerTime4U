import React from 'react';

export default function NotFound() {
    return (
        <>
            <div style={{ height: '410px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#ffff' }}>
                <div style={{ display: 'flex', justifyContent: 'center', direction: 'rtl' }}>
                    <i className="pi pi-search" style={{ fontSize: '1rem' }}></i>&nbsp;אופס! הדף שביקשת לא זמין...
                </div>
            </div>;
        </>
    );
}
