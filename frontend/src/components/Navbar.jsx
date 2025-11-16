import { TiShoppingCart } from "react-icons/ti";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import "../stylesheets/Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();
 let status = useSelector(state=>state.isProductAdd)

  const [userName, setUserName] = useState("");
const [cartt, setCart]= useState(0)
  useEffect(() => {
    console.log(status);
    
    // Backend se login check aur user info fetch
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/user/getProfile", {
          method: "GET",
          credentials: "include", // cookies ke liye
        });
        const data = await res.json();
        console.log(data);
        
        setCart(data.user.Cartvalue)
        if (res.ok && data.user) {
          const name = data.user.firstName + " " + data.user.lastName;
setUserName(name)
          dispatch({
            type: "set-user",
            payload: {
              id: data.user._id,
              name,
              email: data.user.email,
            },
          });

          dispatch({
            type:"productAdd",
            payload:{
              isAdding: false
            }
          })
        } else {
          setUserName("");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUserName("");
      }
    };

    fetchUser();
  }, [ status]);

  return (
    <div className='navbar-container'>
      <div className="left"><p>Shop Here</p></div>
      <div className="center">
        <Link to="/shop"><button className={location.pathname==="/shop"?"active":""}>Shop</button></Link>
        <Link to="/shop/men"><button className={location.pathname==="/shop/men"?"active":""}>Men</button></Link>
        <Link to="/shop/women"><button className={location.pathname==="/shop/women"?"active":""}>Women</button></Link>
        <Link to="/shop/kids"><button className={location.pathname==="/shop/kids"?"active":""}>Kids</button></Link>
      </div>
      <div className="right">
        <Link to="/cart">
          <button className={location.pathname==="/cart"?"active":""}>
            <TiShoppingCart /><sup>
              {
                userName== "" ? 0 :
                cartt

              }
              
              </sup>
          </button>
        </Link>
        <Link to="/profile">
          <button className={location.pathname==="/profile"?"active":""}>
            <CgProfile /> {userName ? `Hi, ${userName}` : ""}
          </button>
        </Link>
      </div>
    </div>
  );
}
