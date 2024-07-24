import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { UserContext } from "../contexts/UserContext";

const AddQuestionForm = ({ open, handleClose, handleAddQuestion }) => {
  const { user } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [questionData, setQuestionData] = useState({
    userId: user ? user.id : "",
    forumQuestionCategoryId: "",
    question: "",
    anonymous: 1,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://lotusproject.azurewebsites.net/api/forumQuestionCategories"
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
    setQuestionData({ ...questionData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setQuestionData({ ...questionData, anonymous: e.target.checked ? 0 : 1 });
  };

  const handleSubmit = async () => {
    const questionDataWithUserId = { ...questionData, userId: user.id };
    try {
      const response = await fetch(
        "https://lotusproject.azurewebsites.net/api/forumQuestions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(questionDataWithUserId),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add question: ${errorText}`);
      }

      const newQuestion = await response.json();
      handleAddQuestion(newQuestion);
    } catch (error) {
      console.error("Error adding question:", error);
      alert(`Error: ${error.message}`);
    }

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Yeni Soru Ekle</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Kategori</InputLabel>
          <Select
            name="forumQuestionCategoryId"
            value={questionData.forumQuestionCategoryId}
            onChange={handleInputChange}
          >
            {categories.map((category) => (
              <MenuItem
                key={category.forumQuestionCategoryId}
                value={category.forumQuestionCategoryId}
              >
                {category.forumQuestionCategoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          name="question"
          label="Soru"
          fullWidth
          margin="normal"
          value={questionData.question}
          onChange={handleInputChange}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={questionData.anonymous === 0}
              onChange={handleCheckboxChange}
              name="anonymous"
              color="primary"
            />
          }
          label="Anonim Olarak Sor"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          İptal
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Ekle
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddQuestionForm;
