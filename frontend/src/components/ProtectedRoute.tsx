import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSupabaseUser from '../hooks/useSupabaseUser'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSupabaseUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/'); // Redirect to home page if no user session
    }
  }, [user, loading, navigate]);

  if (loading) return <p>Loading...</p>;

  return user ? children : null;
};

export default ProtectedRoute;
