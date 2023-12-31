import React from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import MainPage from './pages/MainPage/MainPage';
import GamePage from './pages/GamePage/GamePage';
import mainPageLoader from './loaders/MainPageLoader';
import gamePageLoader from './loaders/GamePageLoader';
import NotFound from './pages/NotFoundPage/NotFoundPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    loader: mainPageLoader,
  },
  {
    path: "/game/:id",
    element: <GamePage />,
    loader: gamePageLoader,
  },
  {
    path: "*",
    element: <NotFound />
  }

]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App;
