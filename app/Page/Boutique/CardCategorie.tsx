"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
interface Category {
  id: string;
  title: string;
  imageUrl: {
    Default: {
      urlDefault: string;
    };
  };
}



const CardCategorie = () => {
  const [categories, setCategories] = useState<Record<string, Category>>({});
const  router =useRouter()

  const idOfShop=localStorage.getItem("idOfShop")
  const getCategorie = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/backend/restaurant/${idOfShop}/categories`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error("Failed to fetch Categories");
      }
    } catch (error) {
      console.error("Error fetching Categories:", error);
    }
  };
  useEffect(() => {

    getCategorie();

}, [ ]);
const handleValidateClick = (idCategorie:string) => {
  localStorage.setItem("idCategorie",idCategorie)
router.push("/Page/ListProduit");
};
  return (
    <div className="shop container">
      <div className="row row-cols-1 row-cols-md-4">
        {Object.keys(categories).map((key:any) => (
          <div className="col-sm my-3" key={key}>
            <div className="shop-content" style={{ width: '18rem' }}    >
             <div className="product-box" onClick={()=>handleValidateClick(key)} >
              <h5 className="card-title" style={{ textAlign: "center" }}>{categories[key]?.title}</h5>
                <img  className="product-img" src={categories[key]?.imageUrl.Default.urlDefault ? categories[key].imageUrl.Default.urlDefault : "https://www.commande-pizzatime.fr/CESARWEB_WEB/repimage/83bbc4350c114000b0e2d6c4ff204215/3/web/Famille122.webp"} alt="Card image cap"  />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
};
export default CardCategorie
