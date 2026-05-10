import { useContext } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MaintenanceContext } from '../contexts/MaintenanceContext';

export default function PhieuCuaToiScreen({ route,navigation }) {

  const { requests } = useContext(MaintenanceContext);

  const username = route.params?.username || '';

  // chỉ lấy phiếu của user hiện tại
  const myRequests = requests.filter(
    item => item.createdBy === username
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      
      <Text style={styles.device}>
        {item.device}
      </Text>

      <Text style={styles.text}>
        📍 {item.location}
      </Text>

      <Text style={styles.text}>
        🛠 {item.issue}
      </Text>

      <Text style={styles.text}>
        📅 {item.date}
      </Text>

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>
          {item.status}
        </Text>
      </View>

    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>
        Phiếu báo hỏng của tôi
      </Text>

      <FlatList
        data={myRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Bạn chưa tạo phiếu nào
          </Text>
        }
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    padding: 45,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },

  device: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },

  text: {
    fontSize: 14,
    marginBottom: 6,
    color: '#555',
  },

  statusBox: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: '#856404',
    fontWeight: 'bold',
  },

  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#777',
  },

});