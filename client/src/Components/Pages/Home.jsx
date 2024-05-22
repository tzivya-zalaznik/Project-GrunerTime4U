import React from 'react';
import { useState, useEffect } from 'react';
// import './App.css';

const images = [
  "a.jpg",
  "b.jpg",
  "c.jpg",
  "d.jpg",
  "e.jpg",
//   "36.jpg",
//   "41.jpg",
//   "48.jpg",
//   "49.jpg",
//   "56.jpg",
//   "57.jpg"
  ];

const Home=()=>{
    const [index, setIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex(prevIndex => (prevIndex + 1) % images.length);
      }, 5000); // Change image every 5 seconds
  
      return () => clearInterval(interval);
    }, []);

    return (
        <div className="app" style={{ backgroundImage: `url(${images[index]})` }}>
        <div className="content">
        </div>
      </div>
      );     

}

export default Home;