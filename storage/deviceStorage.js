import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialDevices } from '../data/devices';

const DEVICE_KEY = 'DEVICE_LIST';

export const saveDevices = async (devices) => {
  try {
    await AsyncStorage.setItem(
      DEVICE_KEY,
      JSON.stringify(devices)
    );
  } catch (error) {
    console.log('Lỗi lưu thiết bị:', error);
  }
};

export const getDevices = async () => {
  try {
    const data = await AsyncStorage.getItem(DEVICE_KEY);

    // CHƯA CÓ DỮ LIỆU => tự tạo dữ liệu mặc định
    if (data === null) {
      await saveDevices(initialDevices);
      return initialDevices;
    }

    return JSON.parse(data);
  } catch (error) {
    console.log('Lỗi lấy thiết bị:', error);
    return [];
  }
};

export const clearDevices = async () => {
  try {
    await AsyncStorage.removeItem(DEVICE_KEY);
  } catch (error) {
    console.log('Lỗi xoá thiết bị:', error);
  }
};