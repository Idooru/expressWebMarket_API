import Limiter from "express-rate-limit";

export default new Limiter({
  windowMs: 1 * 60 * 1000,
  max: 5,
  hendler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode,
      message: "one request one minute",
    });
  },
});
