

import { UserProfile } from '../UserProfile/UserProfile';
import Link from 'next/link';
export default function AddToCartButton({
  hasSizesOrExtras, onClick, basePrice, image
}) {
  if (!hasSizesOrExtras) {
    return (
      <div className="flying-button-parent mt-4">
        
      </div>
    );
  }

  const { data } = UserProfile();
 // //console.log(data,"data")
  const userEmail = data?.email
  let cartText;
  if (basePrice <= 0) {
   cartText= <span>Add to cart </span>
  }
  else {
    cartText=  <span>Add to cart (price:- {basePrice}/-)</span>
  }

  
 
  return (
    
   
    <button
      type="button"
      onClick={onClick}
      className="mt-4 bg-emerald-500 text-white rounded-full px-8 py-2"
    >
      {cartText}
    </button>
  
  );
}