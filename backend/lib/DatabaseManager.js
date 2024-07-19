import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

class DatabaseManager {
  constructor() {
    this.sequelize = null;
    this.user = null;
  }

  connect(callback) {
    try {
      const timezone = 'Africa/Nairobi';
      this.sequelize = new Sequelize(
        process.env.DATABASE_NAME,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        {
          host: process.env.DATABASE_HOST,
          dialect: process.env.DATABASE_DIALECT,
          logging: false,
        }
      );

      this.sequelize
        .authenticate()
        .then(() => {
          console.log('Connection has been established successfully.');
          this.initModels(() => callback(null, this.sequelize));
        })
        .catch((error) => {
          console.error('Unable to connect to the database:', error);
          callback(error, this.sequelize);
        });
    } catch (e) {
      console.error('Error in connect method:', e);
      callback(e, null);
    }
  }

  initModels(callback) {
    try {
      this.user = User.init(this.sequelize);

      this.sequelize
        .sync({ alter: false })
        .then(() => {
          console.log('Tables created!');
          callback(1);
        })
        .catch((error) => {
          console.error('Unable to create tables:', error);
          callback(0);
        });
    } catch (error) {
      console.error('Error in initModels method:', error);
      callback(0);
    }
  }


}

export default new DatabaseManager();