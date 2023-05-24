import { useState } from "react";
import axios from "axios";

const UnstopProblem = () => {
    const [seats, setSeats] = useState(0);
    const [userId, setUserId] = useState(0);
    const [responseFromAPI, setResponseFromApi] = useState([])
    const [apiError, setApiError] = useState("NA")
    let handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const responseFromAPI = await axios.post("http://localhost:8080/api/unstopProblem/getSeatNumbers", {

                "seats": Number(seats),
                "bookedBy": Number(userId)

            })

            console.log("reaching 1")

            setResponseFromApi(responseFromAPI.data)
            console.log("reaching 2")

        } catch (err) {
            console.log(err, "error Catched")
            setApiError(err.response.data)

            console.log(err.response.data)
            console.log(apiError, "API Error")
        }
    };
    return (
        <>
            <div class="flex items-center justify-center mt mx-10">
                <form class="w-full max-w-lg">
                    <div class="flex flex-wrap -mx-3 mb-6">
                        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="company-name">
                                seats
                            </label>
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-orange-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="company-name" type="text" placeholder="Google" value={seats} onChange={(e) => setSeats(e.target.value)}></input>
                            {/* <p class="text-red-500 text-xs italic">Please fill out this field.</p> */}
                        </div>
                        <div class="w-full md:w-1/2 px-3">
                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="designation">
                                user id
                            </label>
                            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-orange-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="designation" type="text" placeholder="Software-Engineer" value={userId} onChange={(e) => setUserId(e.target.value)}></input>
                        </div>
                    </div>

                    <div className='flex items-center justify-center mt-8 mb-8'>
                        <button onClick={(e) => { handleSubmit(e) }} type="submit" className='bg-yellow-500 py-1 px-8 rounded-full font-bold mt-4'>Create</button>
                    </div>

                </form>
            </div>
            {responseFromAPI.length ?
                <div className='grid place-items-center mb-4'>
                    <h1 style={{ textAlign: 'center' }} className='text-4xl font-bold'>Seats Booked Are:</h1>
                    {responseFromAPI.map(seat => {
                        return (
                            <h1 style={{ textAlign: 'center', color: 'green' }} className='text-4xl font-bold'>{seat.seatNo}</h1>
                        )
                    })}
                </div>

                : <div className='grid place-items-center mb-4'>
                    <h1 style={{ textAlign: 'center', color: 'red' }} className='text-4xl font-bold'>{apiError}</h1>
                </div>
            }
        </>


    )
};

export default UnstopProblem;