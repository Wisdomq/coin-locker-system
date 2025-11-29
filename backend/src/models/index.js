const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'coin_locker',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'db',
    dialect: 'mysql',
    logging: false,
  }
);

// Models
const User = sequelize.define('User', {
  phone: { type: DataTypes.STRING(20), unique: true, allowNull: false },
  name: { type: DataTypes.STRING(100) }
}, { tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Locker = sequelize.define('Locker', {
  code: { type: DataTypes.STRING(50), unique: true },
  status: { type: DataTypes.ENUM('available','occupied','maintenance'), defaultValue: 'available' },
  location: { type: DataTypes.STRING(255) }
}, { tableName: 'lockers', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Payment = sequelize.define('Payment', {
  amount: { type: DataTypes.DECIMAL(10,2) },
  provider: { type: DataTypes.STRING(50) },
  provider_ref: { type: DataTypes.STRING(255) },
  status: { type: DataTypes.STRING(50) } // e.g., initiated, success, failed
}, { tableName: 'payments', timestamps: true, createdAt: 'created_at', updatedAt: false });

// Associations
User.hasMany(Payment, { foreignKey: 'user_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });

Locker.hasMany(Payment, { foreignKey: 'locker_id' });
Payment.belongsTo(Locker, { foreignKey: 'locker_id' });

async function initDb() {
  await sequelize.authenticate();
  // For first-time dev: sync({ alter: true }) can be helpful
  await sequelize.sync();
}

module.exports = { sequelize, User, Locker, Payment, initDb };
