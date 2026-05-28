const Project = require('../models/Project');
const cloudinary = require('../config/cloudinary');

const normalizeStatus = (status) => {
  const allowedStatuses = ['Upcoming', 'Ongoing', 'Completed'];

  if (!status) {
    return 'Upcoming';
  }

  const normalizedStatus = status.toString().trim();
  return allowedStatuses.includes(normalizedStatus) ? normalizedStatus : 'Upcoming';
};

const normalizeProjectName = (body) => {
  const projectName = (body.projectName || body.name || '').toString().trim();
  const location = (body.location || '').toString().trim();

  return {
    projectName,
    name: projectName,
    location,
    status: normalizeStatus(body.status),
    totalInquiries: Number(body.totalInquiries ?? body.inquiries ?? 0) || 0,
    slug: (body.slug || '').toString().trim().toLowerCase() || undefined,
    description: body.description,
    heroImage: body.heroImage,
    tagline: body.tagline,
    amenities: Array.isArray(body.amenities) ? body.amenities : [],
    connectivity: Array.isArray(body.connectivity) ? body.connectivity : [],
    gallery: Array.isArray(body.gallery) ? body.gallery : []
  };
};

const uploadHeroImage = (file) => {
  if (!file) {
    return Promise.resolve('');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'ayodhya-estate/projects',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createProject = async (req, res) => {
  try {
    const payload = normalizeProjectName(req.body);
    const heroImageUrl = req.file ? await uploadHeroImage(req.file) : payload.heroImage;

    if (!payload.projectName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a project name'
      });
    }

    const projectData = {
      ...payload,
      heroImage: heroImageUrl,
      name: payload.name,
      projectName: payload.projectName
    };

    if (!projectData.heroImage) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a hero image'
      });
    }

    if (projectData.slug) {
      const existingProject = await Project.findOne({ slug: projectData.slug });
      if (existingProject) {
        return res.status(409).json({
          success: false,
          message: 'A project with this slug already exists'
        });
      }
    }

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const payload = normalizeProjectName(req.body);
    const updateData = {
      ...req.body,
      ...payload,
      name: payload.name || req.body.name,
      projectName: payload.projectName || req.body.projectName || req.body.name,
      status: normalizeStatus(req.body.status || payload.status)
    };

    if (!updateData.projectName && !updateData.name) {
      delete updateData.projectName;
      delete updateData.name;
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateProjectBySlug = async (req, res) => {
  try {
    const payload = normalizeProjectName(req.body);
    const updateData = {
      ...req.body,
      ...payload,
      name: payload.name || req.body.name,
      projectName: payload.projectName || req.body.projectName || req.body.name,
      status: normalizeStatus(req.body.status || payload.status)
    };

    const project = await Project.findOneAndUpdate(
      { slug: req.params.slug },
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ slug: req.params.slug });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectBySlug,
  updateProjectBySlug,
  deleteProjectBySlug
};