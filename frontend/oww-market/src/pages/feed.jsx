import React from 'react'
import Sidebar from '../components/Sidebar'
import PostCard from '../components/PostCard'
import FeedSidebar from '../components/FeedSidebar'
import RightSidecard from '../components/RightSidecard'
import useScreenSize from '../hooks/useScreenSize'

const Feed = () => {
    const posts = [
        <PostCard/>,
        <PostCard/>,
        <PostCard/>,
        <PostCard/>,
        <PostCard/>,
        <PostCard/>,
        <PostCard/>,
        <PostCard/>,
        <PostCard/>,
        <PostCard/>,
    ]

    const screenSize = useScreenSize();

  return (
    <div className={`flex w-full justify-center px-10 md:justify-around lg:justify-around py-10`}>
        <FeedSidebar/>
        <div className='flex-col w-3/4 md:w-1/2 lg:w-1/2'>
            {
                posts.map((post, index) => {
                    return (
                        <div key={index} className='mb-4'>
                            {post}
                        </div>
                    )
                }
                )
            }
        </div>
        <RightSidecard />
    </div>
  )
}

export default Feed