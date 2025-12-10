export default function requireRole(role) {
  // returns an async middleware function
  return async (req, res, next) => {
    try {
      const userType = req.session?.user?.userType;
      if (userType === role) return next();

      // If user is logged in but doesn't have role, show 403-ish page
      if (req.session?.isLoggedIn) {
        return res.status(403).render("404", {
          isLoggedIn: !!req.session.isLoggedIn,
          userType: userType || "",
        });
      }

      // otherwise redirect to login
      return res.redirect("/auth/login");
    } catch (err) {
      return next(err);
    }
  };
}
