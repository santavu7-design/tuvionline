import React, { createContext, useContext, useEffect, useState } from 'react';
import SQLite from 'react-native-sqlite-storage';

interface DatabaseContextType {
  database: SQLite.SQLiteDatabase | null;
  isReady: boolean;
  initDatabase: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [database, setDatabase] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);

  const initDatabase = async () => {
    try {
      const db = await SQLite.openDatabase({
        name: 'TuViDB.db',
        location: 'default',
      });

      // Tạo bảng user_info
      await db.executeSql(`
        CREATE TABLE IF NOT EXISTS user_info (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          birth_date TEXT NOT NULL,
          birth_time TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Tạo bảng tuvi_chart
      await db.executeSql(`
        CREATE TABLE IF NOT EXISTS tuvi_chart (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          chart_data TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES user_info (id)
        );
      `);

      // Tạo bảng daily_fortune
      await db.executeSql(`
        CREATE TABLE IF NOT EXISTS daily_fortune (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          date TEXT NOT NULL,
          fortune_data TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES user_info (id)
        );
      `);

      setDatabase(db);
      setIsReady(true);
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };

  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ database, isReady, initDatabase }}>
      {children}
    </DatabaseContext.Provider>
  );
};
