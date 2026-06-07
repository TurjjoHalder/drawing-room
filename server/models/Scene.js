const mongoose = require('mongoose');

const sceneObjectSchema = new mongoose.Schema({
  id: { type: String, required: true },          // unique client-side ID
  type: {
    type: String,
    required: true,
    enum: ['cube', 'sphere', 'cylinder', 'torus', 'cone', 'duck', 'robot', 'tree'],
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  rotation: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 },
  },
  scale: {
    x: { type: Number, default: 1 },
    y: { type: Number, default: 1 },
    z: { type: Number, default: 1 },
  },
  color: { type: String, default: '#4f9eff' },
});

const sceneSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  objects: [sceneObjectSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

sceneSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Scene', sceneSchema);
