
'use client';
import Image from "next/image";
import MenuItemTile from "./MenuItemTile";
import { useContext, useState } from "react";

import toast from "react-hot-toast";
import { UserProfile } from "../UserProfile/UserProfile";
import { CartContext } from "../Provider/AppContext";
import { useRouter } from "next/navigation";





export default function MenuItem({menuItem,addToCart}) {
 // const { addToCart,removeCartProduct} = useContext(CartContext);
  const { data } = UserProfile();
  //console.log(data, "data============menuItem page")
  const email = data?.email
  console.log(email, "email from menuItem")
  console.log(data,"data from menu item ==")
  const router = useRouter();
  const {
    image,name,description,basePrice,
    sizes, extraIngredientPrices,
  } = menuItem;
  const [
    selectedSize, setSelectedSize
  ] = useState(sizes?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  

  async function handleAddToCartButtonClick() {
 
    if (!email) {
      toast.error("Please Login first")
      setTimeout(() => {
      router.push("/login")
      }, 1000);
      return
    }
    if (data?.admin) {
      toast.error("Admins are not allowed to add items to the cart")
      return
    }
    const hasOptions = sizes.length > 0 || extraIngredientPrices.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
     //console.log(menuItem, "menuItem from handleAddToCartButtonClick===========");
    //console.log(selectedSize, selectedExtras,"selectedSize, selectedExtras from handleAddToCartButtonClick");
    //console.log(email, "email from handleAddToCartButtonClick")
    addToCart(menuItem, selectedSize, selectedExtras,email);
    toast.success("adding to the cart")
    await new Promise(resolve => setTimeout(resolve, 1000));
    //console.log('hiding popup');
    setShowPopup(false);
  }
  function handleExtraThingClick(ev, extraThing) {
    const checked = ev.target.checked;
    if (checked) {
      setSelectedExtras(prev => [...prev, extraThing]);
    } else {
      setSelectedExtras(prev => {
        return prev.filter(e => e.name !== extraThing.name);
      });
    }
  }

  let selectedPrice = basePrice;
  if (selectedSize) {
    selectedPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
    }
  }

  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div
            onClick={ev => ev.stopPropagation()}
            className="my-8 bg-white p-2 rounded-lg max-w-md">
            <div
              className="overflow-y-scroll p-2"
              style={{maxHeight:'calc(100vh - 100px)'}}>
              <Image
                src={image}
                alt={name}
                width={300} height={200}
                className="mx-auto" />
              <h2 className="text-lg font-bold text-center mb-2">{name}</h2>
              <p className="text-center text-gray-500 text-sm mb-2">
                {description}
              </p>
              {sizes?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-gray-700">Pick your size</h3>
                  {sizes.map(size => (
                    <label
                      key={size._id}
                      className="flex items-center gap-2 p-4 border rounded-md mb-1">
                      <input
                        type="radio"
                        onChange={() => setSelectedSize(size)}
                        checked={selectedSize?.name === size.name}
                        name="size"/>
                      {size.name} :- {basePrice + size.price}/-
                    </label>
                  ))}
                </div>
              )}
              {extraIngredientPrices?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-gray-700">Any extras?</h3>
                  {extraIngredientPrices.map(extraThing => (
                    <label
                      key={extraThing._id}
                      className="flex items-center gap-2 p-4 border rounded-md mb-1">
                      <input
                        type="checkbox"
                        onChange={ev => handleExtraThingClick(ev, extraThing)}
                        checked={selectedExtras.map(e => e._id).includes(extraThing._id)}
                        name={extraThing.name} />
                      {extraThing.name} :- {extraThing.price}/-
                    </label>
                  ))}
                </div>
              )}
             
           
              
              <button
                className="mt-2 bg-red-500 text-white"
                onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <MenuItemTile
        onAddToCart={handleAddToCartButtonClick}
        {...menuItem} />
    </>
  );
}