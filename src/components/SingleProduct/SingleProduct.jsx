import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SingleProduct.css";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ownerSurname, setOwnerSurname] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://lotusproject.azurewebsites.net/api/products/${id}`
        );
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);

        // Fetch the owner's surname using ownerId
        const ownerResponse = await fetch(
          `https://lotusproject.azurewebsites.net/api/user/${data.ownerId}`
        );
        if (!ownerResponse.ok) {
          throw new Error("Owner not found");
        }
        const ownerData = await ownerResponse.json();
        setOwnerSurname(ownerData.surname);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const formattedContent = product.productDefinition
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");

  const handleOwnerClick = () => {
    navigate(`/profilepage/${product.ownerId}`);
  };

  return (
    <div className="single-product-container">
      <div className="single-product-image-container">
        <Slider {...settings}>
          {product.productImages.map((image) => (
            <div key={image.id}>
              <img
                src={image.imageUrl}
                alt="product"
                className="single-product-image"
              />
            </div>
          ))}
        </Slider>
      </div>
      <br />
      <h1 className="single-product-title">{product.productName}</h1>
      <p className="single-product-meta">
        Satıcı:{" "}
        <span
          onClick={handleOwnerClick}
          style={{ cursor: "pointer", color: "black" }}
        >
          {product.ownerName} {ownerSurname}
        </span>
        <br />
      </p>
      <span>Açıklama: {formattedContent}</span>
      <br />
      <br></br>
      <span>Yer: {product.productLocation}</span>
      <br />
      <br></br>
      <span>Fiyat: {product.price} TL</span>
    </div>
  );
};

export default SingleProduct;
