export default async function ensureLoggedIn(req, res, next) {
  try {
    // simple, readable check using optional chaining
    if (req.session?.isLoggedIn) return next();
    return res.redirect("/auth/login");
  } catch (err) {
    return next(err);
  }
}
