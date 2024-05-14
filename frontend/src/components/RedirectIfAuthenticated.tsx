import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSupabaseUser from '../hooks/useSupabaseUser'

const RedirectIfAuthenticated = ({ children }) => {
  const { user, loading } = useSupabaseUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard/'); // Redirect to home page if no user session
    }
  }, [user, loading, navigate]);

  if (loading) return <p>Loading...</p>;

  return children;
};

export default RedirectIfAuthenticated;