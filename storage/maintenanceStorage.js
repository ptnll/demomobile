import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialRequests } from '../data/requests';

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

    // CHƯA CÓ DỮ LIỆU
    if (data === null) {
      await saveRequests(initialRequests);
      return initialRequests;
    }

    return JSON.parse(data);

  } catch (error) {
    console.log(error);
    return [];
  }
};