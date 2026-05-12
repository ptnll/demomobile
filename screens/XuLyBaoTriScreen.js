import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaintenanceContext } from '../contexts/MaintenanceContext';

export default function XuLyBaoTriScreen({ route, navigation }) {
  const { updateRequest } = useContext(MaintenanceContext);
  const role = route.params?.role || 'admin';
  // Lấy dữ liệu truyền sang (nếu có), nếu không có thì dùng dữ liệu mẫu
  const initialRequest = route.params?.request || {
    id: '1',
    device: 'Máy tính Asus ExpertCenter (Lab 3)',
    status: 'Chờ duyệt',
    technician: '',
    note: ''
  };

  const [request, setRequest] = useState(initialRequest);
  const [repairCost, setRepairCost] = useState(initialRequest.repairCost ||'');
  const [repairResult, setRepairResult] = useState(initialRequest.repairResult ||'');
  
  // State quản lý Dropdown
  const [isTechOpen, setTechOpen] = useState(false);
  const [isStatusOpen, setStatusOpen] = useState(false);

  // Danh sách tùy chọn
  const techOptions = ['techlan','Techna10@gmail.com'];
  const statusOptions = ['Đã duyệt', 'Chờ duyệt', 'Từ chối'];

  // Hàm lấy màu sắc và icon theo trạng thái
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Chờ duyệt': return { bg: '#FDE68A', text: '#D97706', icon: 'check-circle' };
      case 'Đã duyệt': return { bg: '#E5E7EB', text: '#4B5563', icon: 'check-circle-outline' };
      case 'Hoàn thành': return { bg: '#D1FAE5', text: '#065F46', icon: 'check-all' };
      case 'Từ chối': return { bg: '#FECACA', text: '#B91C1C', icon: 'close-circle' };
      default: return { bg: '#FDE68A', text: '#D97706', icon: 'check-circle' };
    }
  };

  const currentStatusStyle = getStatusStyle(request.status);

  // Xử lý Cập nhật
  const handleUpdate = () => {
    if (
      role === 'admin' &&
      request.status === 'Đã duyệt' &&
      !request.technician
    ) {
      Alert.alert(
        'Lỗi',
        'Vui lòng chọn kỹ thuật viên'
      );
      return;
    }
    if (role === 'tech') {
      if (!repairCost || !repairResult) {
        Alert.alert(
          'Lỗi',
          'Vui lòng nhập đầy đủ thông tin sửa chữa'
        );
        return;
      }
    }
    const updatedData = {
      ...request,

      technician:
      role === 'admin'
        ? request.technician
        : request.technician,

      status:
        role == 'tech'
        ? 'Hoàn thành' : request.status,

      repairCost:
        role === 'tech'
          ? Number(repairCost)
          : request.repairCost,

      repairResult:
        role === 'tech'
          ? repairResult
          : request.repairResult,

      repairDate:
        role === 'tech'
          ? new Date().toLocaleDateString('vi-VN')
          : request.repairDate,
    };

    updateRequest(updatedData);

    Alert.alert(
      'Thành công',
      'Đã cập nhật phiếu bảo trì!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E2A47" />
      
      <SafeAreaView style={{ backgroundColor: '#b1a4f7' }}>
        {/* HEADER CÙNG LOGO */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="tools" size={24} color="#ffffff" style={{ marginRight: 10, marginTop: 10, marginLeft:30 , marginBottom: 20, fontSize: 30 }} />
            <Text style={styles.headerTitle}> Xử lý yêu cầu bảo trì </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* PHẦN NỘI DUNG FORM CHÍNH (Nền trắng) */}
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
      
          {/* ================= DROPDOWN KỸ THUẬT VIÊN ================= */}
          {role === 'admin' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phân công kỹ thuật viên</Text>
              <TouchableOpacity 
                style={[styles.dropdownBox, { backgroundColor: '#F7FAFC' }]} 
                onPress={() => setTechOpen(!isTechOpen)}
                activeOpacity={0.8}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons name="account-outline" size={20} color="#718096" style={{ marginRight: 10 }} />
                  <Text style={[styles.dropdownText, !request.technician && { color: '#A0AEC0' }]}>
                    {request.technician || '-- Chọn kỹ thuật viên --'}
                  </Text>
                </View>
                <MaterialCommunityIcons name={isTechOpen ? "chevron-up" : "chevron-down"} size={20} color="#718096" />
              </TouchableOpacity>

              {isTechOpen && (
                <View style={styles.dropdownMenuList}>
                  {techOptions.map((opt) => (
                    <TouchableOpacity 
                      key={opt} style={styles.dropdownMenuItem} 
                      onPress={() => { setRequest({...request, technician: opt}); setTechOpen(false); }}
                    >
                      <Text style={styles.dropdownMenuText}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* ================= DROPDOWN TRẠNG THÁI ================= */}

          {role === 'admin' && (
            <View style={[styles.inputGroup, { zIndex: 10 }]}>
              <Text style={styles.label}>Trạng thái</Text>

              <TouchableOpacity
                style={[
                  styles.dropdownBox,
                  {
                    backgroundColor: currentStatusStyle.bg,
                    borderColor: '#D69E2E',
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setStatusOpen(!isStatusOpen)}
                activeOpacity={0.8}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    name={currentStatusStyle.icon}
                    size={18}
                    color={currentStatusStyle.text}
                    style={{ marginRight: 8 }}
                  />

                  <Text
                    style={[
                      styles.dropdownText,
                      {
                        color: currentStatusStyle.text,
                        fontWeight: 'bold',
                      },
                    ]}
                  >
                    {request.status}
                  </Text>
                </View>

                <MaterialCommunityIcons
                  name={isStatusOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={currentStatusStyle.text}
                />
              </TouchableOpacity>

              {isStatusOpen && (
                <View
                  style={[
                    styles.dropdownMenuList,
                    {
                      position: 'absolute',
                      top: 75,
                      left: 0,
                      right: 0,
                      zIndex: 99,
                    },
                  ]}
                >
                  {statusOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={styles.dropdownMenuItem}
                      onPress={() => {
                        setRequest({
                          ...request,
                          status: opt,
                        });

                        setStatusOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownMenuText,
                          request.status === opt && {
                            fontWeight: 'bold',
                            color: '#2B6CB0',
                          },
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* ================= TECH NHẬP THÔNG TIN SỬA ================= */}

          {role === 'tech' && (
            <>
              {/* CHI PHÍ */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Chi phí sửa chữa</Text>

                <TextInput
                  style={styles.inputMoney}
                  placeholder="Nhập chi phí sửa..."
                  keyboardType="numeric"
                  value={repairCost}
                  onChangeText={setRepairCost}
                />
              </View>

              {/* KẾT QUẢ */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Kết quả sửa chữa</Text>

                <View style={styles.textAreaContainer}>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={5}
                    placeholder="Nhập kết quả sửa chữa..."
                    placeholderTextColor="#A0AEC0"
                    value={repairResult}
                    onChangeText={setRepairResult}
                    textAlignVertical="top"
                  />

                  <MaterialCommunityIcons
                    name="pencil"
                    size={18}
                    color="#A0AEC0"
                    style={styles.pencilIcon}
                  />
                </View>
              </View>

              {/* NGÀY SỬA */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ngày sửa</Text>

                <View style={styles.dateBox}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color="#666"
                  />

                  <Text style={styles.dateText}>
                    {new Date().toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              </View>

            </>
          )}

          {/* ================= NÚT BẤM ================= */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.btnUpdate} onPress={handleUpdate}>
              <MaterialCommunityIcons name="check-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.btnUpdateText}>Cập nhật</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="undo-variant" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.btnBackText}>Quay lại</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* FOOTER */}
        <View style={styles.footer}>
                <Text style={styles.footerText}>Thi cuoi ky by Ngoc Anh - Lan - Hien </Text>
                <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                  <MaterialCommunityIcons name="account-group-outline" size={16} color="#666" style={{ marginRight: 8, marginBottom: 15 }} />
                  <MaterialCommunityIcons name="link-variant" size={16} color="#666" />
                </View>
              </View>
      </View>
    </View>
  );
}

// ================= CSS STYLES =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#b1a4f7' },

  // Header & Admin Info
  header: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#b1a4f7' },
  headerTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', letterSpacing: 0.5, marginTop: -10 },
  // Content Area
  contentWrapper: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 80, paddingBottom: 30 },
  
  pageTitleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 25 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A202C', lineHeight: 32 },

  // Inputs & Dropdowns
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: 'bold', color: '#2D3748', marginBottom: 8 },
  
  dropdownBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, height: 50, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  dropdownText: { fontSize: 15, color: '#2D3748' },
  
  dropdownMenuList: { backgroundColor: '#fff', borderRadius: 8, marginTop: 5, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 4 },
  dropdownMenuItem: { paddingVertical: 14, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#EDF2F7' },
  dropdownMenuText: { fontSize: 15, color: '#2D3748' },

  // Text Area
  textAreaContainer: { backgroundColor: '#F7FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', padding: 12, height: 120 },
  textArea: { flex: 1, fontSize: 15, color: '#2D3748' },
  pencilIcon: { position: 'absolute', bottom: 10, right: 10 },

  // Buttons
  buttonGroup: { marginTop: 10 },
  btnUpdate: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#b1a4f7', paddingVertical: 14, borderRadius: 8, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  btnUpdateText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  btnBack: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#818fa5', paddingVertical: 14, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  btnBackText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  inputMoney: {
  backgroundColor: '#F7FAFC',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#E2E8F0',
  paddingHorizontal: 15,
  height: 50,
  fontSize: 15,
  },

  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 50,
    paddingHorizontal: 15,
  },

  dateText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },
  // Footer
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, backgroundColor: '#F4F5F7', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  footerText: { fontSize: 12, color: '#666', marginBottom: 15 }
});