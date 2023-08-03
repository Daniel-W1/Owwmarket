import { useRef } from "react"
import { useInView as useInViewFromFramer } from 'framer-motion'

const useInView = ({ once = true, margin = "-30px 0px 0px 0px"} = {}) => {
  const ref = useRef(null)
  const isInView = useInViewFromFramer(ref, {
    once: once
  })

  return [ref, isInView]
}

export default useInView;
/*
    The useInView hook returned by this custom hook allows React components to determine whether a specified DOM element is currently visible in the viewport or not. This is useful for scenarios where you want to trigger certain actions or animations based on the element's visibility, such as lazy-loading content, animating elements when they come into view, or tracking user interactions with specific elements.
*/