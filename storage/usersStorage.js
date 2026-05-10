import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'USER_LIST';

const defaultUsers = [
  {
    username: 'adminlan',
    password: 'lan01012026',
    role: 'admin',
  },
  {
    username: 'techlan',
    password: 'lan02022026',
    role: 'tech',
  },
  {
    username: 'userlan',
    password: 'lan03032026',
    role: 'user',
  },
];

export const getUsers = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_KEY);

    if (data === null) {
      await AsyncStorage.setItem(
        USER_KEY,
        JSON.stringify(defaultUsers)
      );

      return defaultUsers;
    }

    return JSON.parse(data);

  } catch (error) {
    console.log(error);
    return [];
  }
};