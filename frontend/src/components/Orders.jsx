 import React, { useEffect } from 'react'
 
 export default function Orders() {
    useEffect( ()=>{
        async function getData(){

        
let res= await fetch("http://localhost:3000/order/getOrder")
let data = await res.json()
if(res.status=== 500){
    alert(data.message)
    return;
  
}
console.log("orders---------", data.orders);

        }
        getData()
    },[])

   return (
     <div>Orders</div>
   )
 }
 