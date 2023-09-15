import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:3000')

const Auction = ({ StartPoint = 0 }) => {
    const [userBid, setUserBid] = useState(0)
    const [allBids, setAllBids] = useState([])

    useEffect(() => {
        socket.on('bid_received', setBids);
        return () => {
            socket.off('bid_received', setBids);
        }
    }, [])

    const handleBid = () => {
        setBid()
    }

    const handleChange = (e) => {
        setUserBid(+e.target.value)
    }

    const setBid = () => {
        socket.emit('bid', userBid)
    }

    const setBids = (userBid) => {
        setAllBids((prev) => [...prev, userBid])
    }

    return (
        <>
            <div className='w-full h-96 flex justify-center items-center'>
                <input type='number' min={StartPoint} onChange={handleChange} className='w-96 h-10 border-2 border-gray-700' />
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2' onClick={handleBid}>
                    Bid
                </button>
            </div>

            {
                allBids.map((bid, index) => {
                    return (
                        <div className='w-56 mx-auto bg-gray-400' key={index}>
                            <p>{bid}</p>
                        </div>
                    )
                }
                )
            }
        </>
    )
}

export default Auction