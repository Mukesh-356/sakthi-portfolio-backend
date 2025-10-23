import express from 'express';
import Project from '../models/Project.js';
import auth from '../middleware/auth.js';
import axios from 'axios';

const router = express.Router();

// Import from Sketchfab
router.post('/sketchfab', auth, async (req, res) => {
  try {
    const { sketchfabUrl, category, featured } = req.body;
    
    console.log('🔄 Importing from Sketchfab:', sketchfabUrl);

    // Extract Sketchfab ID from URL
    const sketchfabId = extractSketchfabId(sketchfabUrl);
    if (!sketchfabId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid Sketchfab URL' 
      });
    }

    // Check if already imported
    const existingProject = await Project.findOne({ 
      importedFrom: 'sketchfab', 
      externalId: sketchfabId 
    });
    
    if (existingProject) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project already imported' 
      });
    }

    // Get project data from Sketchfab (mock - you'd use actual API)
    const projectData = await getSketchfabProjectData(sketchfabId);
    
    // Create project
    const project = new Project({
      title: projectData.title,
      description: projectData.description || '3D model from Sketchfab',
      category: category || '3D Modeling',
      technologies: ['Blender', '3D Modeling', 'Texturing'],
      projectUrl: sketchfabUrl,
      demoEmbed: generateSketchfabEmbed(sketchfabId),
      featured: featured || false,
      importedFrom: 'sketchfab',
      externalId: sketchfabId,
      externalUrl: sketchfabUrl,
      importData: projectData
    });

    await project.save();
    
    console.log('✅ Sketchfab project imported:', project.title);
    
    res.json({ 
      success: true, 
      message: 'Project imported successfully',
      project 
    });

  } catch (error) {
    console.error('❌ Sketchfab import error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to import project' 
    });
  }
});

// Import from ArtStation
router.post('/artstation', auth, async (req, res) => {
  try {
    const { artstationUrl, category, featured } = req.body;
    
    console.log('🔄 Importing from ArtStation:', artstationUrl);

    // Extract ArtStation ID from URL
    const artstationId = extractArtstationId(artstationUrl);
    if (!artstationId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ArtStation URL' 
      });
    }

    // Check if already imported
    const existingProject = await Project.findOne({ 
      importedFrom: 'artstation', 
      externalId: artstationId 
    });
    
    if (existingProject) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project already imported' 
      });
    }

    // Get project data (mock - use actual API)
    const projectData = await getArtstationProjectData(artstationId);
    
    // Create project
    const project = new Project({
      title: projectData.title,
      description: projectData.description || 'Artwork from ArtStation',
      category: category || 'Digital Art',
      technologies: projectData.software || ['Photoshop', 'Digital Painting'],
      projectUrl: artstationUrl,
      images: projectData.images || [],
      featured: featured || false,
      importedFrom: 'artstation',
      externalId: artstationId,
      externalUrl: artstationUrl,
      importData: projectData
    });

    await project.save();
    
    console.log('✅ ArtStation project imported:', project.title);
    
    res.json({ 
      success: true, 
      message: 'Project imported successfully',
      project 
    });

  } catch (error) {
    console.error('❌ ArtStation import error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to import project' 
    });
  }
});

// Import from Behance
router.post('/behance', auth, async (req, res) => {
  try {
    const { behanceUrl, category, featured } = req.body;
    
    console.log('🔄 Importing from Behance:', behanceUrl);

    // Extract Behance ID from URL
    const behanceId = extractBehanceId(behanceUrl);
    if (!behanceId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid Behance URL' 
      });
    }

    // Check if already imported
    const existingProject = await Project.findOne({ 
      importedFrom: 'behance', 
      externalId: behanceId 
    });
    
    if (existingProject) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project already imported' 
      });
    }

    // Get project data (mock - use actual API)
    const projectData = await getBehanceProjectData(behanceId);
    
    // Create project
    const project = new Project({
      title: projectData.title,
      description: projectData.description || 'Project from Behance',
      category: category || 'Design',
      technologies: projectData.fields || ['UI/UX Design', 'Graphic Design'],
      projectUrl: behanceUrl,
      images: projectData.images || [],
      featured: featured || false,
      importedFrom: 'behance',
      externalId: behanceId,
      externalUrl: behanceUrl,
      importData: projectData
    });

    await project.save();
    
    console.log('✅ Behance project imported:', project.title);
    
    res.json({ 
      success: true, 
      message: 'Project imported successfully',
      project 
    });

  } catch (error) {
    console.error('❌ Behance import error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to import project' 
    });
  }
});

// Manual import with project data
router.post('/manual', auth, async (req, res) => {
  try {
    const { projectData } = req.body;
    
    console.log('🔄 Manual import:', projectData.title);

    const project = new Project({
      ...projectData,
      importedFrom: 'manual'
    });

    await project.save();
    
    console.log('✅ Manual project imported:', project.title);
    
    res.json({ 
      success: true, 
      message: 'Project imported successfully',
      project 
    });

  } catch (error) {
    console.error('❌ Manual import error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to import project' 
    });
  }
});

// Helper functions
function extractSketchfabId(url) {
  const match = url.match(/sketchfab\.com\/3d-models\/([^\/?]+)/);
  return match ? match[1] : null;
}

function extractArtstationId(url) {
  const match = url.match(/artstation\.com\/artwork\/([^\/?]+)/);
  return match ? match[1] : null;
}

function extractBehanceId(url) {
  const match = url.match(/behance\.net\/gallery\/([^\/?]+)/);
  return match ? match[1] : null;
}

function generateSketchfabEmbed(sketchfabId) {
  return `
    <div class="sketchfab-embed-wrapper">
      <iframe 
        title="${sketchfabId}" 
        frameborder="0" 
        allowfullscreen 
        mozallowfullscreen="true" 
        webkitallowfullscreen="true" 
        allow="autoplay; fullscreen; xr-spatial-tracking" 
        xr-spatial-tracking 
        execution-while-out-of-viewport 
        execution-while-not-rendered 
        web-share 
        src="https://sketchfab.com/models/${sketchfabId}/embed"
        width="100%" 
        height="400">
      </iframe>
    </div>
  `;
}

// Mock API functions (replace with actual API calls)
async function getSketchfabProjectData(sketchfabId) {
  return {
    title: `Sketchfab Model - ${sketchfabId}`,
    description: 'Imported 3D model from Sketchfab',
    viewCount: Math.floor(Math.random() * 1000),
    likeCount: Math.floor(Math.random() * 100)
  };
}

async function getArtstationProjectData(artstationId) {
  return {
    title: `ArtStation Artwork - ${artstationId}`,
    description: 'Imported artwork from ArtStation',
    software: ['Photoshop', 'Blender', 'ZBrush'],
    images: []
  };
}

async function getBehanceProjectData(behanceId) {
  return {
    title: `Behance Project - ${behanceId}`,
    description: 'Imported project from Behance',
    fields: ['UI/UX Design', 'Graphic Design'],
    images: []
  };
}

export default router;