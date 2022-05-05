import RateLimit from "express-rate-limit";

export default new RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  delayMs: 0,
  handler(req, res) {
    res.status(this.statusCode).json({
      RateLimit_ERROR: {
        code: this.statusCode,
        message:
          "The number of requests is limited, \
          Don't send too many requests at the same time",
      },
    });
  },
});
