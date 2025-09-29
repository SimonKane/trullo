import { useAuth } from "../auth/AuthContext";
const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <button
      onClick={logout}
      className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
