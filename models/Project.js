import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  technologies: [{
    type: String
  }],
  projectUrl: {
    type: String
  },
  githubUrl: {
    type: String
  },
  demoEmbed: {
    type: String // For 3D model embed
  },
  featured: {
    type: Boolean,
    default: false
  },
  // Import specific fields
  importedFrom: {
    type: String, // 'sketchfab', 'artstation', 'behance', etc.
    default: null
  },
  externalId: {
    type: String // ID from external platform
  },
  externalUrl: {
    type: String // Original project URL
  },
  importData: {
    type: mongoose.Schema.Types.Mixed // Store original API response
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Project', projectSchema);