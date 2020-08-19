const { User } = require("../models/user");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const client = require("twilio")(
  process.env.ACCOUNT_SSID_TWILIO,
  process.env.AUTH_TOKEN_TWILIO
);
const otpGenerator = require("otp-generator");

const Otp = otpGenerator.generate(6, {
  upperCase: false,
  specialChars: false,
  digits: true,
  alphabets: false,
});

module.exports.register = async (req, res) => {
  // *Validate the Data before creasting user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //* Checking if the user is already in the database
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists");

  //* Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //* Create a new user
  const user = new User({
    user_name: req.body.user_name,
    email: req.body.email,
    password: hashedPassword,
    mobile: req.body.mobile,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports.login = async (req, res) => {
  //* Validate the Data before creasting user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //* Checking if the email is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Email or Password is wrong");

  //* Checking if Password is correct
  if (req.body.password) {
    const passwordCheck = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordCheck)
      return res.status(400).send("Email or Password is wrong");

    //* Create and assign a token
    const token = jwt.sign({ _id: user._id }, "process.env.TOKEN_SECRET", {
      expiresIn: "24h",
    });
    req.header("Authorization", token);
    res.status(200).json({ token });
  }

  if (req.body.isOtp === true) {
    if (!user.mobile) return res.status(400).send("No number registred");
    if (req.body.isOtp === true && !req.body.otp) {
      console.log(Otp, "otp");
      client.messages
        .create({
          body: `Your Opt is - ${Otp}`,
          from: "+12055309483",
          to: `+91 ${user.mobile}`,
        })
        .then((res) => {
          console.log(res.message);
        })
        .catch((err) => console.log(err));
      res.status(200).send("Otp has been sent to the registreg mobile number");
    }
  }
  if (req.body.otp && req.body.email) {
    if (Otp != req.body.otp)
      return res.status(400).send("Otp entered is wrong");
    const token = jwt.sign({ _id: user._id }, "process.env.TOKEN_SECRET", {
      expiresIn: "24h",
    });
    req.header("Authorization", token);
    res.status(200).json({ token });
  }
};

module.exports.listUser = (req, res) => {
  User.find()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => console.log(err));
};
