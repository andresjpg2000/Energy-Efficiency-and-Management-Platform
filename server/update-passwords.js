const bcrypt = require("bcryptjs");
const { User } = require("./models/index"); 

// Script to update existing users' passwords to be encrypted using bcrypt.

// How to run:
//
// cd server
// node update-passwords.js

async function updateExistingUsers() {
  try {
    const users = await User.findAll();
    for (const user of users) {

      if (user.password.startsWith("$2a$")) {
        // Skip if already hashed
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      await user.update({ password: hashedPassword });
    }
    console.log("Passwords updated successfully.");
  } catch (error) {
    console.error("Error updating passwords:", error);
  }
}

updateExistingUsers();