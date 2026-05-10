import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SideMenu({
  visible,
  onClose,
  navigation,
  role,
  username,
}) {

  const handleLogout = () => {

    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',

          onPress: () => {
            onClose();
            setTimeout(() => {
                navigation.replace('Login');
            }, 200);
          },
        },
      ]
    );

  };

  const getRoleText = () => {

    switch (role) {

      case 'admin':
        return 'Quản trị viên';

      case 'tech':
        return 'Kỹ thuật viên';

      default:
        return 'Người dùng';

    }

  };

  return (

    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >

      <View style={styles.menuOverlay}>

        {/* MENU */}
        <View style={styles.sideMenu}>

          {/* HEADER */}
          <View style={styles.sideMenuHeader}>

            <Image
              source={require('../assets/avatar-placeholder.png')}
              style={styles.avatar}
            />

            <Text style={styles.name}>
              {username}
            </Text>

            <Text style={styles.role}>
              {getRoleText()}
            </Text>

          </View>

          {/* BUTTON ĐĂNG XUẤT */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
          >

            <MaterialCommunityIcons
              name="logout"
              size={24}
              color="#D9534F"
            />

            <Text style={styles.logoutText}>
              Đăng xuất
            </Text>

          </TouchableOpacity>

        </View>

        {/* BẤM NGOÀI ĐỂ TẮT */}
        <TouchableOpacity
          style={styles.closeArea}
          activeOpacity={1}
          onPress={onClose}
        />

      </View>

    </Modal>

  );

}

const styles = StyleSheet.create({

  menuOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  sideMenu: {
    width: 260,
    backgroundColor: '#fff',
    paddingTop: 50,
    justifyContent: 'space-between',
  },

  sideMenuHeader: {
    alignItems: 'center',
    paddingBottom: 30,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  role: {
    marginTop: 5,
    color: '#777',
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#EEE',
  },

  logoutText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D9534F',
  },

  closeArea: {
    flex: 1,
  },

});