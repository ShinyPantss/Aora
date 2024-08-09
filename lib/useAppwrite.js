import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn) => {
  const [data, setData] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fn();

      if (response) {
        setData(response);
      } else {
        setData([]);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // fetch data
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, isloading, refetch };
};

export default useAppwrite;
