import React, { useEffect, useState } from "react";
import ForumQuestionItem from "./ForumQuestionItem";
import "./ForumQuestions.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { IconButton } from "@mui/material";
import AddQuestionForm from "../AddQuestionForm";
import { Link } from "react-router-dom";

function ForumQuestions() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortingMethod, setSortingMethod] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://lotusproject.azurewebsites.net/api/forumQuestions/GetAllQuestions"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const formattedData = data.map((question) => ({
          questionId: question.questionId,
          questionTitle: question.question,
          questionDate: question.creationDate,
          questionCategoryId: question.forumQuestionCategoryId,
        }));
        setQuestions(formattedData);
        setFilteredQuestions(formattedData);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

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

    fetchQuestions();
    fetchCategories();
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (category) => category.forumQuestionCategoryId === categoryId
    );
    return category ? category.forumQuestionCategoryName : "Unknown";
  };

  const handleSearchAndFilter = async () => {
    let filteredData = questions;

    if (searchTerm.trim()) {
      try {
        const response = await fetch(
          `https://lotusproject.azurewebsites.net/api/search/ForumSearch?questiontitle=${searchTerm}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        filteredData = data.map((question) => ({
          questionId: question.questionId,
          questionTitle: question.question,
          questionDate: question.creationDate,
          questionCategoryId: question.forumQuestionCategoryId,
        }));
      } catch (error) {
        console.error("Error fetching search results:", error);
        return;
      }
    }

    filteredData = filteredData.filter((question) => {
      return (
        filter === "All" ||
        getCategoryName(question.questionCategoryId) === filter
      );
    });

    switch (sortingMethod) {
      case "Alfabetik Sırala (A-Z)":
        filteredData.sort((a, b) =>
          a.questionTitle.localeCompare(b.questionTitle)
        );
        break;
      case "Alfabetik Sırala (Z-A)":
        filteredData.sort((a, b) =>
          b.questionTitle.localeCompare(a.questionTitle)
        );
        break;
      case "Tarihe Göre Sırala (Yeni)":
        filteredData.sort(
          (a, b) => new Date(b.questionDate) - new Date(a.questionDate)
        );
        break;
      case "Tarihe Göre Sırala (Eski)":
        filteredData.sort(
          (a, b) => new Date(a.questionDate) - new Date(b.questionDate)
        );
        break;
      default:
        break;
    }

    setFilteredQuestions(filteredData);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddQuestion = (newQuestion) => {
    const formattedQuestion = {
      questionId: newQuestion.id,
      questionTitle: newQuestion.question,
      questionDate: newQuestion.creationDate,
      questionCategoryId: newQuestion.forumQuestionCategoryId,
    };

    setQuestions((prevQuestions) => [...prevQuestions, formattedQuestion]);
    setFilteredQuestions((prevQuestions) => [
      ...prevQuestions,
      formattedQuestion,
    ]);
    setOpen(false);
  };

  return (
    <div className="question-wrapper">
      <div className="forum-questions-header">
        <h1>Sorular</h1>
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
                key={category.forumQuestionCategoryId}
                value={category.forumQuestionCategoryName}
              >
                {category.forumQuestionCategoryName}
              </option>
            ))}
          </select>
          <select
            value={sortingMethod}
            onChange={(e) => setSortingMethod(e.target.value)}
          >
            <option value="">Sırala</option>
            <option value="Alfabetik Sırala (A-Z)">
              Alfabetik Sırala (A-Z)
            </option>
            <option value="Alfabetik Sırala (Z-A)">
              Alfabetik Sırala (Z-A)
            </option>
            <option value="Tarihe Göre Sırala (Yeni)">
              Tarihe Göre Sırala (Yeni)
            </option>
            <option value="Tarihe Göre Sırala (Eski)">
              Tarihe Göre Sırala (Eski)
            </option>
          </select>
          <button
            className="question-filter-button"
            onClick={handleSearchAndFilter}
          >
            OK
          </button>
        </div>
      </div>
      <div className="forum-questions">
        {filteredQuestions.map((question) => (
          <Link
            key={question.questionId}
            to={`/questions/${question.questionId}`}
            style={{ textDecoration: "none" }}
            className="question-link"
          >
            <ForumQuestionItem question={question} />
          </Link>
        ))}
      </div>
      <IconButton
        onClick={handleOpen}
        style={{
          marginRight: 23,
          marginBottom: 23,
          position: "fixed",
          bottom: 20,
          right: 20,
          fontSize: 60,
          color: "#ff69b4",
        }}
      >
        <AddCircleIcon style={{ fontSize: 60 }} />
      </IconButton>
      <AddQuestionForm
        open={open}
        handleClose={handleClose}
        handleAddQuestion={handleAddQuestion}
      />
    </div>
  );
}

export default ForumQuestions;
