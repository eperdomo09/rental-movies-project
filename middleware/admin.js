module.exports = function (req, res, nex) {
  if (!req.user.isAdmin) return res.status(403).send("Access denied.");
  nex();
};
