import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { ThemeProvider } from "./context/ThemeProvider.jsx"
import { AuthProvider } from "./context/AuthContext"
import App from "./App.jsx"
import { HashRouter } from "react-router-dom"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
