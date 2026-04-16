const mongoose = require('mongoose');

// Define cache format for Computed Design pattern
const reportSchema = new mongoose.Schema({
  userid: { type: Number, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  costs: [
    new mongoose.Schema({
      food: [Object],
      health: [Object],
      housing: [Object],
      sports: [Object],
      education: [Object]
    }, { _id: false })
  ]
});

// Construct Report exporter binding MongoDB schema
module.exports = mongoose.model('Report', reportSchema);
