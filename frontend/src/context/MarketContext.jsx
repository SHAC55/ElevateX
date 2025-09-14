import React, { createContext, useState } from "react";
import axios, { all } from "axios";

// Create Context
export const MarketplaceContext = createContext();

// Provider Component
export const MarketplaceProvider = ({ children }) => {
 
  const  backendURL  =  "http://localhost:5000/api"
  const[products,setProducts] =  useState([])

  const value = {
    backendURL,
    products,setProducts,
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
};
