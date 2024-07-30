'use client';

import Cookies from 'js-cookie';
import React, { useState, createContext, useContext } from 'react';

const GlobalContext = createContext({
  globalStore: {
    userId: '',
    cartCount: 0,
    wishListCount: 0,
    userToken: '',
  },
  productStore: {
    colorVariationName: '',
  },
});

export const GlobalContextProvider = ({ children }) => {
  const [globalStore, setGlobalStore] = useState({
    userId: Cookies.get('user_id'),
    cartCount: 0,
    wishListCount: 0,
    userToken: Cookies.get('token'),
  });
  const [productStore, setProductStore] = useState({
    colorVariationName: '',
  });
  return (
    <GlobalContext.Provider
      value={{
        globalStore,
        setGlobalStore,
        productStore,
        setProductStore,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
