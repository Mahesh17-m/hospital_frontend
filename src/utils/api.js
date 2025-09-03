export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
    const data = await response.json();
    return data.success; // true if backend is running
  } catch (error) {
    console.error('Backend not reachable:', error);
    return false;
  }
};
