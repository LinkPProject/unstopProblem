module.exports = (sequelize, Sequelize) => {
    const unstopProblem = sequelize.define("unstop_problem", {
      seatNo: {
        type: Sequelize.INTEGER
      },
      bookedBy: {
        type: Sequelize.INTEGER
      }
    });
    // unstopProblem.sync({alter:true});
    return unstopProblem;
    
  };