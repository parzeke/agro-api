import User from '../config/models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      location: null,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      location: user.location || null, // <- null si no existe
      address: user.address || null,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      id: user._id,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      location: user.location || null, // <- así nunca será undefined
      address: user.address || null,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }

};

export const socialLogin = async (req, res) => {
  try {
    const { email, name, googleId, facebookId, avatar } = req.body;

    // Find by social ID or email
    let query = {};
    if (googleId) query.googleId = googleId;
    else if (facebookId) query.facebookId = facebookId;
    else if (email) query.email = email;
    else return res.status(400).json({ message: "No identifier provided" });

    let user = await User.findOne(query);

    if (!user) {
      // Create new user
      user = await User.create({
        name: name || 'User',
        email: email || undefined,
        googleId: googleId || undefined,
        facebookId: facebookId || undefined,
        avatar: avatar || null,
        password: '', // No password for social users
        phone: null // Phone optional
      });
    } else {
      // Update existing user with new social ID if missing
      if (googleId && !user.googleId) user.googleId = googleId;
      if (facebookId && !user.facebookId) user.facebookId = facebookId;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      location: user.location || null,
      address: user.address || null,
      token,
    });
  } catch (error) {
    console.error('Social Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const avatarUrl = `http://192.168.1.5:5000/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.json({
      id: user._id,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      location: user.location || null,
      address: user.address || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, address, location } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (address !== undefined) updateData.address = address;
    if (location !== undefined) updateData.location = location;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      location: user.location || null,
      address: user.address || null
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: error.message });
  }
};
