export function isMaster(req, res, next) {
  try {
    if (req.isMaster) {
      return next();
    }
    throw new Error("you are not master");
  } catch (err) {
    return res.status(403).json({
      Auth_ERROR: {
        code: 403,
        message: err.message,
      },
    });
  }
}
