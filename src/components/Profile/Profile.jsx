import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import {
  Box,
  Button,
  TextField,
  Avatar,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout, setUser } = useContext(UserContext);
  const userId = user?.id;
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [products, setProducts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (userId) {
      fetch(`https://lotusproject.azurewebsites.net/api/user/${userId}`)
        .then((response) => response.json())
        .then((data) => setUserData(data))
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [userId]);

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdatedData({
      userName: userData.userName,
      surname: userData.surname,
      email: userData.email,
      pregnancyStatus: userData.pregnancyStatus,
      image: userData.image,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUpdatedData((prevState) => ({
        ...prevState,
        image: reader.result,
      }));
      setUploading(false);
    };
    if (file) {
      setUploading(true);
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSave = () => {
    fetch(`https://lotusproject.azurewebsites.net/api/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setUserData(data);
        setIsEditing(false);
      })
      .catch((error) => console.error("Error updating user data:", error));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "Ürünlerim":
        fetchProducts();
        break;
      case "Randevularım":
        fetchAppointments();
        break;
      case "Sorularım":
        fetchQuestions();
        break;
      default:
        break;
    }
  };

  const fetchProducts = () => {
    fetch(`https://lotusproject.azurewebsites.net/api/user/${userId}/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  };

  const fetchAppointments = () => {
    fetch(
      `https://lotusproject.azurewebsites.net/api/appointments/user/${userId}`
    )
      .then((response) => response.json())
      .then((data) => setAppointments(data.appointments))
      .catch((error) => console.error("Error fetching appointments:", error));
  };

  const fetchQuestions = () => {
    fetch(
      `https://lotusproject.azurewebsites.net/api/forumQuestions/GetAllQuestions`
    )
      .then((response) => response.json())
      .then((data) => {
        const userQuestions = data.filter(
          (question) => question.userId === userId
        );
        setQuestions(userQuestions);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  };

  const handleDeleteProduct = async (productId) => {
    console.log("Deleting product with ID:", productId);

    try {
      const response = await fetch(
        `https://lotusproject.azurewebsites.net/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete product: ${errorText}`);
      }

      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    console.log("Deleting appointment with ID:", appointmentId);

    try {
      const response = await fetch(
        `https://lotusproject.azurewebsites.net/api/appointments/${appointmentId}/cancelAppointment`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete appointment: ${errorText}`);
      }

      setAppointments(
        appointments.filter(
          (appointment) => appointment.appointmentId !== appointmentId
        )
      );
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    console.log("Deleting question with ID:", questionId);

    try {
      const response = await fetch(
        `https://lotusproject.azurewebsites.net/api/forumQuestions/${questionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete question: ${errorText}`);
      }

      setQuestions(
        questions.filter((question) => question.questionId !== questionId)
      );
    } catch (error) {
      console.error("Error deleting question:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChangePassword = () => {
    navigate("/codemail");
  };

  if (!userData) {
    return <CircularProgress />;
  }

  return (
    <Box
      sx={{ display: "flex", maxWidth: "1200px", margin: "0 auto", padding: 2 }}
    >
      <Box sx={{ flex: 1, paddingRight: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Avatar
            sx={{ width: 100, height: 100 }}
            src={userData.image || "https://via.placeholder.com/100"}
          />
        </Box>
        <TextField
          label="Ad"
          name="userName"
          value={isEditing ? updatedData.userName : userData.userName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          disabled={!isEditing}
        />
        <TextField
          label="Soyad"
          name="surname"
          value={isEditing ? updatedData.surname : userData.surname}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          disabled={!isEditing}
        />
        <TextField
          label="Email"
          name="email"
          value={isEditing ? updatedData.email : userData.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          disabled={!isEditing}
        />
        <TextField
          label="Hamilelik Durumu (Hafta)"
          name="pregnancyStatus"
          value={
            isEditing ? updatedData.pregnancyStatus : userData.pregnancyStatus
          }
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          disabled={!isEditing}
        />
        {isEditing && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {uploading ? (
                <CircularProgress />
              ) : (
                <Avatar
                  sx={{ width: 100, height: 100, cursor: "pointer" }}
                  src={updatedData.image || "https://via.placeholder.com/100"}
                >
                  <img
                    src="https://via.placeholder.com/100"
                    alt="Upload"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </Avatar>
              )}
            </div>
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          {isEditing ? (
            <>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Kaydet
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setIsEditing(false)}
              >
                Kapat
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditClick}
              >
                Düzenle
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "green", color: "white" }}
                onClick={handleChangePassword}
              >
                Şifremi Değiştir
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
              >
                Çıkış Yap
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Divider orientation="vertical" flexItem />

      <Box sx={{ flex: 2, paddingLeft: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Button onClick={() => handleTabClick("Ürünlerim")}>Ürünlerim</Button>
          <Button onClick={() => handleTabClick("Randevularım")}>
            Randevularım
          </Button>
          <Button onClick={() => handleTabClick("Sorularım")}>Sorularım</Button>
        </Box>

        {activeTab === "Ürünlerim" && (
          <List>
            {products.map((product, index) => (
              <Box
                key={index}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  p: 2,
                  mb: 2,
                  position: "relative",
                }}
              >
                <ListItem>
                  <ListItemText
                    primary={product.productName}
                    secondary={
                      <img
                        src={
                          product.productImages[0]?.imageUrl ||
                          "https://via.placeholder.com/50"
                        }
                        alt={product.productName}
                        width="50"
                      />
                    }
                  />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteProduct(product.id)}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    Sil
                  </Button>
                </ListItem>
              </Box>
            ))}
          </List>
        )}

        {activeTab === "Randevularım" && (
          <List>
            {appointments.map((appointment, index) => (
              <Box
                key={index}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  p: 2,
                  mb: 2,
                  position: "relative",
                }}
              >
                <ListItem>
                  <ListItemText
                    primary={`Dr. ${appointment.doctorName}`}
                    secondary={`Start Time: ${appointment.startTime}`}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      handleDeleteAppointment(appointment.appointmentId)
                    }
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    Iptal Et
                  </Button>
                </ListItem>
              </Box>
            ))}
          </List>
        )}

        {activeTab === "Sorularım" && (
          <List>
            {questions.map((question, index) => (
              <Box
                key={index}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  p: 2,
                  mb: 2,
                  position: "relative",
                }}
              >
                <ListItem>
                  <ListItemText primary={question.question} />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteQuestion(question.questionId)}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  >
                    Sil
                  </Button>
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default Profile;
