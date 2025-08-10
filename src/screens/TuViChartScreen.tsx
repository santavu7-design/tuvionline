import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Divider,
  Chip,
} from 'react-native-paper';
import { useUser } from '../contexts/UserContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { TuViChart } from '../services/TuViService';

const { width } = Dimensions.get('window');

const TuViChartScreen: React.FC = () => {
  const [tuViChart, setTuViChart] = useState<TuViChart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useUser();
  const { database } = useDatabase();

  useEffect(() => {
    if (user && database) {
      loadTuViChart();
    }
  }, [user, database]);

  const loadTuViChart = async () => {
    try {
      if (database && user) {
        const [results] = await database.executeSql(
          'SELECT chart_data FROM tuvi_chart WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
          [user.id]
        );

        if (results.rows.length > 0) {
          const chartData = JSON.parse(results.rows.item(0).chart_data);
          setTuViChart(chartData);
        }
      }
    } catch (error) {
      console.error('Error loading Tu Vi chart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStarStatusColor = (status: string) => {
    switch (status) {
      case 'V': return '#4CAF50'; // Vượng - Xanh lá
      case 'M': return '#2196F3'; // Miếu - Xanh dương
      case 'H': return '#F44336'; // Hãm - Đỏ
      case 'Đ': return '#FF9800'; // Đắc - Cam
      default: return '#666';
    }
  };

  const getStarStatusText = (status: string) => {
    switch (status) {
      case 'V': return 'Vượng';
      case 'M': return 'Miếu';
      case 'H': return 'Hãm';
      case 'Đ': return 'Đắc';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải lá số tử vi...</Text>
      </View>
    );
  }

  if (!tuViChart) {
    return (
      <View style={styles.errorContainer}>
        <Text>Không tìm thấy lá số tử vi</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Information */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.chartTitle}>LÁ SỐ TỬ VI</Title>
          <Text style={styles.name}>{tuViChart.name}</Text>
          
          <View style={styles.birthInfo}>
            <Text style={styles.birthInfoText}>
              Năm: {tuViChart.birthInfo.year} ({tuViChart.birthInfo.canChi.year})
            </Text>
            <Text style={styles.birthInfoText}>
              Tháng: {tuViChart.birthInfo.month} ({tuViChart.birthInfo.canChi.month})
            </Text>
            <Text style={styles.birthInfoText}>
              Ngày: {tuViChart.birthInfo.day} ({tuViChart.birthInfo.canChi.day})
            </Text>
            <Text style={styles.birthInfoText}>
              Giờ: {tuViChart.birthInfo.hour}h ({tuViChart.birthInfo.canChi.hour})
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.menhInfo}>
            <Text style={styles.menhInfoText}>
              <Text style={styles.label}>Mệnh:</Text> {tuViChart.birthInfo.menh}
            </Text>
            <Text style={styles.menhInfoText}>
              <Text style={styles.label}>Cục:</Text> {tuViChart.birthInfo.cuc}
            </Text>
            <Text style={styles.menhInfoText}>
              <Text style={styles.label}>Mệnh chủ:</Text> {tuViChart.birthInfo.menhChu}
            </Text>
            <Text style={styles.menhInfoText}>
              <Text style={styles.label}>Thân chủ:</Text> {tuViChart.birthInfo.thanChu}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Houses Grid */}
      <View style={styles.housesContainer}>
        <Title style={styles.housesTitle}>12 Cung Tử Vi</Title>
        
        <View style={styles.housesGrid}>
          {tuViChart.houses.map((house, index) => (
            <Card key={index} style={styles.houseCard}>
              <Card.Content style={styles.houseContent}>
                <View style={styles.houseHeader}>
                  <Text style={styles.houseName}>{house.name}</Text>
                  <Text style={styles.houseZodiac}>({house.zodiac})</Text>
                </View>
                
                <Text style={styles.houseNumber}>{house.number}</Text>
                
                <View style={styles.starsContainer}>
                  {house.stars.map((star, starIndex) => (
                    <Chip
                      key={starIndex}
                      style={[
                        styles.starChip,
                        { backgroundColor: getStarStatusColor(star.status) }
                      ]}
                      textStyle={styles.starText}
                    >
                      {star.name} ({getStarStatusText(star.status)})
                    </Chip>
                  ))}
                </View>
                
                <Text style={styles.longevityCycle}>
                  {house.longevityCycle}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>

      {/* Legend */}
      <Card style={styles.legendCard}>
        <Card.Content>
          <Title style={styles.legendTitle}>Chú thích sao:</Title>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Vượng (V) - Rất tốt</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
              <Text style={styles.legendText}>Miếu (M) - Tốt</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.legendText}>Đắc (Đ) - Khá tốt</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
              <Text style={styles.legendText}>Hãm (H) - Xấu</Text>
            </View>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    margin: 16,
    elevation: 4,
  },
  chartTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 10,
  },
  name: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  birthInfo: {
    marginBottom: 15,
  },
  birthInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  divider: {
    marginVertical: 15,
  },
  menhInfo: {
    marginBottom: 10,
  },
  menhInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  housesContainer: {
    padding: 16,
  },
  housesTitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
  },
  housesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  houseCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    elevation: 2,
  },
  houseContent: {
    padding: 8,
  },
  houseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  houseName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  houseZodiac: {
    fontSize: 12,
    color: '#666',
  },
  houseNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#6200ee',
  },
  starsContainer: {
    marginBottom: 8,
  },
  starChip: {
    marginBottom: 4,
    height: 24,
  },
  starText: {
    fontSize: 10,
    color: 'white',
  },
  longevityCycle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  legendCard: {
    margin: 16,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
});

export default TuViChartScreen;
