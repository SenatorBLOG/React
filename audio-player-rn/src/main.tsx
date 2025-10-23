import { createRoot } from "react-dom/client";
import App from "./App";
import { registerRootComponent } from "expo";

if (document.getElementById("root")) {
  createRoot(document.getElementById("root")!).render(<App />);
} else {
  registerRootComponent(App); // fallback для native
}
