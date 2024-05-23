import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdAdd } from "react-icons/io";

interface AjouterRestaurantProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setUpdate: (update: boolean) => void;
  update: boolean;
}

const restaurantSchema = Yup.object().shape({
  image: Yup.string().required("Image is required"),
  town: Yup.string().required("Town is required"),
  company: Yup.string().required("Company name is required"),
  country: Yup.string().required("Country is required"),
  address: Yup.string().required("Address is required"),
  latitude: Yup.number().required("Latitude is required"),
  longitude: Yup.number().required("Longitude is required"),
  openingTime: Yup.string().required("Opening time is required"),
  closingTime: Yup.string().required("Closing time is required"),
  postalCode: Yup.string().required("Postal code is required"),
  nature: Yup.string().required("Nature is required"),
});

const AjouterRestaurant: React.FC<AjouterRestaurantProps> = ({
  showModal,
  setShowModal,
  setUpdate,
  update,
}) => {
  const formik = useFormik({
    initialValues: {
      image: "",
      town: "",
      company: "",
      country: "",
      address: "",
      latitude: "",
      longitude: "",
      openingTime: "",
      closingTime: "",
      postalCode: "",
      nature: "",
    },
    validationSchema: restaurantSchema,
    onSubmit: async (values) => {
      setShowModal(false);

      let shopId: any = localStorage.getItem("shopLength");

      await fetch("http://localhost:8000/backend/restaurant/addresto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resto: {
            ...values,
            shopid: Number(shopId),
            Responsible: "",
          },
          card: {
            etat: "En attente",
            color: "#FFFFF",
            items: {},
            workflow: {},
            categories: {},
            supplements: {
              "08406871-3262-4dfe-9fee-1309a499fc01": {
                title: "AIL",
                quantity: 10,
                price: 3.0,
              },
              "08406871-3262-4dfe-9fee-1309a499fc02": {
                title: "ANCHOIS",
                quantity: 10,
                price: 1.0,
              },
              "08406871-3262-4dfe-9fee-1309a499fc03": {
                title: "ARTICHAUTS",
                quantity: 10,
                price: 1.0,
              },
            },
          },
        }),
      });
      setUpdate(!update);
      shopId = Number(shopId) + 1;
      localStorage.setItem("shopLength", shopId);
    },
  });

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title className="text-center">Ajouter restaurant</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Form onSubmit={formik.handleSubmit}>
          {Object.keys(formik.values).map((key) => (
            <Form.Group className="mb-3" controlId={key} key={key}>
              <Form.Label>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Form.Label>
              <Form.Control
                type={key.includes("Time") ? "time" : "text"}
                placeholder={`Enter ${key}`}
                onChange={formik.handleChange}
                value={formik.values[key as keyof typeof formik.values]}
                isInvalid={!!formik.errors[key as keyof typeof formik.values]}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors[key as keyof typeof formik.values]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}
          <Button variant="primary" type="submit">
            <IoMdAdd />
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AjouterRestaurant;
