import api from './api';

/**
 * ═══════════════════════════════════════════════════════════
 * RENTBREAKER API SERVICE LAYER
 * Unified interface for all backend communications
 * ═══════════════════════════════════════════════════════════
 */

// ── Dashboard & Reports ──
export const getDashboardStats = () => api.get('/reports/stats');

// ── Machines ──
export const getMachines = () => api.get('/machines');
export const getMachineById = (id) => api.get(`/machines/${id}`);
export const createMachine = (data) => api.post('/machines', data);
export const updateMachine = (id, data) => api.put(`/machines/${id}`, data);
export const deleteMachine = (id) => api.delete(`/machines/${id}`);

// ── Customers ──
export const getCustomers = () => api.get('/customers');
export const getCustomerById = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post('/customers', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

// ── Rentals ──
export const getRentals = () => api.get('/rentals');
export const getRentalById = (id) => api.get(`/rentals/${id}`);
export const createRental = (data) => api.post('/rentals', data);
export const updateRental = (id, data) => api.put(`/rentals/${id}`, data); // For completion or edits
export const deleteRental = (id) => api.delete(`/rentals/${id}`);

// ── Maintenance ──
export const getMaintenance = () => api.get('/maintenance');
export const getMaintenanceById = (id) => api.get(`/maintenance/${id}`);
export const createMaintenance = (data) => api.post('/maintenance', data);
export const updateMaintenance = (id, data) => api.put(`/maintenance/${id}`, data);
export const deleteMaintenance = (id) => api.delete(`/maintenance/${id}`);

// ── Auth ──
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (data) => api.post('/auth/register', data);

// ── Export all as a service object ──
const Service = {
  auth: { login, register },
  dashboard: { getStats: getDashboardStats },
  machines: { get: getMachines, getById: getMachineById, create: createMachine, update: updateMachine, delete: deleteMachine },
  customers: { get: getCustomers, getById: getCustomerById, create: createCustomer, update: updateCustomer, delete: deleteCustomer },
  rentals: { get: getRentals, getById: getRentalById, create: createRental, update: updateRental, delete: deleteRental },
  maintenance: { get: getMaintenance, getById: getMaintenanceById, create: createMaintenance, update: updateMaintenance, delete: deleteMaintenance },
};

export default Service;
