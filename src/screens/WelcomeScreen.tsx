import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { useUser } from '../contexts/UserContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { TuViService, BirthInfo } from '../services/TuViService';

const WelcomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [birthTime, setBirthTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useUser();
  const { database } = useDatabase();

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên của bạn');
      return;
    }

    setIsLoading(true);

    try {
      // Tạo thông tin sinh
      const birthInfo: BirthInfo = {
        name: name.trim(),
        birthDate: birthDate.toISOString().split('T')[0],
        birthTime: birthTime.toTimeString().split(' ')[0],
      };

      // Tạo lá số tử vi
      const tuViChart = TuViService.generateTuViChart(birthInfo);

      // Lưu vào database
      if (database) {
        // Lưu thông tin người dùng
        const [userResult] = await database.executeSql(
          'INSERT INTO user_info (name, birth_date, birth_time) VALUES (?, ?, ?)',
          [birthInfo.name, birthInfo.birthDate, birthInfo.birthTime]
        );

        const userId = userResult.insertId;

        // Lưu lá số tử vi
        await database.executeSql(
          'INSERT INTO tuvi_chart (user_id, chart_data) VALUES (?, ?)',
          [userId, JSON.stringify(tuViChart)]
        );

        // Cập nhật context
        setUser({
          id: userId,
          name: birthInfo.name,
          birthDate: birthInfo.birthDate,
          birthTime: birthInfo.birthTime,
        });

        // Chuyển đến màn hình chính
        navigation.replace('Main');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>🔮 Tử Vi Fortune</Text>
          <Text style={styles.subtitle}>
            Khám phá vận mệnh của bạn qua khoa học tử vi
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Thông tin cá nhân</Title>
            <Paragraph style={styles.cardDescription}>
              Vui lòng nhập thông tin chính xác để có kết quả bói toán chính xác nhất
            </Paragraph>

            <TextInput
              label="Họ và tên"
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
            />

            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              Ngày sinh: {birthDate.toLocaleDateString('vi-VN')}
            </Button>

            <Button
              mode="outlined"
              onPress={() => setShowTimePicker(true)}
              style={styles.dateButton}
            >
              Giờ sinh: {birthTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </Button>

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading || !name.trim()}
              style={styles.submitButton}
            >
              Tạo lá số tử vi
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Tính năng chính:</Text>
          <Text style={styles.feature}>• Lá số tử vi chi tiết</Text>
          <Text style={styles.feature}>• Bói toán hàng ngày</Text>
          <Text style={styles.feature}>• Dự đoán vận mệnh</Text>
          <Text style={styles.feature}>• Lời khuyên phong thủy</Text>
        </View>
      </ScrollView>

      <DatePicker
        modal
        open={showDatePicker}
        date={birthDate}
        mode="date"
        onConfirm={(date) => {
          setShowDatePicker(false);
          setBirthDate(date);
        }}
        onCancel={() => setShowDatePicker(false)}
        maximumDate={new Date()}
      />

      <DatePicker
        modal
        open={showTimePicker}
        date={birthTime}
        mode="time"
        onConfirm={(time) => {
          setShowTimePicker(false);
          setBirthTime(time);
        }}
        onCancel={() => setShowTimePicker(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  cardDescription: {
    marginBottom: 20,
    color: '#666',
  },
  input: {
    marginBottom: 15,
  },
  dateButton: {
    marginBottom: 15,
  },
  submitButton: {
    marginTop: 10,
    paddingVertical: 8,
  },
  features: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  feature: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
});

export default WelcomeScreen;
