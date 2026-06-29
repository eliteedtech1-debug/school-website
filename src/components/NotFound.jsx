import React from 'react';
import { Link } from 'react-router-dom';
import SEO from "./SEO";

const NotFound = () => {
  return (
    <>
      <SEO title="404 - Page Not Found" description="Page not found. The page you are looking for does not exist." canonicalPath="" />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <div className="space-x-4">
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Go Home
          </Link>
          <Link 
            to="/admin/login" 
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div></>
  );
};

export default NotFound;