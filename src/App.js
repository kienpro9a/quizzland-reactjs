import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Quizz from "./components/quizz";
import Result from "./components/result";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/quiz/:topicID" element={<Quizz />} />
        <Route path="/result/:topicID" element={<Result />} />
      </Routes>
    </Router>
  );
}
