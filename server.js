require('dotenv').config();
const { app } = require('./src/app');

// Connection helpers
const { defineModelAssociations } = require('./src/helpers/init-models.helper');
const {
  synchronizeDatabase,
  authenticateConnection,
} = require('./src/helpers/db-connection.helper');

// Set env port and fallback port
const PORT = process.env.PORT || 4000;

// Test connection to the database
authenticateConnection();

// Establish model relations
defineModelAssociations();

// Model synchronization
synchronizeDatabase();

// Spin-up server
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
