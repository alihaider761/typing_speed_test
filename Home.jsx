import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const Home = () => {
    const navigate = useNavigate();

  return (
    <>
    <div className='home'>
        <h1 className = 'heading'>Start Typing Test</h1>
        <button className='btn' onClick={() => navigate('/test')}>Start</button>
    </div>
        
    </>
  )
}

export default Home
