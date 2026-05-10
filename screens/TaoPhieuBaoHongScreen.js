import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';

import { MaintenanceContext } from '../contexts/MaintenanceContext';
import { getDevices } from '../storage/deviceStorage';
import SideMenu from '../components/SideMenu';

export default function TaoPhieuBaoHongScreen({
  navigation,
  route,
}) {

  const username =
    route.params?.username || 'user';

  const { addRequest } =
    useContext(MaintenanceContext);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
  // DANH SÁCH THIẾT BỊ
  const [devices, setDevices] = useState([]);

  // DANH SÁCH PHÒNG
  const [rooms, setRooms] = useState([]);

  // PHÒNG ĐƯỢC CHỌN
  const [selectedRoom, setSelectedRoom] =
    useState('');

  // THIẾT BỊ ĐƯỢC CHỌN
  const [selectedDevice, setSelectedDevice] =
    useState(null);

  // DANH SÁCH THIẾT BỊ THEO PHÒNG
  const [filteredDevices, setFilteredDevices] =
    useState([]);

  // MÔ TẢ LỖI
  const [description, setDescription] =
    useState('');

  // DROPDOWN
  const [roomOpen, setRoomOpen] =
    useState(false);

  const [deviceOpen, setDeviceOpen] =
    useState(false);

  // LOAD DEVICE
  useEffect(() => {

    loadDevices();

  }, []);

  const loadDevices = async () => {

    const data = await getDevices();

    setDevices(data);

    // LẤY PHÒNG KHÔNG TRÙNG
    const uniqueRooms = [
      ...new Set(
        data.map(item => item.room)
      ),
    ];

    setRooms(uniqueRooms);
  };

  // CHỌN PHÒNG
  const handleSelectRoom = (room) => {

    setSelectedRoom(room);

    setRoomOpen(false);

    // RESET THIẾT BỊ
    setSelectedDevice(null);

    // LỌC THIẾT BỊ THEO PHÒNG
    const filtered = devices.filter(
      item => item.room === room
    );

    setFilteredDevices(filtered);
  };

  // GỬI PHIẾU
  const handleSubmit = async () => {

    if (
      !selectedRoom ||
      !selectedDevice ||
      !description.trim()
    ) {
      Alert.alert(
        'Lỗi',
        'Vui lòng nhập đầy đủ thông tin'
      );
      return;
    }

    const newRequest = {

      date:
        new Date().toLocaleDateString('vi-VN'),

      device: selectedDevice.name,

      deviceId: selectedDevice.id,

      location: selectedRoom,

      serial: selectedDevice.serial,

      type: selectedDevice.type,

      issue: description,

      status: 'Chờ duyệt',

      technician: '',

      repairCost: 0,

      repairResult: '',

      repairDate: '',

      createdBy: username,

      imageSource:
        require('../assets/pc.png'),
    };

    await addRequest(newRequest);

    Alert.alert(
      'Thành công',
      'Đã gửi phiếu báo hỏng!'
    );

    // RESET
    setSelectedRoom('');

    setSelectedDevice(null);

    setFilteredDevices([]);

    setDescription('');
  };

  return (
    <View style={styles.container}>

      <StatusBar
        barStyle="light-content"
        backgroundColor="#b1a4f7"
      />

      <SafeAreaView
        style={{ backgroundColor: '#b1a4f7' }}
      >

        <View style={[styles.header,{
          justifyContent:'space-between'
        }]}>
          
          <View style={{
            flexDirection:'row',
            alignItems:'center'
          }}>
            <MaterialCommunityIcons
              name="tools"
              size={30}
              color="#fff"
            />

            <Text style={styles.headerTitle}>
              Tạo phiếu báo hỏng
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setIsMenuOpen(true)}
          >
            <MaterialCommunityIcons
              name="menu"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>

        </View>

      </SafeAreaView>

      <View style={styles.content}>

        <ScrollView
          showsVerticalScrollIndicator={false}
        >

          {/* ===== CHỌN PHÒNG ===== */}

          <View style={styles.inputGroup}>

            <Text style={styles.label}>
              Chọn phòng
            </Text>

            <TouchableOpacity
              style={styles.dropdown}
              onPress={() =>
                setRoomOpen(!roomOpen)
              }
            >

              <Text>
                {selectedRoom ||
                  'Chọn phòng'}
              </Text>

              <MaterialCommunityIcons
                name={
                  roomOpen
                    ? 'chevron-up'
                    : 'chevron-down'
                }
                size={20}
                color="#555"
              />

            </TouchableOpacity>

            {roomOpen && (

              <View style={styles.dropdownMenu}>

                {rooms.map(room => (

                  <TouchableOpacity
                    key={room}
                    style={styles.dropdownItem}
                    onPress={() =>
                      handleSelectRoom(room)
                    }
                  >

                    <Text>{room}</Text>

                  </TouchableOpacity>

                ))}

              </View>

            )}

          </View>

          {/* ===== CHỌN THIẾT BỊ ===== */}

          <View style={styles.inputGroup}>

            <Text style={styles.label}>
              Chọn thiết bị
            </Text>

            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => {

                if (!selectedRoom) {

                  Alert.alert(
                    'Thông báo',
                    'Vui lòng chọn phòng trước'
                  );

                  return;
                }

                setDeviceOpen(!deviceOpen);
              }}
            >

              <Text>

                {selectedDevice
                  ? selectedDevice.name
                  : 'Chọn thiết bị'}

              </Text>

              <MaterialCommunityIcons
                name={
                  deviceOpen
                    ? 'chevron-up'
                    : 'chevron-down'
                }
                size={20}
                color="#555"
              />

            </TouchableOpacity>

            {deviceOpen && (

              <View style={styles.dropdownMenu}>

                {filteredDevices.map(item => (

                  <TouchableOpacity
                    key={item.id}
                    style={styles.dropdownItem}
                    onPress={() => {

                      setSelectedDevice(item);

                      setDeviceOpen(false);

                    }}
                  >

                    <Text
                      style={{
                        fontWeight: '600',
                      }}
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={{
                        color: '#777',
                        fontSize: 12,
                      }}
                    >
                      Serial: {item.serial}
                    </Text>

                  </TouchableOpacity>

                ))}

              </View>

            )}

          </View>

          {/* ===== MÔ TẢ ===== */}

          <View style={styles.inputGroup}>

            <Text style={styles.label}>
              Mô tả sự cố
            </Text>

            <TextInput
              style={styles.textArea}
              placeholder="Mô tả lỗi thiết bị..."
              multiline
              numberOfLines={5}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />

          </View>

          {/* ===== BUTTON ===== */}

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
          >

            <MaterialCommunityIcons
              name="send"
              size={20}
              color="#fff"
            />

            <Text style={styles.submitText}>
              Gửi phiếu báo hỏng
            </Text>

          </TouchableOpacity>

        </ScrollView>

      </View>
    <SideMenu
              visible={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              navigation={navigation}
              role="user"
              username={username}
            />  
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#b1a4f7',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  inputGroup: {
    marginBottom: 20,
    zIndex: 10,
  },

  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },

  textArea: {
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    padding: 15,
    height: 120,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  submitBtn: {
    backgroundColor: '#b1a4f7',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },

  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

});