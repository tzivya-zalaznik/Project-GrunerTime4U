import React from 'react';
import { useState, useEffect } from 'react';

const images = [
  "a.jpg",
  "b.jpg",
  "c.jpg",
  "d.jpg",
  "e.jpg",
  ];

const Home=()=>{
    const [index, setIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex(prevIndex => (prevIndex + 1) % images.length);
      }, 5000);
  
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