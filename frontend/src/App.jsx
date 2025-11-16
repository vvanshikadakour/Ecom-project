import React from "react";
import { Route, Routes } from "react-router-dom";
import './App.css'
import Navbar from './components/Navbar.jsx'

import Profile from './components/Profile.jsx'
import Shop from './components/Shop.jsx'
import AdminPanel from "./components/AdminPanel";
import ContextProvider from "./Context/ContextProvider.jsx";
import ShopCtaegory from "./components/ShopCtaegory.jsx";
import Cart from "./components/Cart.jsx";
import Orders from "./components/Orders.jsx";




export default function App(){
    return (
        <>
        <Navbar/>
             <ContextProvider>
        <Routes>
            <Route path="/" element={<Shop/>}/>
         
            <Route path="/Shop" element={<Shop/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/admin" element={<AdminPanel/>}/>
       <Route path="/cart" element={<Cart/>}/>
       <Route path="/checkout" element={<Checkout/>}/>
  <Route path="/orders" element={<Orders/>}/>
      <Route path="/shop/:category" element={<ShopCtaegory/>}/>
           
        </Routes>
         </ContextProvider>
        </>
    )

}