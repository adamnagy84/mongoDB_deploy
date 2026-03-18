// middleware - VÁM kapu hogy elérjen a contorller-ben levő functionhöz
// most kell majd curly-t használni
export function logger(req, res, next) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.path} , ${req.originalUrl}`);
  next();
}

export function requireApiKey(req, res, next) {
  const apiKey = req.header("x-api-key");

  if (!apiKey) {
    return res.status(401).json({ message: "Missing X-API-KEY" });
  }
  console.log(apiKey);
  next();
}

export function attachUser(req, res, next) {
  const name = req.header("x-user");
  //kibovitjuk a req-et user-rel (mivel a request egy object)
  req.user = name ? { name } : null;
  next();
}

export function requireLogin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "User not logged in" });
  }
  next();
}
