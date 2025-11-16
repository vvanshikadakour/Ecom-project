import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    isDefault: false,
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/cart/get", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.cart) dispatch({ type: "set-cart", payload: data.cart });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("http://localhost:3000/address/get", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.addresses) {
        setAddresses(data.addresses);
        const defaultAddr = data.addresses.find((addr) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading cart...</p>;

  async function updateQuantity(productId, action) {
    if (updating) return;
    setUpdating(true);

    try {
      const res = await fetch("http://localhost:3000/cart/update", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action }),
      });

      const data = await res.json();

      if (data.cart) {
        dispatch({ type: "set-cart", payload: data.cart });
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  }

  const handleSendOtp = async () => {
    if (!newAddress.phone || newAddress.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number!");
      return;
    }

    setSendingOtp(true);

    try {
      const res = await fetch("http://localhost:3000/otp/send", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: newAddress.phone }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
     
        const otpDisplay = data.devOtp || data.otp;
        alert(`✅ OTP Generated, Your OTP: ${otpDisplay} (For testing)`);
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP!");
      return;
    }

    setVerifyingOtp(true);

    try {
      const res = await fetch("http://localhost:3000/otp/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: newAddress.phone, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpVerified(true);
        alert("Phone number verified successfully!");
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleAddAddress = async () => {
    if (
      !newAddress.fullName ||
      !newAddress.phone ||
      !newAddress.addressLine1 ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.zipCode
    ) {
      alert("Please fill all required fields!");
      return;
    }

    if (!otpVerified) {
      alert("Please verify your phone number first!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/address/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Address added successfully!");
        setShowAddressForm(false);
        setNewAddress({
          fullName: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          zipCode: "",
          country: "India",
          isDefault: false,
        });
        await fetchAddresses();
      } else {
        alert(data.message || "Failed to add address");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
    finally{
      setOtpVerified(false)
    }
  };

  async function proceedToCheckout() {
    if (cart.products.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!selectedAddress) {
      alert("Please select a delivery address!");
      return;
    }

    navigate("/checkout",{state:{cart,selectedAddress}})
  

      const res = await fetch("http://localhost:3000/order/addOrder", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products,
          totalAmount: cart.totalPrice + cart.totalShipping,
          deliveryAddress: selectedAddress,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Order placed successfully! 🎉");
        dispatch({
          type: "set-cart",
          payload: { products: [], totalPrice: 0, totalShipping: 0 },
        });
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while placing order!");
    } finally {
      setLoading(false);
    }
  }
async function deleteAdd(id){
  try{
    const res=await fetch(`https://e-com-project-msn4.orender.com/address/delete/${id}`,{
      method:"DELETE",
      credentials:"include",
    })
    if (res.ok){
      alert("Item deleted successfully")

      window.location.reload();
    }else{
      alert("Failed to deleted")
    }
  }
}
  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>

      {/* Address Selection Section */}
      <div
        style={{
          marginBottom: "30px",
          padding: "15px",
          border: "2px solid #4CAF50",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>📍 Delivery Address</h3>

        {addresses.length > 0 ? (
          <div>
            <div style={{ marginBottom: "15px" }}>
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  onClick={() => setSelectedAddress(addr)}
                  style={{
                    padding: "10px",
                    margin: "8px 0",
                    border:
                      selectedAddress?._id === addr._id
                        ? "2px solid #4CAF50"
                        : "1px solid #ccc",
                    borderRadius: "6px",
                    cursor: "pointer",
                    backgroundColor:
                      selectedAddress?._id === addr._id ? "#e8f5e9" : "white",
                  }}
                >
                  <strong>{addr.fullName}</strong>{" "}
                  <button onClick={()=>deleteAdd(addr._id)}>delete address</button>
                  {addr.isDefault && (
                    <span style={{ color: "green", fontSize: "12px" }}>
                      (Default)
                    </span>
                  )}
                  <p style={{ margin: "5px 0" }}>{addr.phone}</p>
                  <p style={{ margin: "5px 0" }}>
                    {addr.addressLine1}
                    {addr.addressLine2 && `, ${addr.addressLine2}`}
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    {addr.city}, {addr.state} - {addr.zipCode}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {showAddressForm ? "Cancel" : "+ Add New Address"}
            </button>
          </div>
        ) : (
          <div>
            <p>No saved addresses. Please add a delivery address.</p>
            <button
              onClick={() => setShowAddressForm(true)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              + Add Address
            </button>
          </div>
        )}

        {/* Add Address Form */}
        {showAddressForm && (
          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              backgroundColor: "white",
            }}
          >
            <h4>Add New Address</h4>
            <div style={{ display: "grid", gap: "10px" }}>
              <input
                type="text"
                placeholder="Full Name *"
                value={newAddress.fullName}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, fullName: e.target.value })
                }
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <input
                  type="text"
                  placeholder="Phone Number * (10 digits)"
                  value={newAddress.phone}
                  onChange={(e) => {
                    setNewAddress({ ...newAddress, phone: e.target.value });
                    setOtpSent(false);
                    setOtpVerified(false);
                    setOtp("");
                  }}
                  disabled={otpVerified}
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    flex: 1,
                    backgroundColor: otpVerified ? "#e8f5e9" : "white",
                  }}
                />
                {!otpVerified && (
                  <button
                    onClick={handleSendOtp}
                    disabled={
                      sendingOtp ||
                      !newAddress.phone ||
                      newAddress.phone.length !== 10
                    }
                    style={{
                      padding: "8px 16px",
                      backgroundColor: otpSent ? "#FF9800" : "#2196F3",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {sendingOtp
                      ? "Sending..."
                      : otpSent
                      ? "Resend OTP"
                      : "Send OTP"}
                  </button>
                )}
                {otpVerified && (
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    ✓ Verified
                  </span>
                )}
              </div>

              {otpSent && !otpVerified && (
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP *"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      flex: 1,
                    }}
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp || !otp || otp.length !== 6}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {verifyingOtp ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              )}

              <input
                type="text"
                placeholder="Address Line 1 *"
                value={newAddress.addressLine1}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, addressLine1: e.target.value })
                }
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                placeholder="Address Line 2 (Optional)"
                value={newAddress.addressLine2}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, addressLine2: e.target.value })
                }
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  placeholder="City *"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  type="text"
                  placeholder="State *"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  placeholder="Zip Code *"
                  value={newAddress.zipCode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zipCode: e.target.value })
                  }
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <label
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      isDefault: e.target.checked,
                    })
                  }
                />
                Set as default address
              </label>
              <button
                onClick={handleAddAddress}
                style={{
                  padding: "10px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Save Address
              </button>
            </div>
          </div>
        )}
      </div>

      <h3>Cart Items</h3>
      {cart.products.length > 0 ? (
        cart.products.map((p, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #ccc",
              marginBottom: 10,
              padding: 10,
              borderRadius: 8,
            }}
          >
            <h3>{p.item.productName}</h3>
            <p>Price: ₹{p.price}</p>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* ✅ Increment Button */}
              <button
                disabled={updatingId === p.item._id || p.item.productCount <= 0}
                // 5
                //5 +
                onClick={async () => {
                  setUpdatingId(p.item._id);
                  await updateQuantity(p.item._id, "inc");
                  setUpdatingId(null);
                }}
              >
                +
              </button>

              <p>Qty: {p.qty}</p>

              <button
                disabled={updating}
                onClick={async () => {
                  if (p.qty === 1) {
                    const confirmRemove = window.confirm(
                      "This product will be removed completely. Are you sure?"
                    );
                    if (!confirmRemove) return; // user canceled
                  }
                  setUpdatingId(p.item._id);
                  await updateQuantity(p.item._id, "dec");
                  setUpdatingId(null);
                }}
              >
                -
              </button>

              <p>Available: {p.item.productCount}</p>
            </div>

            <p>Subtotal: ₹{p.price * (p.qty || 1)}</p>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}

      <div
        style={{
          marginTop: "20px",
          borderTop: "2px solid #ccc",
          paddingTop: "15px",
        }}
      >
        <h3>Total Price: ₹{cart.totalPrice}</h3>
        <h3>Total Shipping: ₹{cart.totalShipping}</h3>
        <h2>Grand Total: ₹{cart.totalPrice + cart.totalShipping}</h2>

        {cart.products.length > 0 && (
          <button
            onClick={proceedToCheckout}
            disabled={loading}
            style={{
              marginTop: "15px",
              padding: "12px 24px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Processing..." : "Proceed to Checkout 🛒"}
          </button>
        )}
      </div>
    </div>
  );
}
