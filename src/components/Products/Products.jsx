import React, { useEffect, useState } from "react";
import ProductItem from "../Products/ProductItem";
import "./Products.css";
import { Link } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import AddProductForm from "../AddProductForm";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortingMethod, setSortingMethod] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [city, setCity] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://lotusproject.azurewebsites.net/api/filter/ProductFilterAndGetAllProducts?PageSize=150"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log("Products data:", data);

        if (data.productDtos && Array.isArray(data.productDtos)) {
          const formattedData = data.productDtos.map((product) => ({
            productId: product.id,
            productTitle: product.productName,
            productPrice: product.price,
            productCategoryId: product.categoryId,
            productDate: product.productTime,
            productImage:
              product.productImages.length > 0
                ? product.productImages[0].imageUrl
                : "",
            productLocation: product.productLocation,
          }));
          setProducts(formattedData);
          setFilteredProducts(formattedData);
        } else {
          console.error("Expected an array but got:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://lotusproject.azurewebsites.net/api/productCategories"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log("Categories data:", data);

        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const getCategoryName = (id) => {
    const category = categories.find(
      (category) => category.productCategoryId === id
    );
    return category ? category.productCategoryName : "Unknown";
  };

  const handleSearchAndFilter = async () => {
    let filteredData = products;

    if (searchTerm.trim()) {
      try {
        const response = await fetch(
          `https://lotusproject.azurewebsites.net/api/search/productSearch?productName=${searchTerm}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log("Search data:", data);

        if (Array.isArray(data)) {
          filteredData = data.map((product) => ({
            productId: product.id,
            productTitle: product.productName,
            productPrice: product.price,
            productCategoryId: product.categoryId,
            productDate: product.productTime,
            productImage:
              product.productImages.length > 0
                ? product.productImages[0].imageUrl
                : "",
            productLocation: product.productLocation,
          }));
        } else {
          console.error("Expected an array but got:", data);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        return;
      }
    }

    filteredData = filteredData.filter((product) => {
      return (
        filter === "All" ||
        getCategoryName(product.productCategoryId) === filter
      );
    });

    if (minPrice) {
      filteredData = filteredData.filter(
        (product) => product.productPrice >= parseFloat(minPrice)
      );
    }
    if (maxPrice) {
      filteredData = filteredData.filter(
        (product) => product.productPrice <= parseFloat(maxPrice)
      );
    }

    if (city.trim()) {
      filteredData = filteredData.filter(
        (product) =>
          product.productLocation &&
          product.productLocation.toLowerCase().includes(city.toLowerCase())
      );
    }

    switch (sortingMethod) {
      case "Tarihe Göre Sırala (Yeni)":
        filteredData.sort(
          (a, b) => new Date(b.productDate) - new Date(a.productDate)
        );
        break;
      case "Tarihe Göre Sırala (Eski)":
        filteredData.sort(
          (a, b) => new Date(a.productDate) - new Date(b.productDate)
        );
        break;
      case "Fiyata Göre Sırala (Azalan)":
        filteredData.sort((a, b) => b.productPrice - a.productPrice);
        break;
      case "Fiyata Göre Sırala (Artan)":
        filteredData.sort((a, b) => a.productPrice - b.productPrice);
        break;
      default:
        break;
    }

    setFilteredProducts(filteredData);
  };

  const handleAddProduct = (newProduct) => {
    const formattedProduct = {
      productId: newProduct.id,
      productTitle: newProduct.productName,
      productPrice: newProduct.price,
      productCategoryId: newProduct.categoryId,
      productDate: newProduct.productTime,
      productImage:
        newProduct.productImages.length > 0
          ? newProduct.productImages[0].imageUrl
          : "",
      productLocation: newProduct.productLocation,
    };

    setProducts((prevProducts) => [...prevProducts, formattedProduct]);
    setFilteredProducts((prevProducts) => [...prevProducts, formattedProduct]);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="product-wrapper">
      <div className="products-header">
        <h1>Tüm Ürünler</h1>
        <br></br>
        <button className="add-product-button">
          Ürün Ekle<br></br>
          <IconButton onClick={handleOpen}>
            <Add />
          </IconButton>
        </button>

        <br />
        <div className="search-filter">
          <input
            type="text"
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">Tümü</option>
            {categories.map((category) => (
              <option
                key={category.productCategoryId}
                value={category.productCategoryName}
              >
                {category.productCategoryName}
              </option>
            ))}
          </select>
          <select
            value={sortingMethod}
            onChange={(e) => setSortingMethod(e.target.value)}
          >
            <option value="">Sırala</option>
            <option value="Tarihe Göre Sırala (Yeni)">
              Tarihe Göre Sırala (Yeni)
            </option>
            <option value="Tarihe Göre Sırala (Eski)">
              Tarihe Göre Sırala (Eski)
            </option>
            <option value="Fiyata Göre Sırala (Azalan)">
              Fiyata Göre Sırala (Azalan)
            </option>
            <option value="Fiyata Göre Sırala (Artan)">
              Fiyata Göre Sırala (Artan)
            </option>
          </select>

          <input
            type="number"
            placeholder="Min Fiyat"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Fiyat"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Şehir"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            className="product-filter-button"
            onClick={handleSearchAndFilter}
          >
            OK
          </button>
        </div>
      </div>
      <br />
      <div className="products">
        {filteredProducts.map((product) => (
          <Link
            key={product.productId}
            to={`/products/${product.productId}`}
            style={{ textDecoration: "none", color: "black" }}
            className="product-link"
          >
            <ProductItem product={product} />
          </Link>
        ))}
      </div>
      <AddProductForm
        open={open}
        handleClose={handleClose}
        handleAddProduct={handleAddProduct}
      />
    </div>
  );
}

export default Products;
