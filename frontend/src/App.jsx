import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./app.css";
const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
