// run once (or automatically on start) to ensure DB and seed data exist
const { initDb, Locker } = require('./models');

async function main() {
  await initDb();

  // Seed a couple of lockers if none exist
  const count = await Locker.count();
  if (count === 0) {
    await Locker.bulkCreate([
      { code: 'LKR-001', status: 'available', location: 'Nairobi - Mall A' },
      { code: 'LKR-002', status: 'available', location: 'Nairobi - Mall A' }
    ]);
    console.log('Seeded lockers');
  }
}

if (require.main === module) {
  main().then(() => console.log('DB init done')).catch(e => console.error(e));
}
