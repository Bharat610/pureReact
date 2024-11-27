import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import './index.css'
import Write from './pages/Write.jsx';
import Home from './pages/Home.jsx';
import Single from './pages/Single.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/login/Login.jsx';
import { ContextProvider } from './context/Context.jsx';
import LogoutConfirm from './pages/LogoutConfirm.jsx';
import UserSingle from './pages/UserSingle.jsx';
import NotFound from './pages/NotFound.jsx';
import SettingsLayout from './pages/settings/SettingsLayout.jsx';
import SettingsProfile from './pages/settings/SettingsProfile.jsx';
import SettingsAccount from './pages/settings/SettingsAccount.jsx';
import AuthRequired from './utils/AuthRequired.jsx';
import ReadingList from './pages/ReadingList.jsx';
import SearchPage from './pages/SearchPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import EmailVerification from './utils/EmailVerification.jsx';
import PasswordReset from './pages/login/PasswordReset.jsx';
import ForgotPassword from './pages/login/ForgotPassword.jsx';


const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <NotFound />
    },
    {
      element: <AuthRequired />,
      children: [
        {
          path: "/write",
          element: <Write />
        },
        {
          path: "/settings",
          element: <SettingsLayout />,
          children: [
            {
              index: true,
              element: <SettingsProfile />,
            },
            {
              path: "account",
              element: <SettingsAccount />
            }
          ]
        },
        {
          path:"/readinglist",
          element: <ReadingList />
        }
      ]
    },
    {
      path: "/post/:postId",
      element: <Single />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/verify-email",
      element: <EmailVerification />
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/password-reset",
      element: <PasswordReset />
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />
    },
    {
      path: "/confirm_signout",
      element: <LogoutConfirm />
    },
    {
      path: "/:username",
      element: <UserSingle />
    },
    {
      path: "/category",
      element: <CategoryPage />
    },
    {
      path: "/search",
      element: <SearchPage />
    },
    {
      path: "/404",
      element: <NotFound />
    }
  ]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <ContextProvider>
   <RouterProvider router={router} />
  </ContextProvider>

)
