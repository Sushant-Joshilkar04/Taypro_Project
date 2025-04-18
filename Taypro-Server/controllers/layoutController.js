const Layout = require('../models/Layout');

// Get all layouts for a user
exports.getLayouts = async (req, res) => {
    try {
        const layouts = await Layout.find({ user: req.user.id });
        res.json(layouts);
    } catch (error) {
        console.error('Error fetching layouts:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a specific layout
exports.getLayout = async (req, res) => {
    try {
        const layout = await Layout.findOne({ 
            _id: req.params.id,
            user: req.user.id 
        });
        
        if (!layout) {
            return res.status(404).json({ message: 'Layout not found' });
        }
        
        res.json(layout);
    } catch (error) {
        console.error('Error fetching layout:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new layout
exports.createLayout = async (req, res) => {
    try {
        const { name, grids } = req.body;
        
        // Check if a layout with this name already exists for this user
        const existingLayout = await Layout.findOne({ 
            name,
            user: req.user.id 
        });
        
        if (existingLayout) {
            return res.status(400).json({ message: 'A layout with this name already exists' });
        }
        
        // Create new layout
        const layout = new Layout({
            name,
            user: req.user.id,
            grids
        });
        
        await layout.save();
        res.status(201).json(layout);
    } catch (error) {
        console.error('Error creating layout:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a layout
exports.updateLayout = async (req, res) => {
    try {
        const { name, grids } = req.body;
        
        // Check if another layout with this name exists for this user
        const existingLayout = await Layout.findOne({
            name,
            user: req.user.id,
            _id: { $ne: req.params.id }
        });
        
        if (existingLayout) {
            return res.status(400).json({ message: 'Another layout with this name already exists' });
        }
        
        // Find and update the layout
        const layout = await Layout.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { 
                name,
                grids,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );
        
        if (!layout) {
            return res.status(404).json({ message: 'Layout not found' });
        }
        
        res.json(layout);
    } catch (error) {
        console.error('Error updating layout:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a layout
exports.deleteLayout = async (req, res) => {
    try {
        const layout = await Layout.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        
        if (!layout) {
            return res.status(404).json({ message: 'Layout not found' });
        }
        
        res.json({ message: 'Layout deleted successfully' });
    } catch (error) {
        console.error('Error deleting layout:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 