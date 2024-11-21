const mongoose = require("mongoose");

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://ashwinirapatil19:F%24Z%24PYYH%25%242Hg5t@clusteruser.eycl6.mongodb.net/?retryWrites=true&w=majority&appName=Clusteruser';

// Define the updated Mongoose schema for users
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+\..+/, "Please fill a valid email address"],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    photo: {
        type: String,
        unique: true,
    },
    username: {
        type: String,
        unique: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    mobile_no: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, "Please fill a valid mobile number"],
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
    },
});

// Create a model
const User = mongoose.model("User", userSchema);

// Save user to the database
const saveUserToDatabase = async (userData) => {
    try {
        const user = new User({
            email: userData.email_addresses[0]?.email_address || "unknown",
            password: "hashedPassword", // Replace with actual password hashing
            photo: userData.profile_image_url || "",
            username: userData.username || "",
            firstName: userData.first_name || "",
            lastName: userData.last_name || "",
            mobile_no: userData.phone_numbers[0]?.phone_number || "0000000000",
            address: {
                street: userData.address?.street || "",
                city: userData.address?.city || "",
                state: userData.address?.state || "",
                country: userData.address?.country || "",
            },
        });
        await user.save();
        console.log("User saved successfully:", user);
    } catch (error) {
        console.error("Error saving user:", error);
    }
};

// Update user in the database
const updateUserInDatabase = async (userData) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: userData.email_addresses[0]?.email_address },
            {
                photo: userData.profile_image_url || "",
                username: userData.username || "",
                firstName: userData.first_name || "",
                lastName: userData.last_name || "",
                mobile_no: userData.phone_numbers[0]?.phone_number || "0000000000",
                address: {
                    street: userData.address?.street || "",
                    city: userData.address?.city || "",
                    state: userData.address?.state || "",
                    country: userData.address?.country || "",
                },
            },
            { new: true, upsert: true }
        );
        console.log("User updated successfully:", updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
    }
};

// Delete user from the database
const deleteUserFromDatabase = async (userId) => {
    try {
        await User.findOneAndDelete({ email: userId });
        console.log("User deleted successfully");
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};

module.exports = {
    saveUserToDatabase,
    updateUserInDatabase,
    deleteUserFromDatabase,
};
