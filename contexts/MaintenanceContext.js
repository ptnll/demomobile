import { createContext, useEffect, useState } from 'react';

import {
  getRequests,
  saveRequests,
} from '../storage/maintenanceStorage';

export const MaintenanceContext = createContext();

export const MaintenanceProvider = ({ children }) => {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const data = await getRequests();
    setRequests(data);
    setLoading(false);
  };

  const addRequest = async (newRequest) => {

    const updated = [
      ...requests,
      {
        id: Date.now().toString(),
        ...newRequest,
      },
    ];

    setRequests(updated);

    await saveRequests(updated);
  };

  const updateRequest = async (updatedRequest) => {

    const updated = requests.map((item) =>
      item.id === updatedRequest.id
        ? updatedRequest
        : item
    );

    setRequests(updated);

    await saveRequests(updated);
  };

  return (
    <MaintenanceContext.Provider
      value={{
        requests,
        addRequest,
        updateRequest,
        loading,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
    
  );
};