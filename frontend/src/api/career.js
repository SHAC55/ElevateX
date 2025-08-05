// src/api/career.js
import api from './api';

// Save career choice
export const chooseCareer = async (data) => {
  const res = await api.post('/career/chooseCareer', data);
  return res.data;
};

// Get current career choice status
export const getCareerStatus = async () => {
  const res = await api.get('/career/status');
  return res.data;
};
// Delete career choice
export const deleteCareerChoice = async () => {
  const res = await api.delete('/career/choice');
  return res.data;
};
// Update career choice
export const updateCareerChoice = async (data) => {
  const res = await api.put('/career/choice', data);
  return res.data;
};
// Generate AI Career Plan
export const generateCareerPlan = async () => {
  const res = await api.post('/career/plan');
  return res.data;
};

// Get AI Career Plan
export const getCareerPlan = async () => {
  const res = await api.get('/career/plan');
  return res.data;
};
