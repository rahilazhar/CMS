const mongoose = require("mongoose");

const EditRequestSchema = new mongoose.Schema({
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Caseentries',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('EditRequest', EditRequestSchema);
