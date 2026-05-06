import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function IntroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground 
        source={require('../assets/ob.png')} 
        style={styles.background}
        resizeMode="cover" 
      >
  
        <View style={styles.overlay}>

          {/* NỘI DUNG CHỮ (ĐƯỢC CĂN CHÍNH GIỮA BỨC ẢNH) */}
          <View style={styles.content}>
            <Text style={styles.title}>CorpEquip Manager</Text>
            <Text style={styles.subtitle}>
              Giải pháp toàn diện giúp doanh nghiệp theo dõi, bảo trì và quản lý thiết bị một cách hiệu quả và dễ dàng nhất.
            </Text>
          </View>

          {/* NÚT BẮT ĐẦU Ở DƯỚI CÙNG */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.btnStart} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.btnStartText}>Bắt đầu ngay</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
    </View>
  );
}

// ================= CSS STYLES =================
const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  background: { 
    flex: 1, 
    width: '100%', 
    height: '100%' 
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Phủ lớp đen mờ 45% (Bạn có thể tăng giảm số 0.45 để chỉnh độ tối)
    justifyContent: 'space-between',
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', // Lệnh này giúp kéo toàn bộ chữ vào chính giữa màn hình (giữa bức ảnh)
    alignItems: 'center', 
    paddingHorizontal: 30 
  },
  title: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    color: '#ffffff', // Đổi chữ thành màu trắng
    marginBottom: 15, 
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)', // Thêm bóng đổ chữ cho xịn xò
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5
  },
  subtitle: { 
    fontSize: 16, 
    color: '#f3ebeb', 
    textAlign: 'center', 
    lineHeight: 25 
  },
  footer: { 
    paddingHorizontal: 30, 
    paddingBottom: 50 // Đẩy nút lên một chút cho cách xa viền màn hình dưới
  },
  btnStart: { 
    flexDirection: 'row', 
    backgroundColor: '#4dbec2', 
    paddingVertical: 16, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 5,
    marginBottom: 30
  },
  btnStartText: { 
    color: '#ebeff0', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginRight: 10 
  },
});