const Url = require("../models/url");
const sh = require("shorthash");

const clickUpdates = function (req, res, next) {
  let hash = req.params.hash; //* Express headers are auto converted to lowercase

  const click = req.useragent;

  const ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  const data = {
    browser: click.browser,
    platform: click.platform,
    clickDateTime: Date.now(),
    device: click.isMobile === true ? "Mobile" : "Desktop",
    ipAddress: ip,
  };
  console.log(hash, "::::::::::::::::::::::::::::::::::::");
  Url.findOneAndUpdate(
    { hashUrl: { $in: [hash] } },
    { $push: { clicks: data } },
    { new: true }
  )
    .then((_) => next())
    .catch((err) => res.json(err));
};
module.exports = { clickUpdates };
