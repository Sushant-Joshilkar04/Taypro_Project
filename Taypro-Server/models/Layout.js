const mongoose = require('mongoose');

const gridSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        trim: true
    },
    rows: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    cols: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    layout: {
        type: [[Number]],
        required: true,
        validate: {
            validator: function(v) {
                // Validate that layout dimensions match rows and cols
                return v.length === this.rows && 
                       v.every(row => row.length === this.cols);
            },
            message: 'Layout dimensions must match rows and columns'
        }
    }
});

const layoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    grids: [gridSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add a compound index to ensure uniqueness of layout name per user
layoutSchema.index({ name: 1, user: 1 }, { unique: true });

const Layout = mongoose.model('Layout', layoutSchema);

module.exports = Layout; 