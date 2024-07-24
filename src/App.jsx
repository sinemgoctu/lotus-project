import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CodeMail from "./pages/CodeMail";
import GetInfo from "./pages/GetInfo";
import AllArticles from "./pages/AllArticles";
import AllPodcasts from "./pages/AllPodcasts";
import AllDoctors from "./pages/AllDoctors";
import AllConversationsPage from "./pages/AllConversationsPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import Bazaar from "./pages/Bazaar";
import ForumAllQuestions from "./pages/ForumAllQuestions";
import SingleArticlePage from "./pages/SingleArticlePage";
import SinglePodcastPage from "./pages/SinglePodcastPage";
import SingleProductPage from "./pages/SingleProductPage";
import SingleQuestionPage from "./pages/SingleQuestionPage";
import SingleDoctorPage from "./pages/SingleDoctorPage";
import SingleConversation from "./pages/SingleConversationPage";
import SingleConversationDoctor from "./pages/SingleConversationDoctorPage";

const router = createBrowserRouter([
  { path: "/", element: <MainPage /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  { path: "/resetpassword", element: <ResetPassword /> },
  { path: "/codemail", element: <CodeMail /> },
  { path: "/getinfo", element: <GetInfo /> },
  { path: "/allarticles", element: <AllArticles /> },
  { path: "/allpodcasts", element: <AllPodcasts /> },
  { path: "/alldoctors", element: <AllDoctors /> },
  { path: "/allconversations", element: <AllConversationsPage /> },
  { path: "/profilepage", element: <ProfilePage /> },
  { path: "/bazaar", element: <Bazaar /> },
  { path: "/forumallquestions", element: <ForumAllQuestions /> },
  { path: "/articles/:id", element: <SingleArticlePage /> },
  { path: "/podcast/:id", element: <SinglePodcastPage /> },
  { path: "/products/:id", element: <SingleProductPage /> },
  { path: "/questions/:id", element: <SingleQuestionPage /> },
  { path: "/doctors/:id", element: <SingleDoctorPage /> },
  { path: "/profilepage/:id", element: <UserProfilePage /> },
  { path: "/singleconversation/:id", element: <SingleConversation /> },
  {
    path: "/singleconversationdoctor/:id",
    element: <SingleConversationDoctor />,
  },
]);

function App() {
  return (
    <div className="sign-in-wrapper">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
