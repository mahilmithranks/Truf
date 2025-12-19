const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    images: [{
        type: String
    }],
    amenities: [{
        type: String
    }],
    sports: [{
        type: String,
        enum: ['Cricket', 'Football', 'Basketball', 'Badminton', 'Tennis', 'Volleyball']
    }],
    pricePerHour: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    availability: {
        monday: {
            open: { type: String, default: '06:00' },
            close: { type: String, default: '22:00' }
        },
        tuesday: {
            open: { type: String, default: '06:00' },
            close: { type: String, default: '22:00' }
        },
        wednesday: {
            open: { type: String, default: '06:00' },
            close: { type: String, default: '22:00' }
        },
        thursday: {
            open: { type: String, default: '06:00' },
            close: { type: String, default: '22:00' }
        },
        friday: {
            open: { type: String, default: '06:00' },
            close: { type: String, default: '22:00' }
        },
        saturday: {
            open: { type: String, default: '06:00' },
            close: { type: String, default: '23:00' }
        },
        sunday: {
            open: { type: String, default: '06:00' },
            close: { type: String, default: '23:00' }
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Index for search and filtering
turfSchema.index({ 'location.city': 1, sports: 1, pricePerHour: 1 });
turfSchema.index({ status: 1 });

module.exports = mongoose.model('Turf', turfSchema);
