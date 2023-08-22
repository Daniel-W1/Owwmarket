import React from 'react'
import { DotLoader } from 'react-spinners';

const LoadingScreen = () => {
    return (
        <div className='w-full h-screen flex justify-center items-center'> 
          <DotLoader
            css={{display: 'block', margin: '0 auto'}}
            size={150}
            color={"#123abc"}
            loading={true}
          />
         </div>
        );

}

export default LoadingScreen