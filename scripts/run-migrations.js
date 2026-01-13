const { exec } = require('child_process');
const { DataSource } = require('typeorm');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const isProduction = !fs.existsSync(path.join(__dirname, '..', 'src'));
const rootDir = path.join(__dirname, '..');

console.log('Running migrations...');
console.log('Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
console.log('Root directory:', rootDir);

const entitiesPath = isProduction
  ? path.join(rootDir, 'dist', 'infrastructure', 'database', 'entities', '*.orm-entity.js')
  : path.join(rootDir, 'src', 'infrastructure', 'database', 'entities', '*.orm-entity.ts');

const migrationsPath = isProduction
  ? path.join(rootDir, 'dist', 'infrastructure', 'database', 'migrations', '*.js')
  : path.join(rootDir, 'src', 'infrastructure', 'database', 'migrations', '*.ts');

console.log('Entities path:', entitiesPath);
console.log('Migrations path:', migrationsPath);

const dataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://brian_user:brian_pass@localhost:5432/brian_db',
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

const dataSource = new DataSource(dataSourceOptions);

async function runMigrations() {
  try {
    console.log('Initializing data source...');
    await dataSource.initialize();
    console.log('Data source initialized successfully');

    console.log('Running pending migrations...');
    const migrations = await dataSource.runMigrations({ transaction: 'all' });

    if (migrations.length === 0) {
      console.log('No pending migrations found');
    } else {
      console.log(`Successfully ran ${migrations.length} migration(s):`);
      migrations.forEach((migration) => {
        console.log(`  - ${migration.name}`);
      });
    }

    await dataSource.destroy();
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error.message);
    console.error('Stack trace:', error.stack);

    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }

    if (error.message.includes('No migrations') || error.message.includes('already executed')) {
      console.log('No new migrations to run, continuing...');
      process.exit(0);
    }

    process.exit(1);
  }
}

runMigrations();
