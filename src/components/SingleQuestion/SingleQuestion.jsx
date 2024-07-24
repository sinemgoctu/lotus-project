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
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { UserContext } from "../../contexts/UserContext";
import "./SingleQuestion.css";

const SingleQuestion = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [questionData, setQuestionData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [questionUser, setQuestionUser] = useState(null);
  const [answerUsers, setAnswerUsers] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentAnswerId, setCurrentAnswerId] = useState(null);
  const [editingAnswer, setEditingAnswer] = useState(null);

  const fetchUser = async (userId, setUser) => {
    try {
      const response = await fetch(
        `https://lotusproject.azurewebsites.net/api/user/${userId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const response = await fetch(
          `https://lotusproject.azurewebsites.net/api/forumQuestions/GetOneQuestionByIdWithAnswers/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setQuestionData(data.question);
        setAnswers(data.answers);

        if (data.question.anonymous === 0) {
          fetchUser(data.question.userId, setQuestionUser);
        }

        const answerUserPromises = data.answers.map((answer) =>
          fetchUser(answer.userId, (userData) =>
            setAnswerUsers((prevState) => ({
              ...prevState,
              [answer.userId]: userData,
            }))
          )
        );

        await Promise.all(answerUserPromises);
      } catch (error) {
        console.error("Error fetching question data:", error);
      }
    };

    fetchQuestionData();
  }, [id]);

  const handleAnswerSubmit = async () => {
    if (!newAnswer.trim()) return;

    const answerData = {
      questionId: id,
      answerContent: newAnswer,
      userType: user.userType,
      userId: user.id,
    };

    try {
      const response = await fetch(
        "https://lotusproject.azurewebsites.net/api/forumQuestionAnswers/answers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(answerData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add answer: ${errorText}`);
      }

      const newAnswerResponse = await response.json();
      setAnswers([...answers, newAnswerResponse]);
      setNewAnswer("");

      if (newAnswerResponse.anonymous === 0) {
        fetchUser(newAnswerResponse.userId, (userData) =>
          setAnswerUsers((prevState) => ({
            ...prevState,
            [newAnswerResponse.userId]: userData,
          }))
        );
      }
    } catch (error) {
      console.error("Error adding answer:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleMenuOpen = (event, answerId) => {
    setAnchorEl(event.currentTarget);
    setCurrentAnswerId(answerId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentAnswerId(null);
  };

  const handleEdit = (answer) => {
    setEditingAnswer(answer);
    setNewAnswer(answer.answerContent);
    handleMenuClose();
  };

  const handleDelete = async (questionId, answerId) => {
    try {
      const response = await fetch(
        `https://lotusproject.azurewebsites.net/api/forumQuestionAnswers/${questionId}/answers/${answerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete answer: ${errorText}`);
      }

      setAnswers(answers.filter((answer) => answer.answerId !== answerId));
    } catch (error) {
      console.error("Error deleting answer:", error);
      alert(`Error: ${error.message}`);
    }
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    if (!newAnswer.trim() || !editingAnswer) return;

    const answerData = {
      ...editingAnswer,
      answerContent: newAnswer,
    };

    try {
      const response = await fetch(
        `https://lotusproject.azurewebsites.net/api/forumQuestionAnswers/${id}/answers/${editingAnswer.answerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(answerData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to edit answer: ${errorText}`);
      }

      const updatedAnswer = await response.json();
      setAnswers(
        answers.map((answer) =>
          answer.answerId === updatedAnswer.answerId ? updatedAnswer : answer
        )
      );
      setNewAnswer("");
      setEditingAnswer(null);
    } catch (error) {
      console.error("Error editing answer:", error);
      alert(`Error: ${error.message}`);
    }
  };

  if (!questionData || !user) return <div>Loading...</div>;

  return (
    <Container maxWidth="md" className="single-question-container">
      <Box my={4} className="single-question-header">
        <Paper
          elevation={3}
          className="single-question-box"
          sx={{ backgroundColor: "#e0f7fa" }}
        >
          <Typography
            variant="subtitle1"
            align="left"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            {questionData.anonymous
              ? "Anonim Kullanıcı"
              : questionUser
              ? `${questionUser.userName} ${questionUser.surname}`
              : "Loading..."}
          </Typography>
          <Typography variant="body1" align="left" gutterBottom>
            Soru: {questionData.question}
          </Typography>
        </Paper>
        <Box my={4} className="single-question-answers">
          <Typography variant="h6" gutterBottom align="left">
            Cevaplar
          </Typography>
          <List>
            {answers.map((answer) => (
              <ListItem
                key={answer.answerId}
                disableGutters
                sx={{
                  justifyContent:
                    answer.userId === user.id ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  elevation={3}
                  className="single-question-answer"
                  sx={{
                    backgroundColor: "#ffecb3",
                    maxWidth: "75%",
                    position: "relative",
                  }}
                >
                  {answer.userId === user.id && (
                    <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                      <IconButton
                        aria-controls={`menu-${answer.answerId}`}
                        aria-haspopup="true"
                        onClick={(event) =>
                          handleMenuOpen(event, answer.answerId)
                        }
                      >
                        <MoreHorizIcon
                          sx={{ position: "absolute", top: 0, right: 0 }}
                        />
                      </IconButton>
                      <Menu
                        id={`menu-${answer.answerId}`}
                        anchorEl={anchorEl}
                        keepMounted
                        open={
                          Boolean(anchorEl) &&
                          currentAnswerId === answer.answerId
                        }
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => handleEdit(answer)}>
                          Düzenle
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleDelete(id, answer.answerId)}
                        >
                          Sil
                        </MenuItem>
                      </Menu>
                    </Box>
                  )}
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold" }}
                    gutterBottom
                  >
                    {answer.anonymous
                      ? "Anonim"
                      : answerUsers[answer.userId]
                      ? `${answerUsers[answer.userId].userName} ${
                          answerUsers[answer.userId].surname
                        }`
                      : "Loading..."}
                  </Typography>
                  <Typography variant="body2">
                    {answer.answerContent}
                  </Typography>
                </Paper>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box my={4}>
          <Typography variant="h6" gutterBottom>
            Cevap Yaz
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#ff69b4",
              color: "#fff",
              marginTop: "16px",
            }}
            onClick={editingAnswer ? handleEditSubmit : handleAnswerSubmit}
            className="single-question-submit"
          >
            {editingAnswer ? "Güncelle" : "Gönder"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SingleQuestion;
