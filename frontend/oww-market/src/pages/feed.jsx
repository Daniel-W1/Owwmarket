import React, { useEffect, useState, useRef, useCallback } from 'react'
import FeedSidebar from '../components/FeedSidebar'
import RightSidecard from '../components/RightSidecard'
import useScreenSize from '../hooks/useScreenSize'
import { GetFeedForUser } from '../hooks/helpers'
import LoadingScreen from '../components/loading'
import PostCard from '../components/PostCard'
import { imagefrombuffer } from "imagefrombuffer"; //first import 


const Feed = () => {
    const [loading, setloading] = useState(true);
    const [posts, setposts] = useState([]);
    const [pageNum, setpageNum] = useState(1);
    const [hasMore, sethasMore] = useState(false);

    const observer = useRef();
    const lastPostElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setpageNum(prevPageNum => prevPageNum + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    useEffect(() => {
        (
            async () => {
                const response = await GetFeedForUser(pageNum);
                const real_posts = response.posts;

                sethasMore(posts?.length + 3 < response.total)
                setposts([...posts, ...real_posts]);
            }
        )()
    }, [])

    useEffect(() => {
        (
            async () => {
                setloading(true)
                const response = await GetFeedForUser(pageNum);
                const real_posts = response.posts;

                sethasMore(posts?.length + 3 < response.total)
                setposts([...posts, ...real_posts]);
            }
        )()
    }, [pageNum])

    useEffect(() => {
        if (posts.length > 0) {
            setloading(false)
        }
    }, [posts])

    const screenSize = useScreenSize();

    return (
        <div className={`flex w-full justify-center px-10 md:justify-around lg:justify-around py-6`}>
            <FeedSidebar />
            <div className='flex-col w-3/4 md:w-1/2 lg:w-1/2'>
                {
                    posts.map((post, index) => {
                        return (index === posts.length - 1 ?
                            <div ref={lastPostElementRef} key={index} className='my-3'>
                                <PostCard post={post} />
                            </div>
                            :
                            <div key={index} className='my-3'>
                                <PostCard post={post} />
                            </div>
                        )

                    }
                    )
                }
                {loading && <LoadingScreen text={'loading..'} />}
            </div>
            <RightSidecard />
        </div>
    )
}

export default Feed