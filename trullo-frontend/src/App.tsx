import "./App.css";
import KanbanBoard from "./components/KanbanBoard";
import LoginPage from "./auth/LoginPage";
import { AuthProvider, useAuth } from "./auth/AuthContext";

function AppInner() {
  const { auth } = useAuth();
  return auth ? <KanbanBoard /> : <LoginPage />;
}

function App() {
  return (
    <>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </>
  );
}

export default App;
