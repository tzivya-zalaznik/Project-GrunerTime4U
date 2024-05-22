import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';

const AccessibilityOptions = () => {
    const [visible, setVisible] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const increaseFontSize = () => {
        document.body.style.fontSize = 'larger';
    };

    const decreaseFontSize = () => {
        document.body.style.fontSize = 'smaller';
    };

    const setHighContrast = () => {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
    };

    return (
        <div className="card flex justify-content-center">
            <Sidebar visible={visible} onHide={() => setVisible(false)}>
                <h2>Sidebar</h2>
                <div>
            <button onClick={increaseFontSize}>Increase Font Size</button>
            <button onClick={decreaseFontSize}>Decrease Font Size</button>
            <button onClick={setHighContrast}>High Contrast</button>
            <a href="#main-content" className="skip-link">Skip to Main Content</a>
            <main id="main-content">
                {/* Main content of your website */}
            </main>
        </div>
            </Sidebar>
            <Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
        </div>
    )
};

export default AccessibilityOptions;

// import React, { useState } from 'react';
// import { Sidebar } from 'primereact/sidebar';
// import { Button } from 'primereact/button';

// export default function BasicDemo() {
//     const [visible, setVisible] = useState(false);

//     return (
//         <div className="card flex justify-content-center">
//             <Sidebar visible={visible} onHide={() => setVisible(false)}>
//                 <h2>Sidebar</h2>
//                 <p>
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
//                     Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
//                 </p>
//             </Sidebar>
//             <Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
//         </div>
//     )
// }

// import React, { useState } from 'react';
// // import { FaAccessibility } from 'react-icons/fa';

// const AccessibilityComponent = () => {
//   const [toolbarVisible, setToolbarVisible] = useState(false);

//   const toggleToolbar = () => {
//     setToolbarVisible(!toolbarVisible);
//   };

//   return (
//     <div style={{ position: 'fixed', top: '10px', left: '10px', zIndex: '999' }}>
//       <button onClick={toggleToolbar} style={{ cursor: 'pointer' }} />
//       {toolbarVisible && (
//         <div className="accessibility-toolbar" style={{ marginTop: '10px' }}>
//           {/* Add your accessibility tools */}
//           <button>Increase Font Size</button>
//           <button>Change Contrast</button>
//           {/* Add more accessibility tools */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AccessibilityComponent;