"use client";
import store, { addToCart } from "@/app/components/store";
import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import ModalCategorie from "../Modal/Modal";
import 'tailwindcss/tailwind.css';
import { FaTrashAlt } from 'react-icons/fa';

function Painner() {
  const [showModal, setShowModal] = useState(false);
  const panierSnapshot = useSnapshot(store);
  const Panier = panierSnapshot.Panier;
  const [isOpen, SetIsOpen] = useState(false);
  const [Somme, SetSomme] = useState(0);
  const [quantity, SetQuantity] = useState(0);

  const handleCommandeClick = () => {
    setShowModal(true);
  };

  const increaseQuantity = (itemId: number) => {
    let copPanier = [...Panier];
    let itemIndex = copPanier.findIndex(item => item.uiiditem === itemId);
    if (itemIndex !== -1) {
      let mutableItem = { ...copPanier[itemIndex] };
      mutableItem.qte += 1;
      mutableItem.prix = (mutableItem.qte * parseFloat(mutableItem.prixuniter)).toFixed(2);
      copPanier[itemIndex] = mutableItem;
    }
    addToCart(copPanier);
  };

  const decreaseQuantity = (itemId: number) => {
    let copPanier = [...Panier];
    let itemIndex = copPanier.findIndex(item => item.uiiditem === itemId);
    if (itemIndex !== -1) {
      let mutableItem = { ...copPanier[itemIndex] };
      mutableItem.qte -= 1;
      if (mutableItem.qte > 0) {
        mutableItem.prix = (mutableItem.qte * parseFloat(mutableItem.prixuniter)).toFixed(2);
        copPanier[itemIndex] = mutableItem;
      } else {
        copPanier.splice(itemIndex, 1);
      }
    }
    addToCart(copPanier);
  };

  const removeItem = (itemId: number) => {
    let copPanier = [...Panier];
    copPanier = copPanier.filter(p => p.uiiditem !== itemId);
    addToCart(copPanier);
  };

  useEffect(() => {
    let s = 0;
    let q = 0;
    for (let item of Panier) {
      s += parseFloat(item.prix);
      q += item.qte;
    }
    SetSomme(s);
    SetQuantity(q);
  }, [Panier]);

  return (
    <>
   {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20" onClick={() => SetIsOpen(false)}>
          <div className="fixed right-0 top-0 bg-white w-80 h-full shadow-lg p-4 z-30" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-2">
              <h5 className="text-xl font-bold">Panier</h5>
              <button
                className="text-gray-500"
                onClick={() => SetIsOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              {Panier.length === 0 ? (
                <div className="text-center text-gray-500">Votre panier est vide</div>
              ) : (
                <div className="space-y-4">
                  {Panier.map((item, index) => (
                    <div className="flex items-center space-x-4" key={index}>
                      <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover" />
                      <div className="flex-grow">
                        <h5 className="text-lg font-bold">{item.title}</h5>
                        <p className="text-sm text-gray-500">{item.prix} €</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="px-2 py-1 bg-gray-200 text-gray-600 rounded"
                          onClick={() => decreaseQuantity(item.uiiditem)}
                        >
                          -
                        </button>
                        <span>{item.qte}</span>
                        <button
                          className="px-2 py-1 bg-gray-200 text-gray-600 rounded"
                          onClick={() => increaseQuantity(item.uiiditem)}
                        >
                          +
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => removeItem(item.uiiditem)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>{Somme.toFixed(2)} €</span>
              </div>
              <button
                className={`w-full mt-4 py-2 rounded ${Somme === 0 ? 'bg-gray-400' : 'bg-blue-600 text-white'}`}
                disabled={Somme === 0}
                onClick={handleCommandeClick}
              >
                Commander
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <ModalCategorie showModal={showModal} setShowModal={setShowModal} />
      )}
    </>
  );
}

export default Painner;
