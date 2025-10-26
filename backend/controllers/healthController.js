const healthCheck = (req, res) => {
  res.status(201).send('Created');
};

module.exports = {
  healthCheck
};