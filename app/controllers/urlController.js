const Url = require("../models/url");

module.exports.create = (req, res) => {
  const body = req.body;
  const hash = sh.unique(body.originalUrl);
  const userId = req.decoded._id;

  const url = new Url({
    title: body.title,
    originalUrl: body.originalUrl,
    hashUrl: hash,
    userId: userId,
  });
  url
    .save()
    .then((url) => {
      res.json({ data: url });
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.list = (req, res) => {
  const user = req.decoded._id;
  Url.find({ userId: { $in: [user] } })
    .then((url) => {
      res.json({ data: url });
    })
    .catch((err) => {
      res.json(err);
    });
};
module.exports.redirect = (req, res) => {
  Url.findOne({ hashUrl: { $in: [req.params.hash] } })
    .then((url) => {
      const redirectUrl = url.originalUrl;
      let check = redirectUrl.split(":");
      const main = check.includes("https" || "http")
        ? redirectUrl
        : `http://${redirectUrl}`;
      res.status(301).redirect(main);
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.show = (req, res) => {
  // const id = req.params.id;
  // const click = req.useragent;
  // const ip =
  //   req.headers["x-forwarded-for"] ||
  //   req.connection.remoteAddress ||
  //   req.socket.remoteAddress ||
  //   (req.connection.socket ? req.connection.socket.remoteAddress : null);
  // const data = {
  //   browser: click.browser,
  //   platform: click.platform,
  //   clickDateTime: Date.now(),
  //   device: click.isMobile === true ? "Mobile" : "Desktop",
  //   ipAddress: ip,
  // };
  // Url.findOneAndUpdate(
  //   id,
  //   { $push: { clicks: data } },
  //   { new: true },
  //   function (error, success) {
  //     if (error) res.json(error);
  //     res.json(success);
  //   }
  // );
};

module.exports.destroy = (req, res) => {
  const id = req.params.id;
  Url.findByIdAndDelete(id)
    .then((url) => {
      res.json(url);
    })
    .catch((err) => res.json(err));
};
