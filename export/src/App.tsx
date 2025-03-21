import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div>
        <AppRouter />
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </div>
    </Suspense>
  );
}

export default App;
