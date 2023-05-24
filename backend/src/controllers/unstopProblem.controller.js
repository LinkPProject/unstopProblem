const db = require("../models");
const unstopProblemDB = db.unstopProblem;

exports.getSeatNumbers = async (req, res) => {

    console.log("API hit ")

    const totalSeats = 80
    const seatsPerRow = 8

    if (!req.body.seats) {
        res.status(400).json("Seats value is Required");
        return;
    }

    if (!req.body.bookedBy) {
        res.status(400).json("bookedBy value is Required");
        return;
    }

    const { seats, bookedBy } = req.body;

    if (seats > seatsPerRow) {
        res.status(400).json(`User can book only ${seatsPerRow} tickets at a time`)
        return;
    }

    const seatsBooked = await unstopProblemDB.count();

    if ((totalSeats - seatsBooked) < seats) {
        res.status(400).json(`only ${totalSeats - seatsBooked} seats are available`)
        return;
    }

    let seatsUnavailable = await unstopProblemDB.findAll({ attributes: ['seatNo'], raw: true });

    seatsUnavailable = seatsUnavailable.map(seat => {
        return seat.seatNo;
    })

    const seatsGrouped = {};

    for (let i = 0; i <= Math.floor(totalSeats / seatsPerRow); i++) {
        const seatsAvailable = [];
        if (i === Math.floor(totalSeats / seatsPerRow)) {
            if (!(totalSeats % seatsPerRow === 0)) {
                for (let j = (seatsPerRow * i) + 1; j < totalSeats + 1; j++) {
                    if (!seatsUnavailable.includes(j)) {
                        seatsAvailable.push(j)
                    }
                }
                seatsGrouped[`${(seatsPerRow * i) + 1}-${totalSeats}`] = seatsAvailable;
            }
        }
        else {
            for (let j = (seatsPerRow * i) + 1; j < seatsPerRow * (i + 1) + 1; j++) {
                if (!seatsUnavailable.includes(j)) {
                    seatsAvailable.push(j)
                }
            }
            seatsGrouped[`${(seatsPerRow * i) + 1}-${seatsPerRow * (i + 1)}`] = seatsAvailable;
        }
    }

    console.log(seatsGrouped, "seats grouped")

    let exactMatchFound = "";

    let availableSeatsArr = []

    Object.keys(seatsGrouped).forEach(group => {
        availableSeatsArr.push(...seatsGrouped[group]);
        if (!exactMatchFound) {
            if (seatsGrouped[group].length >= seats) {
                exactMatchFound = group;
            }
        }
    })

    console.log(availableSeatsArr, "available seats arr")

    const objToCreate = []

    for (let i = 0; i < seats; i++) {
        objToCreate.push(!exactMatchFound ? { seatNo: availableSeatsArr[i], bookedBy: bookedBy } : { seatNo: seatsGrouped[exactMatchFound][i], bookedBy: bookedBy })
    }


    unstopProblemDB.bulkCreate(objToCreate)
        .then(function (response) {
            res.json(response);
        })
        .catch(function (error) {
            res.json(error);
        })

};
