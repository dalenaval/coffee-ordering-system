const useEmptyDataChecker = (data) => {
  if (data === null || data === undefined) {
    return true;
  }

  if (Array.isArray(data) || typeof data === "string") {
    return data.length === 0;
  }

  if (typeof data === "object") {
    return Object.keys(data).length === 0; // Empty object
  }

  if (typeof data === "number" && data > 0) {
    return false; // Numbers are not considered empty
  }

  return true;
};

export default useEmptyDataChecker;
