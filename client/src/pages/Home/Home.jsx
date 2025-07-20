import React from 'react'
import Leftsidebar from '../../component/Leftsidebar/Leftsidebar'
import Rightsidebar from '../../component/Rightsidebar/Rightsidebar'
import Homemainbar from '../../component/Homemainbar/homemainbar'
import '../../App.css'

const Home = ({slidein}) => {
  return (
    <div className="home-container-1">
      <Leftsidebar slidein={slidein}/>
      <div className="home-container-2">
        <Homemainbar/>
        <Rightsidebar/>
      </div>
    </div>
  )
}

export default Home