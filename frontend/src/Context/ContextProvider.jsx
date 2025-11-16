 import React, { useEffect, useState } from 'react'
import Productcontext from './context'
 
 export default function ContextProvider({children}) {
   const [values, setValues]=  useState([])
  useEffect(() => {
  async function getData() {
    try {
      const res = await fetch("http://localhost:3000/products");

      if (res.status === 200) {   // status code check
        const data = await res.json();
        setValues(Array.isArray(data.products) ? data.products : []);
      } else {
        console.error("Failed to fetch products:", res.status);
        setValues([]);
      }
    } catch (error) {
      console.error("Network error:", error);
      setValues([]);
    }
  }

  getData();
}, []);

   return (

        <Productcontext.Provider value={{values,setValues}}>

            {children}
        </Productcontext.Provider>

   )
 }
 