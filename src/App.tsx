import { LoginPage } from "./pages/LoginPage";

function App() {
  const handleLoginSuccess = (userEmail: string) => {
    console.log("Login realizado:", userEmail);
  };

  return <LoginPage onLoginSuccess={handleLoginSuccess} />;
}

export default App;
