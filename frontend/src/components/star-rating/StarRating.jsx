import React from 'react';
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import HalfStar from './HalfStar';


const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
        <div>
            {Array(fullStars).fill().map((_, i) => (
                <AiFillStar className="star" color="#ffc107" size={20} key={i} />
            ))}
            {Array(halfStars).fill().map((_, i) => (
                <HalfStar className="star" color="#ffc107" size={20} rating={rating} key={i + fullStars} />
            ))}
            {Array(emptyStars).fill().map((_, i) => (
                <AiOutlineStar className="star" color="#e4e5e9" size={20} key={i + fullStars + halfStars} />
            ))}
        </div>
    );
};

export default StarRating;