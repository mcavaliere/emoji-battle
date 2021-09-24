export const fetcher = async (...args) => {
  try {
    return fetch(...args).then((res) => res.json());
  } catch (error) {
    console.log(`fetcher error:`, error);
  }
};
