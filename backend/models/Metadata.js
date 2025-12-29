const mongoose = require('mongoose');

const MetadataSchema = new mongoose.Schema({
    property_name: { type: String, required: true },
    lease_end_date: { type: String, default: 'Not found' },
    notice_period: { type: String, default: 'Not found' },
    security_deposit: { type: String, default: 'Not found' },
    red_flags: { type: String, default: 'None detected' },
    source: { type: String, required: true, unique: true },
    extractedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Metadata', MetadataSchema);
