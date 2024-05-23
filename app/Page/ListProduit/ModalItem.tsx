import store, { addToCart } from "@/app/components/store";
import React, { useState, useEffect } from "react";
import { Button, Modal, Alert } from "react-bootstrap";
import { useSnapshot } from "valtio";

function ModalItem({ modal, setModal, Item }: any) {
  const { Panier } = useSnapshot(store);
  const [Somme, SetSomme] = useState(Number(Item.price.priceHT) ?? 0);
  const [checkedCompositions, setCheckedCompositions] = useState<{ [key: string]: boolean }>({});
  const [supplementQuantities, setSupplementQuantities] = useState<{ [key: string]: number }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the checked state for compositions
    const initialCheckedState: { [key: string]: boolean } = {};
    if (Item?.basicComposition) {
      Object.entries(Item.basicComposition).forEach(([key]) => {
        initialCheckedState[key] = true; // Checked by default
      });
    }
    setCheckedCompositions(initialCheckedState);

    // Initialize the supplement quantities
    const initialSupplementQuantities: { [key: string]: number } = {};
    if (card?.supplements) {
      Object.keys(card.supplements).forEach((key) => {
        initialSupplementQuantities[key] = 0; // Initialize all quantities to 0
      });
    }
    setSupplementQuantities(initialSupplementQuantities);
  }, [Item]);

  const toggle = () => setModal(!modal);

  const handleCheckboxChange = (key: string) => {
    setCheckedCompositions({
      ...checkedCompositions,
      [key]: !checkedCompositions[key],
    });
  };

  const onClickAdd = () => {
    let copPanier: any = [...Panier];
    let prix = Item?.price?.priceHT || 0;
    const existingItemIndex = copPanier.findIndex((item: any) => item.uiiditem === Item.id);

    if (existingItemIndex !== -1) {
      copPanier[existingItemIndex] = {
        ...copPanier[existingItemIndex],
        qte: copPanier[existingItemIndex].qte + 1,
        prix: parseFloat(((copPanier[existingItemIndex].qte + 1) * copPanier[existingItemIndex].prixuniter).toFixed(2)),
      };
    } else {
      copPanier.push({
        uiiditem: Item.id,
        title: Item.title,
        qte: 1,
        prixuniter: prix,
        prix: Somme,
      });
    }

    addToCart(copPanier);
    toggle();
  };

  const addSupplementToTotal = (key: string, price: number) => {
    const availableQuantity = card.supplements[key].quantity;
    if (supplementQuantities[key] < availableQuantity) {
      setSupplementQuantities({
        ...supplementQuantities,
        [key]: supplementQuantities[key] + 1,
      });
      SetSomme(Somme + price);
      setErrorMessage(null);
    } else {
      setErrorMessage(`Tu ne peux pas ajouter plus que la quantité disponible (${availableQuantity}) pour ${card.supplements[key].title}`);
    }
  };

  const removeSupplement = (key: string, price: number) => {
    if (supplementQuantities[key] > 0) {
      const newQuantity = supplementQuantities[key] - 1;
      setSupplementQuantities({
        ...supplementQuantities,
        [key]: newQuantity,
      });

      const newTotal = Somme - price;
      const updatedTotal = newTotal < Item.price.priceHT ? Item.price.priceHT : newTotal;
      SetSomme(updatedTotal);
      setErrorMessage(null);
    }
  };

  const imageUrl =
    Item.imageUrl.Default.urlDefault ||
    "https://www.commande-pizzatime.fr/CESARWEB_WEB/repimage/83bbc4350c114000b0e2d6c4ff204215/3/web/Famille122.webp";

  const cat: any = localStorage.getItem("card");
  let card = JSON.parse(cat || null);

  return (
    <Modal show={modal} onHide={toggle}>
      <Modal.Header closeButton>
        <Modal.Title>{Item.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <img className="card-img-top" src={imageUrl} alt="Card image cap" />
        <h5>Composition de base :</h5>
        <div className="row">
          {Item?.basicComposition &&
            Object.entries(Item.basicComposition).map(([key, value]: any) => (
              <div className="col-md-4 my-2" key={key}>
                <label className="checkbox-custom">
                  <div className="d-flex">
                    <input
                      type="checkbox"
                      style={{
                        border: "1px solid",
                        width: "25px",
                        height: "25px",
                        borderColor: "#5d5d5d",
                        borderRadius: "0",
                      }}
                      name={value?.title}
                      value={value?.title}
                      checked={checkedCompositions[key]}
                      onChange={() => handleCheckboxChange(key)}
                    />
                    <h6 style={{ marginLeft: "25px" }}>
                      {value?.title || ""}
                    </h6>
                  </div>
                  <span className="checkmark"></span>
                </label>
              </div>
            ))}
        </div>
        <div className="text-left text-lg">
          <p>PIZZA SUPPLEMENTS</p>
          <div className="gap-2">
            {Object.keys(card?.supplements).map((key: any) => (
              <div
                key={key}
                className="row mx-1 py-2 my-2 rounded border "
                style={{
                  borderColor: "#5d5d5d",
                  border: "1px solid couleurcadre",
                }}
              >
                <div className="d-flex justify-content-between align-items-center col pl-1 pr-0">
                  <div className="d-flex align-content-center align-items-center">
                    <div data-toggle="buttons">
                      <label className="btn d-flex justify-content-center align-items-center "></label>
                    </div>
                    {card?.supplements[key]?.title} 
                  </div>
                  <div className="d-flex align-items-center float-right">
                    <div
                      className="d-flex align-content-center align-items-center float-left position-absolute mr-5"
                      style={{ right: "50px" }}
                    >
                      <Button
                        className="bg-gray-700 border border-gray-900 w-25 h-25"
                        onClick={() => addSupplementToTotal(key, card?.supplements[key]?.price)}
                      >
                        +
                      </Button>
                      {supplementQuantities[key]}
                      <Button
                        className="bg-gray-700 border border-gray-900 w-25 h-25"
                        onClick={() => removeSupplement(key, card?.supplements[key]?.price)}
                      >
                        −
                      </Button>
                    </div>
                    <div className="align-content-center float-right">
                      <p>{card?.supplements[key]?.price} €</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button>Total: {Somme.toFixed(2)} €</Button>
        <Button variant="primary" onClick={onClickAdd}>
          Ajouter Produit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalItem;
