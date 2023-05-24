const db = require("../models");
const unstopProblemDB = db.unstopProblem;

exports.getSeatNumbers = async (req, res) => {

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

    //If seats required are not available
    if ((totalSeats - seatsBooked) < seats) {
        res.status(400).json(`only ${totalSeats - seatsBooked} seats are available`)
        return;
    }

    //Finding All Seats That are Not available
    let seatsUnavailable = await unstopProblemDB.findAll({ attributes: ['seatNo'], raw: true });

    seatsUnavailable = seatsUnavailable.map(seat => {
        return seat.seatNo;
    })

    //creating a object that gives us the value of seats available in a row

    //example:if no seats are booked

    // {
    //     '1-7': [
    //       1, 2, 3, 4,
    //       5, 6, 7
    //     ],
    //     '8-14': [
    //        8,  9, 10, 11,
    //       12, 13, 14
    //     ],
    //     '15-21': [
    //       15, 16, 17, 18,
    //       19, 20, 21
    //     ],
    //     '22-28': [
    //       22, 23, 24, 25,
    //       26, 27, 28
    //     ],
    //     '29-35': [
    //       29, 30, 31, 32,
    //       33, 34, 35
    //     ],
    //     '36-42': [
    //       36, 37, 38, 39,
    //       40, 41, 42
    //     ],
    //     '43-49': [
    //       43, 44, 45, 46,
    //       47, 48, 49
    //     ],
    //     '50-56': [
    //       50, 51, 52, 53,
    //       54, 55, 56
    //     ],
    //     '57-63': [
    //       57, 58, 59, 60,
    //       61, 62, 63
    //     ],
    //     '64-70': [
    //       64, 65, 66, 67,
    //       68, 69, 70
    //     ],
    //     '71-77': [
    //       71, 72, 73, 74,
    //       75, 76, 77
    //     ],
    //     '78-80': [ 78, 79, 80 ]
    //   }
    
    // if seats 1-5  are booked

    // {
    //     '1-7': [ 6, 7 ],
    //     '8-14': [
    //        8,  9, 10, 11,
    //       12, 13, 14
    //     ],
    //     '15-21': [
    //       15, 16, 17, 18,
    //       19, 20, 21
    //     ],
    //     '22-28': [
    //       22, 23, 24, 25,
    //       26, 27, 28
    //     ],
    //     '29-35': [
    //       29, 30, 31, 32,
    //       33, 34, 35
    //     ],
    //     '36-42': [
    //       36, 37, 38, 39,
    //       40, 41, 42
    //     ],
    //     '43-49': [
    //       43, 44, 45, 46,
    //       47, 48, 49
    //     ],
    //     '50-56': [
    //       50, 51, 52, 53,
    //       54, 55, 56
    //     ],
    //     '57-63': [
    //       57, 58, 59, 60,
    //       61, 62, 63
    //     ],
    //     '64-70': [
    //       64, 65, 66, 67,
    //       68, 69, 70
    //     ],
    //     '71-77': [
    //       71, 72, 73, 74,
    //       75, 76, 77
    //     ],
    //     '78-80': [ 78, 79, 80 ]}

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

    let exactMatchFound = "";
    //To get an Array of seats available from seatsGroup Object
    // example if no seats are booked
    // [
    //     1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12,
    //    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    //    25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
    //    37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
    //    49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
    //    61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72,
    //    73, 74, 75, 76, 77, 78, 79, 80
    //  ]


    // example if seats 1-5  are booked
    // [
    //     6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17,
    //    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    //    30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
    //    42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
    //    54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65,
    //    66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77,
    //    78, 79, 80
    //  ] 


    let availableSeatsArr = []

    Object.keys(seatsGrouped).forEach(group => {
        availableSeatsArr.push(...seatsGrouped[group]);
        if (!exactMatchFound) {
            if (seatsGrouped[group].length >= seats) {
                exactMatchFound = group;
            }
        }
    })


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
