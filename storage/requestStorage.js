import AsyncStorage from '@react-native-async-storage/async-storage';

const REQUEST_KEY = 'REQUEST_LIST';

export const saveRequests = async (requests) => {
  try {
    await AsyncStorage.setItem(
      REQUEST_KEY,
      JSON.stringify(requests)
    );
  } catch (error) {
    console.log(error);
  }
};

export const getRequests = async () => {
  try {
    const data = await AsyncStorage.getItem(REQUEST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};