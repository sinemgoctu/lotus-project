import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { UserContext } from "../../contexts/UserContext";
import "./SingleDoctor.css";

const SingleDoctor = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("06-2024");
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(
          `https://lotusproject.azurewebsites.net/api/doctors/${id}`
        );
        if (!response.ok) {
          throw new Error("Doctor not found");
        }
        const data = await response.json();
        setDoctor(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchAppointments = async (month) => {
      try {
        const response = await fetch(
          `https://lotusproject.azurewebsites.net/api/appointments/doctor/${id}/availability?month=${month}`
        );
        if (!response.ok) {
          throw new Error("Appointments not found");
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDoctor();
    fetchAppointments(selectedMonth);
  }, [id, selectedMonth]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAppointmentChange = (event) => {
    setSelectedAppointment(event.target.value);
  };

  const handleFormSubmit = async () => {
    const [appointmentDate, availableFrom] = selectedAppointment.split("|");
    const startTime = `${appointmentDate}T${availableFrom}:00.000Z`;
    const appointmentData = {
      userId: user.id,
      doctorId: id,
      startTime: startTime,
    };

    console.log("Appointment Data:", JSON.stringify(appointmentData));

    try {
      const response = await fetch(
        "https://lotusproject.azurewebsites.net/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        throw new Error("Appointment booking failed");
      }

      alert("Randevu başarıyla alındı!");
      setOpen(false);
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSendMessage = () => {
    navigate(`/singleconversationdoctor/${id}`);
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              image={doctor.image}
              alt={`${doctor.userName} ${doctor.surname}`}
            />
            <CardContent>
              <Typography variant="h5" component="div">
                {doctor.userName} {doctor.surname}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {doctor.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {doctor.information}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <FormControl fullWidth>
            <InputLabel id="month-select-label">Ay Seçiniz</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={selectedMonth}
              label="Select Month"
              onChange={(e) => setSelectedMonth(e.target.value)}
              sx={{ minWidth: 300 }}
            >
              {[
                "06-2024",
                "07-2024",
                "08-2024",
                "09-2024",
                "10-2024",
                "11-2024",
                "12-2024",
              ].map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box mt={2}>
            <Grid container spacing={2}>
              {appointments.map((appointment) => (
                <Grid item xs={12} sm={6} md={4} key={appointment.scheduleId}>
                  <Paper
                    elevation={3}
                    sx={{
                      padding: 2,
                      backgroundColor: appointment.isBooked ? "red" : "green",
                      color: "white",
                    }}
                  >
                    <Typography variant="body1">
                      Başlangıç:{" "}
                      {new Date(appointment.startTime).toLocaleString()}
                    </Typography>
                    <Typography variant="body1">
                      Bitiş: {new Date(appointment.endTime).toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
        sx={{ position: "fixed", bottom: 70, right: 16 }}
      >
        Mesaj Gönder
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        Randevu Al
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Randevu Al</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="appointment-select-label">
              Randevu Saatini Seçiniz
            </InputLabel>
            <Select
              labelId="appointment-select-label"
              id="appointment-select"
              value={selectedAppointment}
              label="Randevu Saatini Seçiniz"
              onChange={handleAppointmentChange}
              sx={{ minWidth: 300 }}
            >
              {appointments
                .filter((appointment) => !appointment.isBooked)
                .map((appointment) => (
                  <MenuItem
                    key={appointment.scheduleId}
                    value={`${appointment.startTime.split("T")[0]}|${
                      appointment.startTime.split("T")[1].split(":")[0]
                    }:${appointment.startTime.split("T")[1].split(":")[1]}`}
                  >
                    {new Date(appointment.startTime).toLocaleString()}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            İptal
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            Onayla
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SingleDoctor;
