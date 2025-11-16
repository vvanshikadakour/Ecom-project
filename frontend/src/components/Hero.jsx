import React from 'react'
import hero from "../assets/hero.png"
import "../stylesheets/Hero.css"
import { IoIosArrowRoundForward } from "react-icons/io";
export default function Hero() {
  return (
    <div className='hero-section'>
        <div className="hero-left">
            <h3>NEW ARRIVALS</h3>
            <h1>NEW COLLECTIONS</h1>
            <button>visit <span>
                <IoIosArrowRoundForward />
                </span></button>
        </div>
        <div className="hero-right">
<img src={hero} alt="" />
        </div>
    </div>
  )
}
