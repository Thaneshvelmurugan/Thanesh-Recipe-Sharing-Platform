import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { MealPlansPage } from "./pages/MealPlansPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RecipeDetailsPage } from "./pages/RecipeDetailsPage";
import { RecipeFormPage } from "./pages/RecipeFormPage";

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/profiles/:id" element={<ProfilePage />} />
      <Route path="/recipes/new" element={<RecipeFormPage />} />
      <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
      <Route path="/meal-plans" element={<MealPlansPage />} />
    </Routes>
  </Layout>
);

export default App;
