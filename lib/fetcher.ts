export const fetcher = async (...args) => {
  try {
    // @ts-ignore
    return fetch(...args).then((res) => res.json());
  } catch (error) {
    console.log(`fetcher error:`, error);
  }
};
