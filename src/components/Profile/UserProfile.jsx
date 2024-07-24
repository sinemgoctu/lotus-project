import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Avatar,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState("Ürünlerim");

  useEffect(() => {
    fetch(`https://lotusproject.azurewebsites.net/api/user/${id}`)
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, [id]);

  const fetchProducts = () => {
    fetch(`https://lotusproject.azurewebsites.net/api/user/${id}/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  };

  const fetchAppointments = () => {
    fetch(`https://lotusproject.azurewebsites.net/api/user/${id}/appointments`)
      .then((response) => response.json())
      .then(async (data) => {
        const appointmentsWithDoctor = await Promise.all(
          data.map(async (appointment) => {
            const doctorResponse = await fetch(
              `https://lotusproject.azurewebsites.net/api/doctors/${appointment.doctorId}`
            );
            const doctorData = await doctorResponse.json();
            return {
              ...appointment,
              doctorName: `${doctorData.userName} ${doctorData.surname}`,
            };
          })
        );
        setAppointments(appointmentsWithDoctor);
      })
      .catch((error) => console.error("Error fetching appointments:", error));
  };

  const fetchQuestions = () => {
    fetch(
      `https://lotusproject.azurewebsites.net/api/user/${id}/forum-questions`
    )
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Error fetching questions:", error));
  };

  useEffect(() => {
    if (activeTab === "Ürünlerim") {
      fetchProducts();
    } else if (activeTab === "Randevularım") {
      fetchAppointments();
    } else if (activeTab === "Sorularım") {
      fetchQuestions();
    }
  }, [activeTab]);

  if (!userData) {
    return <CircularProgress />;
  }

  const handleMessageClick = () => {
    navigate(`/singleconversation/${id}`);
  };

  return (
    <Box
      sx={{ display: "flex", maxWidth: "1200px", margin: "0 auto", padding: 2 }}
    >
      <Box sx={{ flex: 1, paddingRight: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Avatar
            sx={{ width: 100, height: 100 }}
            src={userData.image || "https://via.placeholder.com/100"}
          />
          <br></br>
          <Typography variant="h6">{`${userData.userName} ${userData.surname}`}</Typography>
          <Typography>{userData.email}</Typography>
          <Typography>{`Hamilelik Durumu: ${userData.pregnancyStatus} Hafta`}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleMessageClick}
          >
            Mesaj Gönder
          </Button>
        </Box>
      </Box>

      <Divider orientation="vertical" flexItem />

      <Box sx={{ flex: 2, paddingLeft: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Button onClick={() => setActiveTab("Ürünlerim")}>Ürünlerim</Button>
          <Button onClick={() => setActiveTab("Randevularım")}>
            Randevularım
          </Button>
          <Button onClick={() => setActiveTab("Sorularım")}>Sorularım</Button>
        </Box>

        {activeTab === "Ürünlerim" && (
          <List>
            {products.map((product, index) => (
              <ListItem key={index}>
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
              </ListItem>
            ))}
          </List>
        )}

        {activeTab === "Randevularım" && (
          <List>
            {appointments.map((appointment, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Dr. ${appointment.doctorName}`}
                  secondary={`Start Time: ${appointment.startTime}`}
                />
              </ListItem>
            ))}
          </List>
        )}

        {activeTab === "Sorularım" && (
          <List>
            {questions.map((question, index) => (
              <ListItem key={index}>
                <ListItemText primary={question.question} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default UserProfile;
