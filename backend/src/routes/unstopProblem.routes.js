const router = require('express').Router();
const unstopProblemController = require("../controllers/unstopProblem.controller.js");

router.route('/getSeatNumbers').post(unstopProblemController.getSeatNumbers);

module.exports = router;

