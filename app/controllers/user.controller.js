import { User } from "../models/user.model.js";

const saveUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ deletedAt: null });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); //findByIdandUpdate(req.params.id, {deletedAt: Date.now()})
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    user.deletedAt = Date.now();
    await user.save();
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { saveUser, getAllUsers, deleteUser };
