import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Productcontext from "../Context/context";
import { useDispatch, useSelector } from "react-redux";

export default function ShopCategory() {
  const dispatch = useDispatch();
  const { category } = useParams();
  const { values } = useContext(Productcontext);

  const reduxUser = useSelector((state) => state.user);
  const [user, setUser] = useState(reduxUser);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:3000/user/getProfile", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser({
            id: data.user._id,
            name: data.user.firstName + " " + data.user.lastName,
            userName: data.user.userName,
          });
          dispatch({
            type: "set-user",
            payload: {
              id: data.user._id,
              name: data.user.firstName + " " + data.user.lastName,
              userName: data.user.userName,
            },
          });
        } else setUser(null);
      } catch (err) {
        console.error("Failed to check login:", err);
        setUser(null);
      }
    };
    checkLogin();
  }, []);

  const filteredProducts = values.filter(
    (product) => product.productCategory.toLowerCase() === category.toLowerCase()
  );


const addToCart = async (product) => {
  if (!user?.id) {
    alert("Please login to add items to the cart!");
    return;
  }


  if (product.productCount <= 0) {
    alert("This product is out of stock!");
    return;
  }

  const shippingCost = product.productPrice >= 1000 ? 0 : 50;

  try {
    const res = await fetch("http://localhost:3000/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userId: user.id,
        productId: product._id,
        price: product.productPrice,
        shipping: shippingCost,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
    
      alert(data.error || "Failed to add to cart!");
      return;
    }

 
    dispatch({
      type: "product-add",
      payload: {
        item: product,
        price: product.productPrice,
        shipping: shippingCost,
        userId: user.id,
      },
    });

    dispatch({
      type:"productAdd",
      payload:{
        isAdding:true
      }
    })

    alert("Item added to cart successfully!");
  } catch (err) {
    console.error(err);
    alert("Something went wrong while adding to cart!");
  }
};


  return (
    <div style={{ padding: "20px" }}>
      <h2>Shop for: {category}</h2>
      {filteredProducts.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>{p.productName}</h3>
              <p>Price: ₹{p.productPrice}</p>
              <p>{p.description}</p>
              {Array.isArray(p.productImage) &&
                p.productImage.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={p.productName}
                    style={{ width: "100%", marginBottom: "5px" }}
                  />
                ))}
              <button
                onClick={() => addToCart(p)}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found in this category.</p>
      )}
    </div>
  );
}
