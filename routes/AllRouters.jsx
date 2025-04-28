import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "../src/page/homepage/home";
import Login from "../src/page/Loginpage/login"
import CreatePost from "../src/component/postformcomponent/PostForm"
import BlogDetail from "../src/component/postdetailcomponent/PostDetail"
import Signup from "../src/page/Registerpage/Singup";
import ForgotPassword from "../src/component/forgotpasswordComponent/forgotPassword";
import Profile from "../src/page/Profile/profile";
import Preview from "../src/component/previewComponent/preview";
// import BlogEditor from "../src/component/BlogEditComponent/editblog";
const AllRouters = () => {
  return (
    <>
      <BrowserRouter>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<HomePage />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="//forgot-password" element={<ForgotPassword />} />
        <Route path="/profile/:userId" element={<Profile/>} />
        <Route path="/preview/:draftId" element={<Preview/>} />
        {/* <Route path="/new" element={<BlogEditor />} /> */}
        {/* <Route path="/edit/:id" element={<BlogEditor />} /> */}

        
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default AllRouters;
