
import React, { useState, useEffect } from 'react';
import CareerStatus from './CareerStatus';
import UnselectedPath from '../Components/UnselectedPath';
import { getCareerStatus } from '../api/career';

const CareerOS = () => {
  const [status, setStatus] = useState(null);

  const refreshStatus = async () => {
    try {
      const res = await getCareerStatus();
      setStatus(res.status);
    } catch (err) {
      console.error('Error fetching status:', err);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

return (
  <div className='w-full'>
    {status === 'chosen' ? (
      <CareerStatus refreshStatus={refreshStatus} /> 
    ) : (
      <UnselectedPath refreshStatus={refreshStatus} />
    )}
  </div>
);
};

export default CareerOS;
