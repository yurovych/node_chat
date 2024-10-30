import React, { useMemo, useState } from 'react';

export const Context = React.createContext({});

export const ContextProvider = ({ children }) => {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [anyError, setAnyError] = useState(null);
  const [allChats, setAllChats] = useState([]);

  const value = useMemo(
    () => ({
      currentRoom,
      setCurrentRoom,
      user,
      setUser,
      anyError,
      setAnyError,
      allChats,
      setAllChats,
    }),
    [currentRoom, user, anyError, allChats]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
