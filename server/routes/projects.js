const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ projectId: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear all project data
router.delete('/clear-all', async (req, res) => {
  try {
    await Project.deleteMany({});
    res.json({ message: 'All projects cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new project
router.post('/', async (req, res) => {
  const project = new Project(req.body);
  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard statistics
router.get('/stats/dashboard', async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ 
      stage: { $in: ['Design', 'In Progress', 'Validation', 'R&D Prototype'] } 
    });
    
    const totalBudget = await Project.aggregate([
      { $group: { _id: null, total: { $sum: '$forecastSpend' } } }
    ]);
    
    const totalActualSpend = await Project.aggregate([
      { $group: { _id: null, total: { $sum: '$actualSpend' } } }
    ]);
    
    const stageDistribution = await Project.aggregate([
      { $group: { _id: '$stage', count: { $sum: 1 } } }
    ]);
    
    const avgRDPercentage = await Project.aggregate([
      { $group: { _id: null, avg: { $avg: '$eligibleRD' } } }
    ]);

    res.json({
      totalProjects,
      activeProjects,
      totalBudget: totalBudget[0]?.total || 0,
      totalActualSpend: totalActualSpend[0]?.total || 0,
      stageDistribution,
      avgRDPercentage: avgRDPercentage[0]?.avg || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get projects by stage
router.get('/stage/:stage', async (req, res) => {
  try {
    const projects = await Project.find({ stage: req.params.stage });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get budget analysis
router.get('/stats/budget', async (req, res) => {
  try {
    const budgetStats = await Project.aggregate([
      {
        $group: {
          _id: '$stage',
          totalForecast: { $sum: '$forecastSpend' },
          totalActual: { $sum: '$actualSpend' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json(budgetStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add sample data
router.post('/seed', async (req, res) => {
  try {
    const sampleProjects = [
      {
        projectId: 'GPU-001',
        projectName: 'RDNA 5 GPU Power Optimization',
        startDate: new Date('2025-01-10'),
        endDate: new Date('2025-12-15'),
        stage: 'In Progress',
        resourceAllocated: 3.0,
        ppaTarget: {
          performance: '+10% Perf',
          power: '-5% Power',
          area: '+0% Area'
        },
        eligibleRD: 80,
        actualSpend: 1200000,
        forecastSpend: 1300000,
        taxCreditEligible: 960000
      },
      {
        projectId: 'CPU-014',
        projectName: 'Zen 6 Core Microarchitecture',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2026-05-30'),
        stage: 'Design',
        resourceAllocated: 5.5,
        ppaTarget: {
          performance: '+15% Perf',
          power: '+0% Power',
          area: '+2% Area'
        },
        eligibleRD: 70,
        actualSpend: 3500000,
        forecastSpend: 4000000,
        taxCreditEligible: 2800000
      },
      {
        projectId: 'IP-022',
        projectName: 'Infinity Fabric Latency Tuning',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-09-30'),
        stage: 'Validation',
        resourceAllocated: 2.0,
        ppaTarget: {
          performance: '-10% Latency',
          power: '+0% Power',
          area: '+0% Area'
        },
        eligibleRD: 90,
        actualSpend: 900000,
        forecastSpend: 950000,
        taxCreditEligible: 855000
      },
      {
        projectId: 'AI-008',
        projectName: 'Ryzen AI NPU Optimization',
        startDate: new Date('2025-03-15'),
        endDate: new Date('2025-11-15'),
        stage: 'R&D Prototype',
        resourceAllocated: 2.5,
        ppaTarget: {
          performance: '+20% Perf',
          power: '-8% Power',
          area: '+0% Area'
        },
        eligibleRD: 95,
        actualSpend: 1500000,
        forecastSpend: 1600000,
        taxCreditEligible: 1520000
      },
      {
        projectId: 'GPU-002',
        projectName: 'RDNA 4 Memory Controller',
        startDate: new Date('2025-02-15'),
        endDate: new Date('2025-10-20'),
        stage: 'In Progress',
        resourceAllocated: 4.2,
        ppaTarget: {
          performance: '+8% Perf',
          power: '-3% Power',
          area: '+1% Area'
        },
        eligibleRD: 85,
        actualSpend: 2100000,
        forecastSpend: 2400000,
        taxCreditEligible: 1785000
      },
      {
        projectId: 'CPU-015',
        projectName: 'Zen 5+ Cache Architecture',
        startDate: new Date('2024-08-01'),
        endDate: new Date('2026-02-28'),
        stage: 'Design',
        resourceAllocated: 6.8,
        ppaTarget: {
          performance: '+12% Perf',
          power: '+1% Power',
          area: '+3% Area'
        },
        eligibleRD: 75,
        actualSpend: 4200000,
        forecastSpend: 4800000,
        taxCreditEligible: 3150000
      },
      {
        projectId: 'AI-009',
        projectName: 'XDNA AI Engine Enhancement',
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-12-31'),
        stage: 'R&D Prototype',
        resourceAllocated: 3.5,
        ppaTarget: {
          performance: '+25% Perf',
          power: '-10% Power',
          area: '+2% Area'
        },
        eligibleRD: 92,
        actualSpend: 1800000,
        forecastSpend: 2000000,
        taxCreditEligible: 1656000
      },
      {
        projectId: 'IP-023',
        projectName: 'PCIe 6.0 Controller Design',
        startDate: new Date('2025-01-20'),
        endDate: new Date('2025-08-15'),
        stage: 'Validation',
        resourceAllocated: 2.8,
        ppaTarget: {
          performance: '+15% Bandwidth',
          power: '+2% Power',
          area: '+1% Area'
        },
        eligibleRD: 88,
        actualSpend: 1100000,
        forecastSpend: 1250000,
        taxCreditEligible: 968000
      },
      {
        projectId: 'SOC-001',
        projectName: 'Ryzen 8000 Series Integration',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2026-06-30'),
        stage: 'Design',
        resourceAllocated: 8.5,
        ppaTarget: {
          performance: '+18% Perf',
          power: '-5% Power',
          area: '+4% Area'
        },
        eligibleRD: 82,
        actualSpend: 5500000,
        forecastSpend: 6500000,
        taxCreditEligible: 4510000
      },
      {
        projectId: 'GPU-003',
        projectName: 'RDNA 3.5 Ray Tracing',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-11-30'),
        stage: 'In Progress',
        resourceAllocated: 3.8,
        ppaTarget: {
          performance: '+30% RT Perf',
          power: '-2% Power',
          area: '+3% Area'
        },
        eligibleRD: 87,
        actualSpend: 2800000,
        forecastSpend: 3200000,
        taxCreditEligible: 2436000
      },
      {
        projectId: 'CPU-016',
        projectName: 'Zen 4+ Power Management',
        startDate: new Date('2024-11-15'),
        endDate: new Date('2025-09-30'),
        stage: 'Validation',
        resourceAllocated: 4.0,
        ppaTarget: {
          performance: '+5% Perf',
          power: '-15% Power',
          area: '+0% Area'
        },
        eligibleRD: 78,
        actualSpend: 2200000,
        forecastSpend: 2500000,
        taxCreditEligible: 1716000
      },
      {
        projectId: 'AI-010',
        projectName: 'Machine Learning Accelerator',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2026-02-28'),
        stage: 'R&D Prototype',
        resourceAllocated: 5.2,
        ppaTarget: {
          performance: '+40% ML Perf',
          power: '-8% Power',
          area: '+5% Area'
        },
        eligibleRD: 94,
        actualSpend: 3200000,
        forecastSpend: 3800000,
        taxCreditEligible: 3008000
      },
      {
        projectId: 'IP-024',
        projectName: 'USB 4.0 Controller',
        startDate: new Date('2025-02-10'),
        endDate: new Date('2025-07-20'),
        stage: 'Validation',
        resourceAllocated: 2.2,
        ppaTarget: {
          performance: '+20% Speed',
          power: '+1% Power',
          area: '+0% Area'
        },
        eligibleRD: 85,
        actualSpend: 800000,
        forecastSpend: 900000,
        taxCreditEligible: 680000
      },
      {
        projectId: 'GPU-004',
        projectName: 'RDNA 4 Display Engine',
        startDate: new Date('2025-04-15'),
        endDate: new Date('2025-12-10'),
        stage: 'In Progress',
        resourceAllocated: 3.2,
        ppaTarget: {
          performance: '+12% Display Perf',
          power: '-3% Power',
          area: '+2% Area'
        },
        eligibleRD: 83,
        actualSpend: 1900000,
        forecastSpend: 2200000,
        taxCreditEligible: 1577000
      },
      {
        projectId: 'CPU-017',
        projectName: 'Zen 6 Security Features',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2026-08-31'),
        stage: 'Design',
        resourceAllocated: 7.0,
        ppaTarget: {
          performance: '+8% Perf',
          power: '+2% Power',
          area: '+3% Area'
        },
        eligibleRD: 76,
        actualSpend: 4800000,
        forecastSpend: 5500000,
        taxCreditEligible: 3648000
      },
      {
        projectId: 'AI-011',
        projectName: 'Neural Network Processor',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2026-01-31'),
        stage: 'R&D Prototype',
        resourceAllocated: 4.8,
        ppaTarget: {
          performance: '+35% NN Perf',
          power: '-12% Power',
          area: '+4% Area'
        },
        eligibleRD: 91,
        actualSpend: 2600000,
        forecastSpend: 3100000,
        taxCreditEligible: 2366000
      },
      {
        projectId: 'IP-025',
        projectName: 'DDR5 Memory Controller',
        startDate: new Date('2025-01-05'),
        endDate: new Date('2025-06-30'),
        stage: 'Validation',
        resourceAllocated: 2.5,
        ppaTarget: {
          performance: '+25% Memory Speed',
          power: '+3% Power',
          area: '+1% Area'
        },
        eligibleRD: 86,
        actualSpend: 1200000,
        forecastSpend: 1400000,
        taxCreditEligible: 1032000
      },
      {
        projectId: 'SOC-002',
        projectName: 'EPYC Server Integration',
        startDate: new Date('2024-10-01'),
        endDate: new Date('2026-12-31'),
        stage: 'Design',
        resourceAllocated: 9.2,
        ppaTarget: {
          performance: '+22% Server Perf',
          power: '-8% Power',
          area: '+6% Area'
        },
        eligibleRD: 84,
        actualSpend: 7200000,
        forecastSpend: 8500000,
        taxCreditEligible: 6048000
      },
      {
        projectId: 'GPU-005',
        projectName: 'RDNA 3.5 Compute Units',
        startDate: new Date('2025-03-20'),
        endDate: new Date('2025-10-15'),
        stage: 'In Progress',
        resourceAllocated: 4.0,
        ppaTarget: {
          performance: '+15% Compute Perf',
          power: '-4% Power',
          area: '+2% Area'
        },
        eligibleRD: 89,
        actualSpend: 2400000,
        forecastSpend: 2800000,
        taxCreditEligible: 2136000
      },
      {
        projectId: 'CPU-018',
        projectName: 'Zen 5+ Branch Predictor',
        startDate: new Date('2024-07-15'),
        endDate: new Date('2025-05-30'),
        stage: 'Validation',
        resourceAllocated: 3.5,
        ppaTarget: {
          performance: '+10% Branch Accuracy',
          power: '+1% Power',
          area: '+1% Area'
        },
        eligibleRD: 79,
        actualSpend: 1800000,
        forecastSpend: 2100000,
        taxCreditEligible: 1422000
      },
      {
        projectId: 'AI-012',
        projectName: 'Computer Vision Engine',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2026-03-31'),
        stage: 'R&D Prototype',
        resourceAllocated: 5.5,
        ppaTarget: {
          performance: '+45% CV Perf',
          power: '-10% Power',
          area: '+3% Area'
        },
        eligibleRD: 93,
        actualSpend: 3400000,
        forecastSpend: 4000000,
        taxCreditEligible: 3162000
      },
      {
        projectId: 'IP-026',
        projectName: 'Thunderbolt Controller',
        startDate: new Date('2025-02-20'),
        endDate: new Date('2025-08-10'),
        stage: 'Validation',
        resourceAllocated: 2.8,
        ppaTarget: {
          performance: '+18% Transfer Speed',
          power: '+2% Power',
          area: '+1% Area'
        },
        eligibleRD: 87,
        actualSpend: 1000000,
        forecastSpend: 1150000,
        taxCreditEligible: 870000
      },
      {
        projectId: 'GPU-006',
        projectName: 'RDNA 4 Video Codec',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-11-30'),
        stage: 'In Progress',
        resourceAllocated: 3.6,
        ppaTarget: {
          performance: '+20% Encoding Speed',
          power: '-5% Power',
          area: '+2% Area'
        },
        eligibleRD: 85,
        actualSpend: 2100000,
        forecastSpend: 2400000,
        taxCreditEligible: 1785000
      },
      {
        projectId: 'CPU-019',
        projectName: 'Zen 6 Vector Units',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2026-04-30'),
        stage: 'Design',
        resourceAllocated: 6.5,
        ppaTarget: {
          performance: '+28% Vector Perf',
          power: '+3% Power',
          area: '+4% Area'
        },
        eligibleRD: 81,
        actualSpend: 4200000,
        forecastSpend: 5000000,
        taxCreditEligible: 3402000
      },
      {
        projectId: 'AI-013',
        projectName: 'Speech Recognition Engine',
        startDate: new Date('2025-08-01'),
        endDate: new Date('2026-04-30'),
        stage: 'R&D Prototype',
        resourceAllocated: 4.2,
        ppaTarget: {
          performance: '+38% Speech Perf',
          power: '-7% Power',
          area: '+3% Area'
        },
        eligibleRD: 90,
        actualSpend: 2200000,
        forecastSpend: 2600000,
        taxCreditEligible: 1980000
      },
      {
        projectId: 'IP-027',
        projectName: 'WiFi 7 Controller',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-09-15'),
        stage: 'Validation',
        resourceAllocated: 2.4,
        ppaTarget: {
          performance: '+30% WiFi Speed',
          power: '+2% Power',
          area: '+1% Area'
        },
        eligibleRD: 84,
        actualSpend: 900000,
        forecastSpend: 1050000,
        taxCreditEligible: 756000
      },
      {
        projectId: 'SOC-003',
        projectName: 'Mobile APU Integration',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2026-07-31'),
        stage: 'Design',
        resourceAllocated: 7.8,
        ppaTarget: {
          performance: '+16% Mobile Perf',
          power: '-12% Power',
          area: '+3% Area'
        },
        eligibleRD: 83,
        actualSpend: 5800000,
        forecastSpend: 6800000,
        taxCreditEligible: 4814000
      },
      {
        projectId: 'GPU-007',
        projectName: 'RDNA 3.5 Shader Units',
        startDate: new Date('2025-04-10'),
        endDate: new Date('2025-12-05'),
        stage: 'In Progress',
        resourceAllocated: 3.4,
        ppaTarget: {
          performance: '+18% Shader Perf',
          power: '-3% Power',
          area: '+2% Area'
        },
        eligibleRD: 88,
        actualSpend: 2000000,
        forecastSpend: 2300000,
        taxCreditEligible: 1760000
      },
      {
        projectId: 'CPU-020',
        projectName: 'Zen 5+ Cache Coherency',
        startDate: new Date('2024-08-20'),
        endDate: new Date('2025-06-15'),
        stage: 'Validation',
        resourceAllocated: 4.2,
        ppaTarget: {
          performance: '+12% Cache Perf',
          power: '+1% Power',
          area: '+2% Area'
        },
        eligibleRD: 77,
        actualSpend: 2400000,
        forecastSpend: 2800000,
        taxCreditEligible: 1848000
      },
      {
        projectId: 'AI-014',
        projectName: 'Natural Language Processor',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2026-05-31'),
        stage: 'R&D Prototype',
        resourceAllocated: 5.8,
        ppaTarget: {
          performance: '+42% NLP Perf',
          power: '-9% Power',
          area: '+4% Area'
        },
        eligibleRD: 92,
        actualSpend: 3800000,
        forecastSpend: 4500000,
        taxCreditEligible: 3496000
      },
      {
        projectId: 'IP-028',
        projectName: 'Bluetooth 5.3 Controller',
        startDate: new Date('2025-03-15'),
        endDate: new Date('2025-08-20'),
        stage: 'Validation',
        resourceAllocated: 2.1,
        ppaTarget: {
          performance: '+15% BT Speed',
          power: '+1% Power',
          area: '+0% Area'
        },
        eligibleRD: 82,
        actualSpend: 700000,
        forecastSpend: 800000,
        taxCreditEligible: 574000
      },
      {
        projectId: 'GPU-008',
        projectName: 'RDNA 4 Geometry Engine',
        startDate: new Date('2025-05-15'),
        endDate: new Date('2025-12-20'),
        stage: 'In Progress',
        resourceAllocated: 3.8,
        ppaTarget: {
          performance: '+14% Geometry Perf',
          power: '-4% Power',
          area: '+2% Area'
        },
        eligibleRD: 86,
        actualSpend: 2300000,
        forecastSpend: 2700000,
        taxCreditEligible: 1978000
      },
      {
        projectId: 'CPU-021',
        projectName: 'Zen 6 Instruction Decoder',
        startDate: new Date('2024-10-01'),
        endDate: new Date('2026-06-30'),
        stage: 'Design',
        resourceAllocated: 5.8,
        ppaTarget: {
          performance: '+20% Decode Perf',
          power: '+2% Power',
          area: '+3% Area'
        },
        eligibleRD: 80,
        actualSpend: 3600000,
        forecastSpend: 4200000,
        taxCreditEligible: 2880000
      },
      {
        projectId: 'AI-015',
        projectName: 'Recommendation Engine',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2026-06-30'),
        stage: 'R&D Prototype',
        resourceAllocated: 4.5,
        ppaTarget: {
          performance: '+35% Rec Perf',
          power: '-6% Power',
          area: '+3% Area'
        },
        eligibleRD: 89,
        actualSpend: 2800000,
        forecastSpend: 3300000,
        taxCreditEligible: 2492000
      },
      {
        projectId: 'IP-029',
        projectName: 'Ethernet Controller',
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-09-30'),
        stage: 'Validation',
        resourceAllocated: 2.6,
        ppaTarget: {
          performance: '+25% Network Speed',
          power: '+2% Power',
          area: '+1% Area'
        },
        eligibleRD: 85,
        actualSpend: 1100000,
        forecastSpend: 1300000,
        taxCreditEligible: 935000
      },
      {
        projectId: 'SOC-004',
        projectName: 'Gaming Console APU',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2026-10-31'),
        stage: 'Design',
        resourceAllocated: 8.8,
        ppaTarget: {
          performance: '+25% Gaming Perf',
          power: '-10% Power',
          area: '+5% Area'
        },
        eligibleRD: 85,
        actualSpend: 6500000,
        forecastSpend: 7800000,
        taxCreditEligible: 5525000
      },
      {
        projectId: 'GPU-009',
        projectName: 'RDNA 3.5 Texture Units',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-12-31'),
        stage: 'In Progress',
        resourceAllocated: 3.2,
        ppaTarget: {
          performance: '+16% Texture Perf',
          power: '-3% Power',
          area: '+2% Area'
        },
        eligibleRD: 87,
        actualSpend: 1900000,
        forecastSpend: 2200000,
        taxCreditEligible: 1653000
      },
      {
        projectId: 'CPU-022',
        projectName: 'Zen 5+ Load Store Unit',
        startDate: new Date('2024-09-15'),
        endDate: new Date('2025-07-30'),
        stage: 'Validation',
        resourceAllocated: 4.5,
        ppaTarget: {
          performance: '+15% Memory Perf',
          power: '+1% Power',
          area: '+2% Area'
        },
        eligibleRD: 78,
        actualSpend: 2600000,
        forecastSpend: 3000000,
        taxCreditEligible: 2028000
      },
      {
        projectId: 'AI-016',
        projectName: 'Image Recognition Engine',
        startDate: new Date('2025-11-01'),
        endDate: new Date('2026-07-31'),
        stage: 'R&D Prototype',
        resourceAllocated: 5.2,
        ppaTarget: {
          performance: '+48% Image Perf',
          power: '-11% Power',
          area: '+4% Area'
        },
        eligibleRD: 91,
        actualSpend: 3200000,
        forecastSpend: 3800000,
        taxCreditEligible: 2912000
      },
      {
        projectId: 'IP-030',
        projectName: 'HDMI 2.1 Controller',
        startDate: new Date('2025-04-20'),
        endDate: new Date('2025-10-15'),
        stage: 'Validation',
        resourceAllocated: 2.3,
        ppaTarget: {
          performance: '+22% Display Perf',
          power: '+1% Power',
          area: '+1% Area'
        },
        eligibleRD: 83,
        actualSpend: 800000,
        forecastSpend: 950000,
        taxCreditEligible: 664000
      },
      {
        projectId: 'GPU-010',
        projectName: 'RDNA 4 Raster Engine',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2026-01-31'),
        stage: 'In Progress',
        resourceAllocated: 3.6,
        ppaTarget: {
          performance: '+13% Raster Perf',
          power: '-4% Power',
          area: '+2% Area'
        },
        eligibleRD: 85,
        actualSpend: 2200000,
        forecastSpend: 2600000,
        taxCreditEligible: 1870000
      },
      {
        projectId: 'CPU-023',
        projectName: 'Zen 6 Execution Units',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2026-08-31'),
        stage: 'Design',
        resourceAllocated: 7.2,
        ppaTarget: {
          performance: '+24% Exec Perf',
          power: '+3% Power',
          area: '+4% Area'
        },
        eligibleRD: 82,
        actualSpend: 4800000,
        forecastSpend: 5600000,
        taxCreditEligible: 3936000
      },
      {
        projectId: 'AI-017',
        projectName: 'Autonomous Driving Engine',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2026-08-31'),
        stage: 'R&D Prototype',
        resourceAllocated: 6.5,
        ppaTarget: {
          performance: '+55% AD Perf',
          power: '-15% Power',
          area: '+6% Area'
        },
        eligibleRD: 94,
        actualSpend: 4200000,
        forecastSpend: 5000000,
        taxCreditEligible: 3948000
      },
      {
        projectId: 'IP-031',
        projectName: 'DisplayPort 2.0 Controller',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-10-30'),
        stage: 'Validation',
        resourceAllocated: 2.4,
        ppaTarget: {
          performance: '+28% Display Perf',
          power: '+2% Power',
          area: '+1% Area'
        },
        eligibleRD: 86,
        actualSpend: 900000,
        forecastSpend: 1100000,
        taxCreditEligible: 774000
      },
      {
        projectId: 'SOC-005',
        projectName: 'Data Center APU',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2026-11-30'),
        stage: 'Design',
        resourceAllocated: 9.5,
        ppaTarget: {
          performance: '+30% DC Perf',
          power: '-8% Power',
          area: '+7% Area'
        },
        eligibleRD: 86,
        actualSpend: 7800000,
        forecastSpend: 9200000,
        taxCreditEligible: 6708000
      },
      {
        projectId: 'GPU-011',
        projectName: 'RDNA 3.5 Command Processor',
        startDate: new Date('2025-08-01'),
        endDate: new Date('2026-02-28'),
        stage: 'In Progress',
        resourceAllocated: 3.4,
        ppaTarget: {
          performance: '+17% Command Perf',
          power: '-3% Power',
          area: '+2% Area'
        },
        eligibleRD: 88,
        actualSpend: 2000000,
        forecastSpend: 2400000,
        taxCreditEligible: 1760000
      },
      {
        projectId: 'CPU-024',
        projectName: 'Zen 5+ Register File',
        startDate: new Date('2024-10-15'),
        endDate: new Date('2025-08-30'),
        stage: 'Validation',
        resourceAllocated: 4.8,
        ppaTarget: {
          performance: '+18% Register Perf',
          power: '+2% Power',
          area: '+3% Area'
        },
        eligibleRD: 79,
        actualSpend: 2800000,
        forecastSpend: 3200000,
        taxCreditEligible: 2212000
      },
      {
        projectId: 'AI-018',
        projectName: 'Quantum Computing Interface',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-09-30'),
        stage: 'R&D Prototype',
        resourceAllocated: 7.2,
        ppaTarget: {
          performance: '+60% Quantum Perf',
          power: '-20% Power',
          area: '+8% Area'
        },
        eligibleRD: 95,
        actualSpend: 5200000,
        forecastSpend: 6200000,
        taxCreditEligible: 4940000
      },
      {
        projectId: 'IP-032',
        projectName: 'Audio Codec Controller',
        startDate: new Date('2025-05-15'),
        endDate: new Date('2025-11-10'),
        stage: 'Validation',
        resourceAllocated: 2.2,
        ppaTarget: {
          performance: '+20% Audio Perf',
          power: '+1% Power',
          area: '+1% Area'
        },
        eligibleRD: 84,
        actualSpend: 700000,
        forecastSpend: 850000,
        taxCreditEligible: 588000
      },
      {
        projectId: 'GPU-012',
        projectName: 'RDNA 4 Memory Interface',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2026-03-31'),
        stage: 'In Progress',
        resourceAllocated: 3.8,
        ppaTarget: {
          performance: '+19% Memory Perf',
          power: '-4% Power',
          area: '+2% Area'
        },
        eligibleRD: 86,
        actualSpend: 2400000,
        forecastSpend: 2800000,
        taxCreditEligible: 2064000
      },
      {
        projectId: 'CPU-025',
        projectName: 'Zen 6 Floating Point Unit',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2026-10-31'),
        stage: 'Design',
        resourceAllocated: 6.8,
        ppaTarget: {
          performance: '+26% FP Perf',
          power: '+3% Power',
          area: '+4% Area'
        },
        eligibleRD: 83,
        actualSpend: 5200000,
        forecastSpend: 6000000,
        taxCreditEligible: 4316000
      },
      {
        projectId: 'AI-019',
        projectName: 'Edge Computing Engine',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-10-31'),
        stage: 'R&D Prototype',
        resourceAllocated: 5.8,
        ppaTarget: {
          performance: '+45% Edge Perf',
          power: '-12% Power',
          area: '+5% Area'
        },
        eligibleRD: 92,
        actualSpend: 3600000,
        forecastSpend: 4300000,
        taxCreditEligible: 3312000
      },
      {
        projectId: 'IP-033',
        projectName: 'Security Controller',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-11-30'),
        stage: 'Validation',
        resourceAllocated: 2.5,
        ppaTarget: {
          performance: '+25% Security Perf',
          power: '+2% Power',
          area: '+1% Area'
        },
        eligibleRD: 87,
        actualSpend: 1000000,
        forecastSpend: 1200000,
        taxCreditEligible: 870000
      },
      {
        projectId: 'SOC-006',
        projectName: 'IoT Device Integration',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2026-12-31'),
        stage: 'Design',
        resourceAllocated: 6.5,
        ppaTarget: {
          performance: '+20% IoT Perf',
          power: '-15% Power',
          area: '+4% Area'
        },
        eligibleRD: 81,
        actualSpend: 4200000,
        forecastSpend: 5000000,
        taxCreditEligible: 3402000
      },
      {
        projectId: 'GPU-013',
        projectName: 'RDNA 3.5 Shader Compiler',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2026-04-30'),
        stage: 'In Progress',
        resourceAllocated: 3.2,
        ppaTarget: {
          performance: '+21% Compiler Perf',
          power: '-3% Power',
          area: '+2% Area'
        },
        eligibleRD: 89,
        actualSpend: 1800000,
        forecastSpend: 2100000,
        taxCreditEligible: 1602000
      },
      {
        projectId: 'CPU-026',
        projectName: 'Zen 5+ Integer Unit',
        startDate: new Date('2024-11-15'),
        endDate: new Date('2025-09-30'),
        stage: 'Validation',
        resourceAllocated: 5.0,
        ppaTarget: {
          performance: '+22% Integer Perf',
          power: '+2% Power',
          area: '+3% Area'
        },
        eligibleRD: 80,
        actualSpend: 3000000,
        forecastSpend: 3500000,
        taxCreditEligible: 2400000
      },
      {
        projectId: 'AI-020',
        projectName: 'Federated Learning Engine',
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-11-30'),
        stage: 'R&D Prototype',
        resourceAllocated: 6.2,
        ppaTarget: {
          performance: '+50% FL Perf',
          power: '-14% Power',
          area: '+5% Area'
        },
        eligibleRD: 93,
        actualSpend: 4000000,
        forecastSpend: 4800000,
        taxCreditEligible: 3720000
      }
    ];

    await Project.insertMany(sampleProjects);
    res.json({ message: 'Sample data successfully added', count: sampleProjects.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router; 