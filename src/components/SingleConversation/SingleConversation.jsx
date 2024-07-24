import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  Paper,
} from "@mui/material";
import { UserContext } from "../../contexts/UserContext";
import "./SingleConversation.css";

const SingleConversation = () => {
  const { id: recipientId } = useParams();
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipientUser, setRecipientUser] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!recipientId) return;

    const fetchRecipientUser = async () => {
      try {
        const response = await fetch(
          `https://lotusproject.azurewebsites.net/api/user/${recipientId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRecipientUser(data);
      } catch (error) {
        console.error("Error fetching recipient user data:", error);
      }
    };

    fetchRecipientUser();
  }, [recipientId]);

  useEffect(() => {
    if (!user || !user.id || !recipientId) return;

    const fetchConversation = async () => {
      try {
        const response = await fetch(
          `https://lotusproject.azurewebsites.net/api/messages/conversations?participant1Id=${user.id}&participant2Id=${recipientId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const allMessages = data.reduce((acc, conversation) => {
          return [...acc, ...conversation.messages];
        }, []);

        setMessages(allMessages);
      } catch (error) {
        console.error("Error fetching conversation data:", error);
      }
    };

    fetchConversation();
  }, [user, recipientId, refresh]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: user.id,
      recipientId: recipientId,
      text: newMessage,
    };

    try {
      const response = await fetch(
        "https://lotusproject.azurewebsites.net/api/messages/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send message: ${errorText}`);
      }

      const newMessageResponse = await response.json();
      setMessages([...messages, newMessageResponse]);
      setNewMessage("");

      setRefresh(!refresh);
    } catch (error) {
      console.error("Error sending message:", error);
      alert(`Error: ${error.message}`);
    }
  };

  if (!user || !user.id) return <div>Kişi Verisi Yükleniyor...</div>;

  return (
    <Container maxWidth="md" className="single-conversation-container">
      <Box my={4} className="single-conversation-header">
        <Typography variant="h5" gutterBottom align="left">
          {" "}
          {recipientUser
            ? `${recipientUser.userName} ${recipientUser.surname}`
            : "Yükleniyor..."}
        </Typography>
        <Box my={4} className="single-conversation-messages">
          <List>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                disableGutters
                sx={{
                  justifyContent:
                    message.senderId === user.id ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  elevation={3}
                  className="single-conversation-message"
                  sx={{
                    backgroundColor:
                      message.senderId === user.id ? "#e0f7fa" : "#ffecb3",
                    maxWidth: "75%",
                    position: "relative",
                    padding: "16px",
                  }}
                >
                  <Typography variant="body2" gutterBottom>
                    {message.text}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    {new Date(message.sentAt).toLocaleString()}
                  </Typography>
                </Paper>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            Mesaj Gönder
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#f50057",
              color: "#fff",
              marginTop: "16px",
            }}
            onClick={handleSendMessage}
            className="single-conversation-submit"
          >
            Gönder
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SingleConversation;
