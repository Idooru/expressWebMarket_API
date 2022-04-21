const User = require("../models/users");

async function Update(package, userId) {
  try {
    await User.update(package, {
      where: { id: userId },
    });
  } catch (err) {
    throw err.message === "Validation error" ? new Error("Same User") : err;
  }
}

async function Destroy(userId) {
  try {
    await User.destroy({
      where: { id: userId },
    });
  } catch (err) {
    throw err;
  }
}

async function GetResult(userId, purpose) {
  try {
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error("No User");
      error.id = userId;
      error.purpose = purpose === "Update" ? "Update" : "Delete";
      throw error;
    }

    return user;
  } catch (err) {
    throw err;
  }
}

module.exports = { Update, GetResult, Destroy };
