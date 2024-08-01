import React from 'react';
import { User } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignOutUser, userStateListener } from '../firebase/firebase';
import { createContext, useState, useEffect, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export const AuthContext = createContext({
  // "User" comes from firebase auth-public.d.ts
  currentUser: {} as User | null,
  setCurrentUser: (_user: User) => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = useLocation();

  useEffect(() => {
    const unsubscribe = userStateListener(user => {
      if (user) {
        setCurrentUser(user);
        const path = location.pathname !== '/' ? location.pathname : '/info';
        navigate(`${path}${search}`);
      }
    });
    return unsubscribe;
  }, [setCurrentUser]);

  // As soon as setting the current user to null,
  // the user will be redirected to the home page.
  const signOut = () => {
    SignOutUser();
    setCurrentUser(null);
    console.log('SIGN OUT');
    navigate('/');
  };

  const value = {
    currentUser,
    setCurrentUser,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
