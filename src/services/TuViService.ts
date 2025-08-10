import moment from 'moment';

export interface BirthInfo {
  name: string;
  birthDate: string;
  birthTime: string;
}

export interface TuViChart {
  name: string;
  birthInfo: {
    year: number;
    month: number;
    day: number;
    hour: number;
    canChi: {
      year: string;
      month: string;
      day: string;
      hour: string;
    };
    menh: string;
    cuc: string;
    menhChu: string;
    thanChu: string;
  };
  houses: TuViHouse[];
}

export interface TuViHouse {
  name: string;
  zodiac: string;
  number: number;
  stars: TuViStar[];
  longevityCycle: string;
}

export interface TuViStar {
  name: string;
  status: 'V' | 'M' | 'H' | 'Đ'; // Vượng, Miếu, Hãm, Đắc
  description?: string;
}

export class TuViService {
  private static readonly CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  private static readonly CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  private static readonly NGU_HANH = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];

  static calculateCanChi(date: Date): { can: string; chi: string } {
    const year = date.getFullYear();
    const canIndex = (year - 4) % 10;
    const chiIndex = (year - 4) % 12;
    
    return {
      can: this.CAN[canIndex],
      chi: this.CHI[chiIndex]
    };
  }

  static calculateHourCanChi(date: Date): string {
    const hour = date.getHours();
    const dayCan = this.calculateCanChi(date).can;
    const canIndex = this.CAN.indexOf(dayCan);
    
    // Tính can của giờ dựa trên can của ngày
    const hourCanIndex = (canIndex * 2 + Math.floor(hour / 2)) % 10;
    const hourChiIndex = Math.floor((hour + 1) / 2) % 12;
    
    return `${this.CAN[hourCanIndex]} ${this.CHI[hourChiIndex]}`;
  }

  static calculateMenh(canChi: { year: string; month: string; day: string; hour: string }): string {
    // Logic tính mệnh dựa trên can chi năm sinh
    const yearCan = canChi.year.split(' ')[0];
    const yearChi = canChi.year.split(' ')[1];
    
    const menhMap: { [key: string]: string } = {
      'Giáp Tý': 'Hải Trung Kim',
      'Ất Sửu': 'Hải Trung Kim',
      'Bính Dần': 'Lư Trung Hỏa',
      'Đinh Mão': 'Lư Trung Hỏa',
      'Mậu Thìn': 'Đại Lâm Mộc',
      'Kỷ Tỵ': 'Đại Lâm Mộc',
      'Canh Ngọ': 'Lộ Bàng Thổ',
      'Tân Mùi': 'Lộ Bàng Thổ',
      'Nhâm Thân': 'Kiếm Phong Kim',
      'Quý Dậu': 'Kiếm Phong Kim',
      'Giáp Tuất': 'Sơn Đầu Hỏa',
      'Ất Hợi': 'Sơn Đầu Hỏa',
      'Bính Tý': 'Giản Hạ Thủy',
      'Đinh Sửu': 'Giản Hạ Thủy',
      'Mậu Dần': 'Thành Đầu Thổ',
      'Kỷ Mão': 'Thành Đầu Thổ',
      'Canh Thìn': 'Bạch Lạp Kim',
      'Tân Tỵ': 'Bạch Lạp Kim',
      'Nhâm Ngọ': 'Dương Liễu Mộc',
      'Quý Mùi': 'Dương Liễu Mộc',
      'Giáp Thân': 'Tuyền Trung Thủy',
      'Ất Dậu': 'Tuyền Trung Thủy',
      'Bính Tuất': 'Ốc Thượng Thổ',
      'Đinh Hợi': 'Ốc Thượng Thổ',
      'Mậu Tý': 'Tích Lịch Hỏa',
      'Kỷ Sửu': 'Tích Lịch Hỏa',
      'Canh Dần': 'Tùng Bách Mộc',
      'Tân Mão': 'Tùng Bách Mộc',
      'Nhâm Thìn': 'Trường Lưu Thủy',
      'Quý Tỵ': 'Trường Lưu Thủy',
      'Giáp Ngọ': 'Sa Trung Kim',
      'Ất Mùi': 'Sa Trung Kim',
      'Bính Thân': 'Sơn Hạ Hỏa',
      'Đinh Dậu': 'Sơn Hạ Hỏa',
      'Mậu Tuất': 'Bình Địa Mộc',
      'Kỷ Hợi': 'Bình Địa Mộc',
      'Canh Tý': 'Bích Thượng Thổ',
      'Tân Sửu': 'Bích Thượng Thổ',
      'Nhâm Dần': 'Kim Bạch Kim',
      'Quý Mão': 'Kim Bạch Kim',
      'Giáp Thìn': 'Phú Đăng Hỏa',
      'Ất Tỵ': 'Phú Đăng Hỏa',
      'Bính Ngọ': 'Thiên Hà Thủy',
      'Đinh Mùi': 'Thiên Hà Thủy',
      'Mậu Thân': 'Đại Trạch Thổ',
      'Kỷ Dậu': 'Đại Trạch Thổ',
      'Canh Tuất': 'Thoa Xuyến Kim',
      'Tân Hợi': 'Thoa Xuyến Kim',
      'Nhâm Tý': 'Tang Đố Mộc',
      'Quý Sửu': 'Tang Đố Mộc',
      'Giáp Dần': 'Đại Khê Thủy',
      'Ất Mão': 'Đại Khê Thủy',
      'Bính Thìn': 'Sa Trung Thổ',
      'Đinh Tỵ': 'Sa Trung Thổ',
      'Mậu Ngọ': 'Thiên Thượng Hỏa',
      'Kỷ Mùi': 'Thiên Thượng Hỏa',
      'Canh Thân': 'Thạch Lựu Mộc',
      'Tân Dậu': 'Thạch Lựu Mộc',
      'Nhâm Tuất': 'Đại Hải Thủy',
      'Quý Hợi': 'Đại Hải Thủy'
    };

    const key = `${yearCan} ${yearChi}`;
    return menhMap[key] || 'Không xác định';
  }

  static calculateCuc(menh: string): string {
    // Logic tính cục dựa trên mệnh
    const cucMap: { [key: string]: string } = {
      'Hải Trung Kim': 'Hỏa Lục Cục',
      'Lư Trung Hỏa': 'Thổ Ngũ Cục',
      'Đại Lâm Mộc': 'Thủy Nhị Cục',
      'Lộ Bàng Thổ': 'Kim Tứ Cục',
      'Kiếm Phong Kim': 'Hỏa Lục Cục',
      'Sơn Đầu Hỏa': 'Thổ Ngũ Cục',
      'Giản Hạ Thủy': 'Mộc Tam Cục',
      'Thành Đầu Thổ': 'Kim Tứ Cục',
      'Bạch Lạp Kim': 'Hỏa Lục Cục',
      'Dương Liễu Mộc': 'Thủy Nhị Cục',
      'Tuyền Trung Thủy': 'Mộc Tam Cục',
      'Ốc Thượng Thổ': 'Kim Tứ Cục',
      'Tích Lịch Hỏa': 'Thổ Ngũ Cục',
      'Tùng Bách Mộc': 'Thủy Nhị Cục',
      'Trường Lưu Thủy': 'Mộc Tam Cục',
      'Sa Trung Kim': 'Hỏa Lục Cục',
      'Sơn Hạ Hỏa': 'Thổ Ngũ Cục',
      'Bình Địa Mộc': 'Thủy Nhị Cục',
      'Bích Thượng Thổ': 'Kim Tứ Cục',
      'Kim Bạch Kim': 'Hỏa Lục Cục',
      'Phú Đăng Hỏa': 'Thổ Ngũ Cục',
      'Thiên Hà Thủy': 'Mộc Tam Cục',
      'Đại Trạch Thổ': 'Kim Tứ Cục',
      'Thoa Xuyến Kim': 'Hỏa Lục Cục',
      'Tang Đố Mộc': 'Thủy Nhị Cục',
      'Đại Khê Thủy': 'Mộc Tam Cục',
      'Sa Trung Thổ': 'Kim Tứ Cục',
      'Thiên Thượng Hỏa': 'Thổ Ngũ Cục',
      'Thạch Lựu Mộc': 'Thủy Nhị Cục',
      'Đại Hải Thủy': 'Hỏa Lục Cục'
    };

    return cucMap[menh] || 'Không xác định';
  }

  static generateTuViChart(birthInfo: BirthInfo): TuViChart {
    const birthDate = new Date(birthInfo.birthDate + ' ' + birthInfo.birthTime);
    const yearCanChi = this.calculateCanChi(birthDate);
    const hourCanChi = this.calculateHourCanChi(birthDate);
    
    const canChi = {
      year: `${yearCanChi.can} ${yearCanChi.chi}`,
      month: `${yearCanChi.can} ${yearCanChi.chi}`, // Simplified
      day: `${yearCanChi.can} ${yearCanChi.chi}`, // Simplified
      hour: hourCanChi
    };

    const menh = this.calculateMenh(canChi);
    const cuc = this.calculateCuc(menh);

    const houses = this.generateHouses(canChi, menh, cuc);

    return {
      name: birthInfo.name,
      birthInfo: {
        year: birthDate.getFullYear(),
        month: birthDate.getMonth() + 1,
        day: birthDate.getDate(),
        hour: birthDate.getHours(),
        canChi,
        menh,
        cuc,
        menhChu: 'Văn Khúc', // Default values
        thanChu: 'Thiên Đồng'
      },
      houses
    };
  }

  private static generateHouses(canChi: any, menh: string, cuc: string): TuViHouse[] {
    const houseNames = [
      'MỆNH', 'PHỤ MẪU', 'PHÚC ĐỨC', 'ĐIỀN TRẠCH', 'QUAN LỘC', 'NÔ BỘC',
      'THIÊN DI', 'TẬT ÁCH', 'TÀI BẠCH', 'TỬ TỨC', 'HUYNH ĐỆ', 'PHU THÊ'
    ];

    const zodiacOrder = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

    return houseNames.map((name, index) => {
      const zodiac = zodiacOrder[index];
      const number = 6 + (index * 10);
      
      return {
        name,
        zodiac,
        number,
        stars: this.generateStarsForHouse(name, canChi, menh),
        longevityCycle: this.getLongevityCycle(index)
      };
    });
  }

  private static generateStarsForHouse(houseName: string, canChi: any, menh: string): TuViStar[] {
    // Simplified star generation logic
    const starMap: { [key: string]: TuViStar[] } = {
      'MỆNH': [
        { name: 'Thân', status: 'M' },
        { name: 'Bạch Hổ', status: 'H' },
        { name: 'Thiên Khốc', status: 'Đ' }
      ],
      'PHỤ MẪU': [
        { name: 'Phá Quân', status: 'H' },
        { name: 'Hóa Lộc', status: 'Đ' },
        { name: 'Phúc Đức', status: 'Đ' }
      ],
      'PHÚC ĐỨC': [
        { name: 'Tiểu Hao', status: 'Đ' },
        { name: 'Điếu Khách', status: 'M' }
      ],
      'ĐIỀN TRẠCH': [
        { name: 'Liêm Trinh', status: 'M' },
        { name: 'Thiên Phủ', status: 'V' }
      ],
      'QUAN LỘC': [
        { name: 'Thái Âm', status: 'M' },
        { name: 'Hữu Bật', status: 'Đ' }
      ],
      'NÔ BỘC': [
        { name: 'Tham Lang', status: 'H' },
        { name: 'Thiên Không', status: 'Đ' }
      ],
      'THIÊN DI': [
        { name: 'Thiên Đồng', status: 'H' },
        { name: 'Cự Môn', status: 'H' }
      ],
      'TẬT ÁCH': [
        { name: 'Vũ Khúc', status: 'V' },
        { name: 'Thiên Tướng', status: 'M' }
      ],
      'TÀI BẠCH': [
        { name: 'Thái Dương', status: 'V' },
        { name: 'Thiên Lương', status: 'V' }
      ],
      'TỬ TỨC': [
        { name: 'Thất Sát', status: 'H' },
        { name: 'Văn Xương', status: 'H' }
      ],
      'HUYNH ĐỆ': [
        { name: 'Tử Vi', status: 'M' },
        { name: 'Long Đức', status: 'Đ' }
      ],
      'PHU THÊ': [
        { name: 'Thiên Cơ', status: 'V' },
        { name: 'Thiên Việt', status: 'Đ' }
      ]
    };

    return starMap[houseName] || [];
  }

  private static getLongevityCycle(index: number): string {
    const cycles = ['Tuyệt', 'Mộ', 'Tử', 'Suy', 'Đế vượng', 'Lâm quan', 'Quan đới', 'Mộc dục', 'Tràng sinh', 'Dưỡng', 'Thai', 'Trường sinh'];
    return cycles[index] || 'Không xác định';
  }
}
