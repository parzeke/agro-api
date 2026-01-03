import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true
    },
    phone: {
      type: String,
      unique: true,
      sparse: true // Allows multiple null values
    },
    password: {
      type: String,
      // required: true, // No longer required for social auth
    },
    googleId: { type: String },
    facebookId: { type: String },
    avatar: {
      type: String,
      default: null
    },
    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: [Number] // [longitude, latitude]
    },
    address: {
      type: String,
      default: null
    }
  }, {
  timestamps: true,
});

// Create sparse geospatial index for location-based queries (only for users with location)
userSchema.index({ location: '2dsphere' }, { sparse: true });

export default mongoose.model('User', userSchema);
