export function IsLogin(err, res, next) {
  console.error(err);
  return err.message === "Already Login"
    ? res.status(401).json({
        Auth_ERROR: {
          code: 401,
          message: `Failed to login, You are already logged in`,
        },
      })
    : next(err);
}
