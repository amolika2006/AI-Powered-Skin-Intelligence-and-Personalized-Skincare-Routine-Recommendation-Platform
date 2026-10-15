
import { useState } from "react";

import ConsultantDashboard from "./pages/ConsultantDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SkinProfile from "./pages/SkinProfile.jsx";
import Lifestyle from "./pages/Lifestyle.jsx";
import SleepTracking from "./pages/SleepTracking.jsx";
import Hydration from "./pages/Hydration.jsx";
import SkinAssessment from "./pages/SkinAssessment.jsx";
import SkinHealthScore from "./pages/SkinHealthScore.jsx";
import PersonalizedRoutine from "./pages/PersonalizedRoutine.jsx";
import RoutineGenerator from "./pages/RoutineGenerator.jsx";
import SkincareRecommendations from "./pages/SkincareRecommendations.jsx";
import IngredientAssessment from "./pages/IngredientAssessment.jsx";
import ProductRecommendations from "./pages/ProductRecommendations.jsx";
import ProgressTracking from "./pages/ProgressTracking.jsx";
import Analytics from "./pages/Analytics.jsx";
import BookConsultation from "./pages/BookConsultation.jsx";

function App() {
  const [page, setPage] = useState("login");

  const [userId, setUserId] = useState(
    localStorage.getItem("userId")
  );

  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole")
  );

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");

    setUserId(null);
    setUserRole(null);
    setPage("login");
  };

  // REGISTER
  if (page === "register") {
    return (
      <Register
        onBackToLogin={() => setPage("login")}
      />
    );
  }

  // BOOK CONSULTATION - USER ONLY
  if (page === "book-consultation") {
    if (userRole !== "user") {
      return null;
    }

    return (
      <BookConsultation
        onBackToDashboard={() => setPage("dashboard")}
      />
    );
  }

  // ADMIN DASHBOARD
  if (page === "admin") {
    if (userRole !== "admin") {
      return null;
    }

    return (
      <AdminDashboard
        onBackToDashboard={() => setPage("admin")}
        onLogout={handleLogout}
      />
    );
  }

  // CONSULTANT DASHBOARD
  if (page === "consultant") {
    if (
      userRole !== "consultant" &&
      userRole !== "dermatologist"
    ) {
      return null;
    }

    return (
      <ConsultantDashboard
        onBackToDashboard={() => setPage("consultant")}
        onLogout={handleLogout}
      />
    );
  }

  // DASHBOARD
  if (page === "dashboard") {
    // Admin must stay in the Admin Dashboard
    if (userRole === "admin") {
      return (
        <AdminDashboard
          onBackToDashboard={() => setPage("admin")}
          onLogout={handleLogout}
        />
      );
    }

    // Consultant must stay in the Consultant Dashboard
    if (
      userRole === "consultant" ||
      userRole === "dermatologist"
    ) {
      return (
        <ConsultantDashboard
          onBackToDashboard={() => setPage("consultant")}
          onLogout={handleLogout}
        />
      );
    }

    // Normal User Dashboard
    return (
      <Dashboard
        onManageSkinProfile={() => setPage("skinProfile")}
        onLifestyle={() => setPage("lifestyle")}
        onSleep={() => setPage("sleep")}
        onHydration={() => setPage("hydration")}
        onSkinAssessment={() => setPage("skinAssessment")}
        onSkinHealthScore={() => setPage("skinHealthScore")}
        onPersonalizedRoutine={() => setPage("personalizedRoutine")}
        onRoutineGenerator={() => setPage("routineGenerator")}
        onSkincareRecommendations={() =>
          setPage("skincareRecommendations")
        }
        onIngredientAssessment={() =>
          setPage("ingredientAssessment")
        }
        onProductRecommendations={() =>
          setPage("productRecommendations")
        }
        onProgressTracking={() =>
          setPage("progressTracking")
        }
        onAnalytics={() => setPage("analytics")}
        onBookConsultation={
          userRole === "user"
            ? () => setPage("book-consultation")
            : undefined
        }
        onLogout={handleLogout}
      />
    );
  }

  // SKIN PROFILE
  if (page === "skinProfile") {
    return (
      <SkinProfile
        onBackToDashboard={() => setPage("dashboard")}
      />
    );
  }

  // LIFESTYLE
  if (page === "lifestyle") {
    return (
      <Lifestyle
        onBackToDashboard={() => setPage("dashboard")}
      />
    );
  }

  // SLEEP TRACKING
  if (page === "sleep") {
    return (
      <SleepTracking
        onBackToDashboard={() => setPage("dashboard")}
      />
    );
  }

  // HYDRATION
  if (page === "hydration") {
    return (
      <Hydration
        onBackToDashboard={() => setPage("dashboard")}
      />
    );
  }

  if (page === "skinAssessment") {
  return (
    <SkinAssessment
      onBackToDashboard={() => setPage("dashboard")}
    />
  );
}

  // SKIN HEALTH SCORE
  if (page === "skinHealthScore") {
    return (
      <SkinHealthScore
        onBackToDashboard={() => setPage("dashboard")}
      />
    );
  }

  // PERSONALIZED ROUTINE
  if (page === "personalizedRoutine") {
    return (
      <PersonalizedRoutine
        onBackToDashboard={() => setPage("dashboard")}
      />
    );
  }

  // ROUTINE GENERATOR
  if (page === "routineGenerator") {
    return (
      <RoutineGenerator
        onBackToDashboard={() => setPage("dashboard")}
      />
    );
  }

  // SKINCARE RECOMMENDATIONS
  if (page === "skincareRecommendations") {
    return (
      <SkincareRecommendations
        onBackToDashboard={() => setPage("dashboard")}
      />
    );
  }

  // INGREDIENT ASSESSMENT
  if (page === "ingredientAssessment") {
    return (
      <IngredientAssessment
        userId={userId}
        onBackToDashboard={() => setPage("dashboard")}
      />
    );
  }

  // PRODUCT RECOMMENDATIONS
  if (page === "productRecommendations") {
    return (
      <ProductRecommendations
        onBackToDashboard={() => setPage("dashboard")}
      />
    );
  }

  // PROGRESS TRACKING
  if (page === "progressTracking") {
    return (
      <ProgressTracking
        onBackToDashboard={() => setPage("dashboard")}
      />
    );
  }

  // ANALYTICS
  if (page === "analytics") {
    return (
      <Analytics
        onBackToDashboard={() => setPage("dashboard")}
      />
    );
  }

  // LOGIN
  return (
    <Login
      onLoginSuccess={(id, role) => {
        const normalizedRole = String(role)
          .toLowerCase()
          .trim();

        setUserId(id);
        setUserRole(normalizedRole);

        localStorage.setItem("userId", String(id));
        localStorage.setItem("userRole", normalizedRole);

        if (normalizedRole === "admin") {
          setPage("admin");
        } else if (
          normalizedRole === "consultant" ||
          normalizedRole === "dermatologist"
        ) {
          setPage("consultant");
        } else {
          setPage("dashboard");
        }
      }}
      onCreateAccount={() => setPage("register")}
    />
  );
}

export default App;
