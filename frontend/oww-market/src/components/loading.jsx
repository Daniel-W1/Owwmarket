import React from 'react'
import { DotLoader } from 'react-spinners';

const LoadingScreen = ({text}) => {
    return (
      <div className='w-full h-full flex flex-col justify-center items-center'>
          <DotLoader
            css={{display: 'block', margin: '0 auto'}}
            size={70}
            color={"#123abc"}
            loading={true}
            />
          <h1 className='text-2xl font-semibold'>{text}</h1>
      </div>
        );

}

export default LoadingScreen