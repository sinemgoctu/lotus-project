import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import "./AddProductForm.css";
import { UserContext } from "../contexts/UserContext";

const AddProductForm = ({ open, handleClose, handleAddProduct }) => {
  const { user } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    productName: "",
    productDefinition: "",
    ownerId: user ? user.id : "",
    price: "",
    categoryId: "",
    productLocation: "",
    productImages: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://lotusproject.azurewebsites.net/api/productCategories"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setProductData((prevState) => ({
      ...prevState,
      productImages: [...prevState.productImages, ...newImages],
    }));

    setImagePreviews((prevState) => [
      ...prevState,
      ...newImages.map((file) => file.preview),
    ]);
  };

  const handleSubmit = async () => {
    const productDataWithOwnerId = { ...productData, ownerId: user.id };

    try {
      const response = await fetch(
        "https://lotusproject.azurewebsites.net/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...productDataWithOwnerId,
            productImages: [],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add product: ${errorText}`);
      }

      const newProduct = await response.json();
      console.log("New product response:", newProduct);

      if (!newProduct || !newProduct.id) {
        throw new Error("Product ID is missing in the response");
      }

      const productId = newProduct.id;

      const uploadedImages = [];
      for (const image of productDataWithOwnerId.productImages) {
        console.log("Uploading image for product ID:", productId);
        const formData = new FormData();
        formData.append("file", image);
        console.log("FormData content before upload:");
        formData.forEach((value, key) => {
          console.log(key, value);
        });

        const imageUploadResponse = await fetch(
          `https://lotusproject.azurewebsites.net/api/productPictures/${productId}/images`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!imageUploadResponse.ok) {
          const errorText = await imageUploadResponse.text();
          throw new Error(`Image upload failed: ${errorText}`);
        }

        const imageResult = await imageUploadResponse.json();
        console.log("Image upload response:", imageResult);
        uploadedImages.push(imageResult.imageUrl);
      }

      handleAddProduct({ ...newProduct, productImages: uploadedImages });

      window.location.reload();
    } catch (error) {
      console.error("Error adding product:", error);
      alert(`Error: ${error.message}`);
    }

    handleClose();
  };

  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
  } = useDropzone({
    onDrop: handleImageChange,
    accept: "image/*",
    multiple: true,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Yeni Ürün Ekle</DialogTitle>
      <div className="input-boxes">
        <DialogContent className="dialog-content">
          <TextField
            className="input-product-name"
            name="productName"
            label="Ürün Başlığı"
            fullWidth
            value={productData.productName}
            onChange={handleInputChange}
          />
          <TextField
            className="input-product-definition"
            name="productDefinition"
            label="Ürün Tanımı"
            fullWidth
            value={productData.productDefinition}
            onChange={handleInputChange}
          />
          <TextField
            className="input-product-price"
            name="price"
            label="Fiyat"
            type="number"
            fullWidth
            value={productData.price}
            onChange={handleInputChange}
          />
          <FormControl fullWidth className="input-product-category">
            <InputLabel>Kategori</InputLabel>
            <Select
              name="categoryId"
              value={productData.categoryId}
              onChange={handleInputChange}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category.productCategoryId}
                  value={category.productCategoryId}
                >
                  {category.productCategoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            className="input-product-location"
            name="productLocation"
            label="Adres"
            fullWidth
            value={productData.productLocation}
            onChange={handleInputChange}
          />
          <div
            {...getRootProps({ className: "dropzone" })}
            style={{
              border: "2px dashed #ccc",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <input {...getInputProps()} />
            <p>Dosyaları buraya sürükleyin ya da seçmek için butona tıklayın</p>
            <Button
              variant="contained"
              color="primary"
              onClick={openFileDialog}
            >
              Yükle
            </Button>
          </div>
          <div className="image-previews">
            {imagePreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt="Preview"
                style={{ width: "100px", margin: "10px" }}
              />
            ))}
          </div>
        </DialogContent>
      </div>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductForm;
