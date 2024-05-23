"use client";

import React, { SyntheticEvent, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

type AjouterItemProps = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setUpdate: (update: boolean) => void;
  update: boolean;
};

type Composition = {
  id: string;
  title: string;
};

const AjouterItem: React.FC<AjouterItemProps> = ({ showModal, setShowModal, setUpdate, update }) => {
  const [image, setImage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [compositions, setCompositions] = useState<Composition[]>([]);

  const handleAddComposition = () => {
    const newComposition = {
      id: uuidv4(),
      title: "",
    };
    setCompositions([...compositions, newComposition]);
  };

  const handleCompositionChange = (id: string, newTitle: string) => {
    setCompositions(compositions.map(comp => (comp.id === id ? { ...comp, title: newTitle } : comp)));
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const id = uuidv4();
    const categorieID = localStorage.getItem("categorieID");
    const productId = localStorage.getItem("productId");

    if (!categorieID || !productId) {
      alert("Category or Product ID is missing");
      return;
    }

    const newItem = {
      id: [id],
      color: "#FFFFFF",
      price: {
        priceHT: price,
      },
      title: title,
      imageUrl: {
        Default: {
          urlDefault: image,
        },
      },
      basicComposition: compositions.map(comp => ({
        id: [comp.id],
        title: comp.title,
      })),
    };

    try {
      const response = await fetch(`http://localhost:8000/backend/restaurant/addItem/${productId}/${categorieID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card: { [id]: newItem } }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      setUpdate(!update);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUpdate(!update); // Trigger update to refresh categories
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title className="text-center">Ajouter Produit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Titre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Prix</Form.Label>
            <Form.Control
              type="text"
              placeholder="Prix"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <h3>Ajouter composition de base</h3>
          {compositions.map((composition, index) => (
            <Form.Group key={composition.id} className="mb-3">
              <Form.Label>Composition de base {index + 1}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Titre"
                value={composition.title}
                onChange={(e) => handleCompositionChange(composition.id, e.target.value)}
                required
              />
            </Form.Group>
          ))}
          <Button variant="secondary" onClick={handleAddComposition} className="mb-3">
            Ajouter une composition
          </Button>
          <Button variant="primary" type="submit">
            Ajouter
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AjouterItem;
