import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  List,
} from 'react-native-paper';

const ServicesScreen: React.FC = () => {
  const services = [
    {
      id: 1,
      title: 'Bói toán hàng ngày',
      description: 'Xem vận mệnh ngày hôm nay dựa trên lá số tử vi của bạn',
      icon: '📅',
      status: 'available',
    },
    {
      id: 2,
      title: 'Bói toán tuần',
      description: 'Dự đoán vận mệnh trong tuần tới',
      icon: '📊',
      status: 'coming_soon',
    },
    {
      id: 3,
      title: 'Bói toán tháng',
      description: 'Phân tích vận mệnh theo tháng',
      icon: '📈',
      status: 'coming_soon',
    },
    {
      id: 4,
      title: 'Bói toán năm',
      description: 'Dự đoán vận mệnh cả năm',
      icon: '🎯',
      status: 'coming_soon',
    },
    {
      id: 5,
      title: 'Bói toán tình duyên',
      description: 'Phân tích về tình duyên và hôn nhân',
      icon: '💕',
      status: 'coming_soon',
    },
    {
      id: 6,
      title: 'Bói toán sự nghiệp',
      description: 'Dự đoán về công việc và sự nghiệp',
      icon: '💼',
      status: 'coming_soon',
    },
    {
      id: 7,
      title: 'Bói toán tài lộc',
      description: 'Phân tích về tài chính và đầu tư',
      icon: '💰',
      status: 'coming_soon',
    },
    {
      id: 8,
      title: 'Bói toán sức khỏe',
      description: 'Dự đoán về sức khỏe và bệnh tật',
      icon: '🏥',
      status: 'coming_soon',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#4CAF50';
      case 'coming_soon':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Có sẵn';
      case 'coming_soon':
        return 'Sắp ra mắt';
      default:
        return 'Không khả dụng';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dịch vụ bói toán</Text>
        <Text style={styles.headerSubtitle}>
          Khám phá các dịch vụ bói toán tử vi chuyên nghiệp
        </Text>
      </View>

      <View style={styles.servicesContainer}>
        {services.map((service) => (
          <Card key={service.id} style={styles.serviceCard}>
            <Card.Content>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceIcon}>{service.icon}</Text>
                <View style={styles.serviceInfo}>
                  <Title style={styles.serviceTitle}>{service.title}</Title>
                  <Paragraph style={styles.serviceDescription}>
                    {service.description}
                  </Paragraph>
                </View>
              </View>
              
              <View style={styles.serviceFooter}>
                <Text style={[
                  styles.statusText,
                  { color: getStatusColor(service.status) }
                ]}>
                  {getStatusText(service.status)}
                </Text>
                
                {service.status === 'available' && (
                  <Button
                    mode="contained"
                    compact
                    style={styles.useButton}
                  >
                    Sử dụng
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.infoTitle}>Về dịch vụ bói toán</Title>
          <Paragraph style={styles.infoText}>
            Ứng dụng sử dụng công nghệ AI tiên tiến kết hợp với khoa học tử vi 
            truyền thống để đưa ra những dự đoán chính xác về vận mệnh của bạn.
          </Paragraph>
          <Paragraph style={styles.infoText}>
            Các dịch vụ sẽ được cập nhật thường xuyên để mang đến trải nghiệm 
            bói toán tốt nhất cho người dùng.
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  servicesContainer: {
    padding: 16,
  },
  serviceCard: {
    marginBottom: 16,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  serviceIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  useButton: {
    borderRadius: 20,
  },
  infoCard: {
    margin: 16,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    marginBottom: 12,
  },
});

export default ServicesScreen;
