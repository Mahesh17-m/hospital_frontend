export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Backend not reachable:', error.message);
    return false;
  }
};
