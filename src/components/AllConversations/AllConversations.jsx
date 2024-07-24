import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { UserContext } from "../../contexts/UserContext";
import "./AllConversations.css";

const AllConversations = () => {
  const { user } = useContext(UserContext);
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchConversations = async () => {
      try {
        const response = await fetch(
          `https://lotusproject.azurewebsites.net/api/messages/conversations/${user.id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setConversations(data);

        // Fetch user details for each conversation participant
        const userPromises = data.flatMap((conversation) =>
          conversation.messages.map((message) =>
            fetchUserDetails(
              message.senderId === user.id
                ? message.recipientId
                : message.senderId
            )
          )
        );

        const userData = await Promise.all(userPromises);
        const userMap = userData.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        setUsers(userMap);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, [user]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(
        `https://lotusproject.azurewebsites.net/api/user/${userId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleMenuOpen = (event, conversationId) => {
    event.stopPropagation(); // Prevent navigation
    setAnchorEl(event.currentTarget);
    setSelectedConversationId(conversationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedConversationId(null);
  };

  const handleDeleteConversation = async () => {
    try {
      const response = await fetch(
        `https://lotusproject.azurewebsites.net/api/messages/conversation/${selectedConversationId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete conversation");
      }
      setConversations(
        conversations.filter(
          (conv) => conv.messages[0].conversationId !== selectedConversationId
        )
      );
      handleMenuClose();
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  if (!user || !user.id) return <div>Loading user data...</div>;

  return (
    <Container maxWidth="md" className="all-conversations-container">
      <Box my={4} className="all-conversations-header">
        <Typography variant="h6" gutterBottom align="left">
          Bütün Sohbetler
        </Typography>
        <Box my={4} className="all-conversations-list">
          <List>
            {conversations.map((conversation, index) => {
              const lastMessage =
                conversation.messages[conversation.messages.length - 1];
              const participantId =
                lastMessage.senderId === user.id
                  ? lastMessage.recipientId
                  : lastMessage.senderId;
              const participant = users[participantId];

              return (
                <ListItem key={index} disableGutters>
                  <div style={{ display: "flex", width: "100%" }}>
                    <Link
                      to={`/singleconversation/${participantId}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        flex: 1,
                      }}
                    >
                      <Paper
                        elevation={3}
                        className="conversation-item"
                        sx={{
                          padding: "16px",
                          margin: "8px 0",
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <ListItemText
                          primary={
                            participant
                              ? `${participant.userName} ${participant.surname}`
                              : "Loading..."
                          }
                          secondary={`${lastMessage.text} - ${new Date(
                            lastMessage.sentAt
                          ).toLocaleString()}`}
                        />
                      </Paper>
                    </Link>
                    <IconButton
                      edge="end"
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={(event) =>
                        handleMenuOpen(event, lastMessage.conversationId)
                      }
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </div>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteConversation}>Sohbeti Sil</MenuItem>
      </Menu>
    </Container>
  );
};

export default AllConversations;
