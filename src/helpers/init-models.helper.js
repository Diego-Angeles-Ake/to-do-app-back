const { Task } = require('../models/task.model');
const { User } = require('../models/user.model');

const defineModelAssociations = () => {
  // User 1:N Task
  User.hasMany(Task);
  Task.belongsTo(User);
};

module.exports = { defineModelAssociations };
