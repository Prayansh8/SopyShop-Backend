const errorHandeler = (req, res, next) => {
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const massage = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    return res.status(400).send(massage);
  }

  // worong jwt error
  if (err.name === "jsonwebtokenError") {
    const massage = `Json web token is invalid, try again`;
    return res.status(400).send(massage);
  }

  // worong jwt error
  if (err.name === "tokenExpiredError") {
    const massage = `Json web token is Expired, try again`;
    return res.status(400).send(massage);
  }
};

module.exports = { errorHandeler };
