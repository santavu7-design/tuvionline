import React, { useState, useEffect } from 'react';
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
  Divider,
  Chip,
  List,
} from 'react-native-paper';
import { useUser } from '../contexts/UserContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { FortuneService, DailyFortune } from '../services/FortuneService';
import { TuViChart } from '../services/TuViService';

const DailyFortuneScreen: React.FC = () => {
  const [dailyFortune, setDailyFortune] = useState<DailyFortune | null>(null);
  const [tuViChart, setTuViChart] = useState<TuViChart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { user } = useUser();
  const { database } = useDatabase();

  useEffect(() => {
    if (user && database) {
      loadTodayFortune();
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
    }
  };

  const loadTodayFortune = async () => {
    try {
      if (database && user) {
        const today = new Date().toISOString().split('T')[0];
        const [results] = await database.executeSql(
          'SELECT fortune_data FROM daily_fortune WHERE user_id = ? AND date = ? ORDER BY created_at DESC LIMIT 1',
          [user.id, today]
        );

        if (results.rows.length > 0) {
          const fortuneData = JSON.parse(results.rows.item(0).fortune_data);
          setDailyFortune(fortuneData);
        }
      }
    } catch (error) {
      console.error('Error loading daily fortune:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTodayFortune = async () => {
    if (!tuViChart) {
      Alert.alert('Lỗi', 'Không tìm thấy lá số tử vi. Vui lòng tạo lá số trước.');
      return;
    }

    setIsGenerating(true);

    try {
      const fortune = await FortuneService.generateDailyFortune(tuViChart);

      // Lưu vào database
      if (database && user) {
        await database.executeSql(
          'INSERT OR REPLACE INTO daily_fortune (user_id, date, fortune_data) VALUES (?, ?, ?)',
          [user.id, fortune.date, JSON.stringify(fortune)]
        );
      }

      setDailyFortune(fortune);
    } catch (error) {
      console.error('Error generating fortune:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tạo vận mệnh. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getLuckIcon = (luck: string) => {
    return FortuneService.getLuckIcon(luck);
  };

  const getLuckColor = (luck: string) => {
    return FortuneService.getLuckyColor(luck);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải vận mệnh hôm nay...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.headerTitle}>Vận Mệnh Hôm Nay</Title>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          
          {!dailyFortune && (
            <Button
              mode="contained"
              onPress={generateTodayFortune}
              loading={isGenerating}
              disabled={isGenerating}
              style={styles.generateButton}
            >
              Xem vận mệnh hôm nay
            </Button>
          )}
        </Card.Content>
      </Card>

      {dailyFortune && (
        <>
          {/* Overall Fortune */}
          <Card style={styles.fortuneCard}>
            <Card.Content>
              <View style={styles.overallFortune}>
                <Text style={styles.luckIcon}>{getLuckIcon(dailyFortune.overallLuck)}</Text>
                <View style={styles.luckInfo}>
                  <Title style={[styles.luckTitle, { color: getLuckColor(dailyFortune.overallLuck) }]}>
                    {dailyFortune.overallLuck}
                  </Title>
                  <Text style={styles.summary}>{dailyFortune.summary}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Details */}
          <Card style={styles.detailsCard}>
            <Card.Content>
              <Title style={styles.detailsTitle}>Chi tiết vận mệnh</Title>
              
              <List.Item
                title="Tình duyên"
                description={dailyFortune.details.love}
                left={() => <List.Icon icon="heart" />}
                style={styles.detailItem}
              />
              
              <List.Item
                title="Công việc"
                description={dailyFortune.details.career}
                left={() => <List.Icon icon="briefcase" />}
                style={styles.detailItem}
              />
              
              <List.Item
                title="Sức khỏe"
                description={dailyFortune.details.health}
                left={() => <List.Icon icon="medical-bag" />}
                style={styles.detailItem}
              />
              
              <List.Item
                title="Tài lộc"
                description={dailyFortune.details.wealth}
                left={() => <List.Icon icon="cash" />}
                style={styles.detailItem}
              />
              
              <List.Item
                title="Đi lại"
                description={dailyFortune.details.travel}
                left={() => <List.Icon icon="car" />}
                style={styles.detailItem}
              />
            </Card.Content>
          </Card>

          {/* Recommendations */}
          <Card style={styles.recommendationsCard}>
            <Card.Content>
              <Title style={styles.recommendationsTitle}>Lời khuyên</Title>
              
              <View style={styles.recommendationsSection}>
                <Text style={styles.sectionTitle}>Nên làm:</Text>
                {dailyFortune.recommendations.shouldDo.map((item, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.recommendationText}>{item}</Text>
                  </View>
                ))}
              </View>

              <Divider style={styles.divider} />

              <View style={styles.recommendationsSection}>
                <Text style={styles.sectionTitle}>Không nên làm:</Text>
                {dailyFortune.recommendations.shouldNotDo.map((item, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.recommendationText}>{item}</Text>
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Lucky Elements */}
          <Card style={styles.luckyCard}>
            <Card.Content>
              <Title style={styles.luckyTitle}>Yếu tố may mắn</Title>
              
              <View style={styles.luckyElements}>
                <Chip style={styles.luckyChip} icon="palette">
                  Màu: {dailyFortune.luckyElements.color}
                </Chip>
                <Chip style={styles.luckyChip} icon="numeric">
                  Số: {dailyFortune.luckyElements.number}
                </Chip>
                <Chip style={styles.luckyChip} icon="compass">
                  Hướng: {dailyFortune.luckyElements.direction}
                </Chip>
                <Chip style={styles.luckyChip} icon="clock">
                  Giờ: {dailyFortune.luckyElements.time}
                </Chip>
              </View>
            </Card.Content>
          </Card>

          {/* Regenerate Button */}
          <Button
            mode="outlined"
            onPress={generateTodayFortune}
            loading={isGenerating}
            disabled={isGenerating}
            style={styles.regenerateButton}
          >
            Xem lại vận mệnh
          </Button>
        </>
      )}
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
  headerCard: {
    margin: 16,
    elevation: 4,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  dateText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  generateButton: {
    marginTop: 10,
  },
  fortuneCard: {
    margin: 16,
    elevation: 4,
  },
  overallFortune: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  luckIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  luckInfo: {
    flex: 1,
  },
  luckTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  detailsCard: {
    margin: 16,
    elevation: 2,
  },
  detailsTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  detailItem: {
    paddingVertical: 8,
  },
  recommendationsCard: {
    margin: 16,
    elevation: 2,
  },
  recommendationsTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  recommendationsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    color: '#6200ee',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    marginVertical: 16,
  },
  luckyCard: {
    margin: 16,
    elevation: 2,
  },
  luckyTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  luckyElements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  luckyChip: {
    marginBottom: 8,
  },
  regenerateButton: {
    margin: 16,
    marginTop: 8,
  },
});

export default DailyFortuneScreen;
