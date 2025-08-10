import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  List,
  Divider,
  Avatar,
} from 'react-native-paper';
import { useUser } from '../contexts/UserContext';
import { useDatabase } from '../contexts/DatabaseContext';

const ProfileScreen: React.FC = () => {
  const { user, clearUser } = useUser();
  const { database } = useDatabase();

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
            clearUser();
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Xóa dữ liệu',
      'Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              if (database && user) {
                await database.executeSql('DELETE FROM daily_fortune WHERE user_id = ?', [user.id]);
                await database.executeSql('DELETE FROM tuvi_chart WHERE user_id = ?', [user.id]);
                await database.executeSql('DELETE FROM user_info WHERE id = ?', [user.id]);
                clearUser();
              }
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa dữ liệu.');
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text>Không tìm thấy thông tin người dùng</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* User Info */}
      <Card style={styles.userCard}>
        <Card.Content>
          <View style={styles.userHeader}>
            <Avatar.Text 
              size={80} 
              label={user.name.charAt(0).toUpperCase()} 
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Title style={styles.userName}>{user.name}</Title>
              <Text style={styles.userSubtitle}>Người dùng</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Personal Information */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Thông tin cá nhân</Title>
          
          <List.Item
            title="Họ và tên"
            description={user.name}
            left={() => <List.Icon icon="account" />}
            style={styles.listItem}
          />
          
          <List.Item
            title="Ngày sinh"
            description={new Date(user.birthDate).toLocaleDateString('vi-VN')}
            left={() => <List.Icon icon="calendar" />}
            style={styles.listItem}
          />
          
          <List.Item
            title="Giờ sinh"
            description={user.birthTime}
            left={() => <List.Icon icon="clock" />}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* App Statistics */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Thống kê sử dụng</Title>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Lá số tử vi</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Lần bói toán</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Ngày sử dụng</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Settings */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Cài đặt</Title>
          
          <List.Item
            title="Thông báo"
            description="Bật thông báo hàng ngày"
            left={() => <List.Icon icon="bell" />}
            right={() => <List.Icon icon="chevron-right" />}
            style={styles.listItem}
            onPress={() => Alert.alert('Thông báo', 'Tính năng đang phát triển')}
          />
          
          <List.Item
            title="Ngôn ngữ"
            description="Tiếng Việt"
            left={() => <List.Icon icon="translate" />}
            right={() => <List.Icon icon="chevron-right" />}
            style={styles.listItem}
            onPress={() => Alert.alert('Ngôn ngữ', 'Tính năng đang phát triển')}
          />
          
          <List.Item
            title="Chủ đề"
            description="Sáng"
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => <List.Icon icon="chevron-right" />}
            style={styles.listItem}
            onPress={() => Alert.alert('Chủ đề', 'Tính năng đang phát triển')}
          />
        </Card.Content>
      </Card>

      {/* About */}
      <Card style={styles.aboutCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Về ứng dụng</Title>
          
          <List.Item
            title="Phiên bản"
            description="1.0.0"
            left={() => <List.Icon icon="information" />}
            style={styles.listItem}
          />
          
          <List.Item
            title="Điều khoản sử dụng"
            left={() => <List.Icon icon="file-document" />}
            right={() => <List.Icon icon="chevron-right" />}
            style={styles.listItem}
            onPress={() => Alert.alert('Điều khoản', 'Tính năng đang phát triển')}
          />
          
          <List.Item
            title="Chính sách bảo mật"
            left={() => <List.Icon icon="shield" />}
            right={() => <List.Icon icon="chevron-right" />}
            style={styles.listItem}
            onPress={() => Alert.alert('Bảo mật', 'Tính năng đang phát triển')}
          />
          
          <List.Item
            title="Liên hệ hỗ trợ"
            left={() => <List.Icon icon="help-circle" />}
            right={() => <List.Icon icon="chevron-right" />}
            style={styles.listItem}
            onPress={() => Alert.alert('Hỗ trợ', 'Tính năng đang phát triển')}
          />
        </Card.Content>
      </Card>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button
          mode="outlined"
          onPress={handleClearData}
          style={styles.clearButton}
          textColor="#F44336"
        >
          Xóa dữ liệu
        </Button>
        
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor="#F44336"
        >
          Đăng xuất
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    margin: 16,
    elevation: 4,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
    backgroundColor: '#6200ee',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  listItem: {
    paddingVertical: 8,
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  settingsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  aboutCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  actionsContainer: {
    padding: 16,
    gap: 12,
  },
  clearButton: {
    borderColor: '#F44336',
  },
  logoutButton: {
    marginTop: 8,
  },
});

export default ProfileScreen;
