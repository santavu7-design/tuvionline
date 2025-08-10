import { TuViChart } from './TuViService';
import moment from 'moment';

export interface DailyFortune {
  date: string;
  overallLuck: 'Rất Tốt' | 'Tốt' | 'Bình Thường' | 'Xấu' | 'Rất Xấu';
  summary: string;
  details: {
    love: string;
    career: string;
    health: string;
    wealth: string;
    travel: string;
  };
  recommendations: {
    shouldDo: string[];
    shouldNotDo: string[];
  };
  luckyElements: {
    color: string;
    number: string;
    direction: string;
    time: string;
  };
}

export class FortuneService {
  static async generateDailyFortune(tuViChart: TuViChart, targetDate: string = new Date().toISOString().split('T')[0]): Promise<DailyFortune> {
    // Tính toán can chi của ngày hôm nay
    const todayDate = new Date(targetDate);
    const todayCanChi = this.calculateDailyCanChi(todayDate);
    
    // Tạo prompt cho LLM
    const prompt = this.createFortunePrompt(tuViChart, todayCanChi, targetDate);
    
    // Gọi LLM để phân tích (trong thực tế sẽ gọi API)
    const fortuneData = await this.callLLMForFortune(prompt);
    
    return fortuneData;
  }

  private static calculateDailyCanChi(date: Date): { can: string; chi: string } {
    // Logic tính can chi của ngày
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Simplified calculation - in real implementation, this would be more complex
    const canIndex = (year + month + day) % 10;
    const chiIndex = (year + month + day) % 12;
    
    const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
    const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
    
    return {
      can: CAN[canIndex],
      chi: CHI[chiIndex]
    };
  }

  private static createFortunePrompt(tuViChart: TuViChart, todayCanChi: { can: string; chi: string }, date: string): string {
    return `
    Dựa trên lá số tử vi của ${tuViChart.name} và thông tin ngày ${date} (${todayCanChi.can} ${todayCanChi.chi}), 
    hãy phân tích vận mệnh ngày hôm nay và đưa ra dự đoán chi tiết.

    Thông tin lá số:
    - Mệnh: ${tuViChart.birthInfo.menh}
    - Cục: ${tuViChart.birthInfo.cuc}
    - Mệnh chủ: ${tuViChart.birthInfo.menhChu}
    - Thân chủ: ${tuViChart.birthInfo.thanChu}

    Các cung trong lá số:
    ${tuViChart.houses.map(house => 
      `- ${house.name} (${house.zodiac}): ${house.stars.map(star => `${star.name}(${star.status})`).join(', ')}`
    ).join('\n')}

    Ngày hôm nay: ${date} (${todayCanChi.can} ${todayCanChi.chi})

    Hãy phân tích và trả về kết quả theo format JSON sau:
    {
      "overallLuck": "Rất Tốt|Tốt|Bình Thường|Xấu|Rất Xấu",
      "summary": "Tóm tắt ngắn gọn về vận mệnh ngày hôm nay",
      "details": {
        "love": "Phân tích về tình duyên",
        "career": "Phân tích về công việc",
        "health": "Phân tích về sức khỏe",
        "wealth": "Phân tích về tài lộc",
        "travel": "Phân tích về đi lại"
      },
      "recommendations": {
        "shouldDo": ["Việc nên làm 1", "Việc nên làm 2"],
        "shouldNotDo": ["Việc không nên làm 1", "Việc không nên làm 2"]
      },
      "luckyElements": {
        "color": "Màu may mắn",
        "number": "Số may mắn",
        "direction": "Hướng may mắn",
        "time": "Giờ may mắn"
      }
    }
    `;
  }

  private static async callLLMForFortune(prompt: string): Promise<DailyFortune> {
    // Trong thực tế, đây sẽ là API call đến LLM service
    // Hiện tại sẽ trả về dữ liệu mẫu
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response - trong thực tế sẽ parse từ LLM response
    const mockResponse = {
      overallLuck: 'Tốt' as const,
      summary: 'Hôm nay là một ngày khá thuận lợi cho bạn. Các sao tốt đang chiếu mệnh, đặc biệt là trong lĩnh vực công việc và tài chính.',
      details: {
        love: 'Tình duyên có dấu hiệu tích cực. Nếu đang độc thân, có thể gặp người thú vị. Nếu đã có người yêu, mối quan hệ sẽ thêm gắn kết.',
        career: 'Công việc thuận lợi, có thể nhận được tin tốt hoặc cơ hội mới. Nên chủ động trong các cuộc họp và đàm phán.',
        health: 'Sức khỏe ổn định, nhưng nên chú ý đến chế độ ăn uống và nghỉ ngơi hợp lý.',
        wealth: 'Tài lộc khá tốt, có thể có khoản thu nhập bất ngờ hoặc cơ hội đầu tư tốt.',
        travel: 'Đi lại thuận lợi, có thể đi xa mà không gặp trở ngại lớn.'
      },
      recommendations: {
        shouldDo: [
          'Tập trung vào công việc quan trọng',
          'Gặp gỡ bạn bè và đối tác',
          'Đầu tư hoặc tiết kiệm tiền',
          'Tập thể dục nhẹ nhàng'
        ],
        shouldNotDo: [
          'Đưa ra quyết định vội vàng',
          'Tranh cãi với người khác',
          'Tiêu tiền hoang phí',
          'Làm việc quá sức'
        ]
      },
      luckyElements: {
        color: 'Xanh lá cây, Vàng',
        number: '3, 7, 9',
        direction: 'Đông Nam, Nam',
        time: '9h-11h, 15h-17h'
      }
    };

    return {
      date: new Date().toISOString().split('T')[0],
      ...mockResponse
    };
  }

  static getLuckyColor(overallLuck: string): string {
    const colorMap = {
      'Rất Tốt': '#4CAF50',
      'Tốt': '#8BC34A',
      'Bình Thường': '#FFC107',
      'Xấu': '#FF9800',
      'Rất Xấu': '#F44336'
    };
    return colorMap[overallLuck] || '#FFC107';
  }

  static getLuckIcon(overallLuck: string): string {
    const iconMap = {
      'Rất Tốt': '🌟',
      'Tốt': '⭐',
      'Bình Thường': '⚪',
      'Xấu': '⚠️',
      'Rất Xấu': '💥'
    };
    return iconMap[overallLuck] || '⚪';
  }
}
