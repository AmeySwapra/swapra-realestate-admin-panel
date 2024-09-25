import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import PropertyPage from './Pages/PropertyPage';
import ServicePage from './Pages/ServicePage';
import BlogPage from './Pages/BlogPage'
import NotificationPage from './Pages/NotificationPage'
import SingleBlogPage from './Pages/SingleBlogPage';
import SinglePropertyPage from './Pages/SinglePropertyPage';
import RegisterUserPage from './Pages/RegisterUserPage'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/properties' element={<PropertyPage/>} />
        <Route path='/services' element={<ServicePage/>} />
        <Route path='/blog' element={<BlogPage/>} />
        <Route path='notification' element={<NotificationPage/>} />
        <Route path='/blog/:id' element={<SingleBlogPage/>}/>
        <Route path="/property/:id" element={<SinglePropertyPage/>} />
        <Route path='/register-user' element={<RegisterUserPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
