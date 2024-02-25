import React from 'react'
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import './starRating.css';

const HalfStar = ({ className, color, size, rating }) => {
    const halfs = (Math.round((rating - Math.floor(rating))*100));
  
    return (
      <div className="half-star-wrapper">
                <AiFillStar className={className} color="#e4e5e9" size={size} />
            <div className="half-star-overlay" style={{ width: `${halfs}%` }}>
            <AiFillStar className={className} color={color} size={size} />
            </div>
        </div>
    )
}

export default HalfStar