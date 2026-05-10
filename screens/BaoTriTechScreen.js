import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MaintenanceContext } from '../contexts/MaintenanceContext';
import SideMenu from '../components/SideMenu';

export default function BaoTriTechScreen({ navigation,route }) {
  const username = route.params?.username || '';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { requests } = useContext(MaintenanceContext);
  const maintenanceList = requests.filter(
    (item) => item.status === 'Đã duyệt' && item.technician === username
  );

  const renderCard = ({ item }) => (
    <View style={styles.card}>

      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.deviceName}>
        {item.device}
      </Text>

      <Text style={styles.infoText}>
        Mô tả lỗi: {item.issue}
      </Text>

      <Text style={styles.infoText}>
        Người báo: {item.createdBy}
      </Text>

      <Text style={styles.infoText}>
        Kỹ thuật viên: {item.technician}
      </Text>

      <TouchableOpacity
        style={styles.processBtn}
        onPress={() =>
          navigation.navigate('XuLyBaoTri', {
            request: item,
            role: 'tech',
          })
        }
      >
        <MaterialCommunityIcons
          name="tools"
          size={18}
          color="#fff"
        />

        <Text style={styles.processText}>
          Cập nhật sửa chữa
        </Text>
      </TouchableOpacity>

    </View>
  );

  return (
    <View style={styles.container}>

      <StatusBar
        backgroundColor="#b1a4f7"
        barStyle="light-content"
      />

      {/* HEADER */}
      <SafeAreaView style={{ backgroundColor: '#b1a4f7' }}>
        <View style={[ styles.header,{justifyContent: 'space-between',},]}>
          <View style={{ flexDirection: 'row', alignItems: 'center',}}>
            <MaterialCommunityIcons
              name="account-wrench"
              size={30}
              color="#fff"
            />
            <Text style={styles.headerTitle}>
              Phiếu sửa chữa
            </Text>
          </View>
          <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
            <MaterialCommunityIcons
              name="menu"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* CONTENT */}
      <View style={styles.content}>

        <FlatList
          data={maintenanceList}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 40,
          }}
          renderItem={renderCard}
          ItemSeparatorComponent={() => (
            <View style={{ height: 18 }} />
          )}
        />
      </View>
      <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} navigation={navigation} role="tech" username={username}/>
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
    marginLeft: 12,
  },

  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,

    elevation: 5,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  badgeText: {
    fontWeight: 'bold',
    fontSize: 12,
  },

  deviceImage: {
    width: '100%',
    height: 160,
    borderRadius: 15,
    resizeMode: 'contain',
    marginBottom: 15,
    backgroundColor: '#F8FAFC',
  },

  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },

  infoText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 6,
  },

  processBtn: {
    marginTop: 18,
    backgroundColor: '#b1a4f7',
    borderRadius: 12,
    height: 48,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  processText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});