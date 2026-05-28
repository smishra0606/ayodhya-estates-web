const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters']
    },
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: [150, 'Tagline cannot exceed 150 characters']
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed'],
      default: 'Upcoming'
    },
    location: {
      type: String,
      trim: true
    },
    totalInquiries: {
      type: Number,
      default: 0,
      min: 0
    },
    heroImage: {
      type: String,
      trim: true
    },
    gallery: [
      {
        type: String,
        trim: true
      }
    ],
    amenities: [
      {
        type: String,
        trim: true
      }
    ],
    connectivity: [
      {
        destination: {
          type: String,
          required: true,
          trim: true
        },
        time: {
          type: String,
          required: true,
          trim: true
        },
        icon: {
          type: String,
          trim: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Middleware humesha schema close hone ke baad aata hai
projectSchema.pre('validate', function syncProjectFields(next) {
  if (!this.projectName && this.name) {
    this.projectName = this.name;
  }

  if (!this.name && this.projectName) {
    this.name = this.projectName;
  }

  if (!this.slug && (this.projectName || this.name)) {
    const sourceName = (this.projectName || this.name || '').toString();
    this.slug = sourceName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  if (typeof this.totalInquiries !== 'number') {
    this.totalInquiries = Number(this.totalInquiries) || 0;
  }

  next();
});

module.exports = mongoose.model('Project', projectSchema);