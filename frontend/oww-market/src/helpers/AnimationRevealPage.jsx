// Import required modules and components.
import React from "react";
import tw from "twin.macro";
import { motion } from "framer-motion";
import useInView from "./UseinView";

// StyledDiv is a styled div using the twin.macro library.
const StyledDiv = tw.div`font-display min-h-screen text-secondary-500 p-8 overflow-hidden`;

// AnimationReveal component handles the animation of its children when they come into view.
const AnimationReveal = ({ disabled, children }) => {
  // If animation is disabled, render the children as-is.
  if (disabled) {
    return <>{children}</>;
  }

  // If children is not an array, convert it into an array with a single element.
  if (!Array.isArray(children)) children = [children];

  // Directions for slide-in animation (left, right).
  const directions = ["left", "right"];

  // Map through the children and wrap each child with AnimatedSlideInComponent for animation.
  const childrenWithAnimation = children.map((child, i) => {
    return (
      <AnimatedSlideInComponent key={i} direction={directions[i % directions.length]}>
        {child}
      </AnimatedSlideInComponent>
    );
  });

  // Render children with animation wrappers.
  return <>{childrenWithAnimation}</>;
};

// AnimatedSlideInComponent handles the slide-in animation of its children when they come into view.
const AnimatedSlideInComponent = ({ direction = "left", offset = 30, children }) => {
  // useInView hook returns a reference and a boolean indicating if the element is in view.
  const [ref, inView] = useInView({ margin: `-${offset}px 0px 0px 0px` });

  // Set x value for initial and target positions based on the animation direction.
  const x = { target: "0%" };
  if (direction === "left") x.initial = "-150%";
  else x.initial = "150%";

  // Render the component with motion for slide-in animation.
  return (
    <div ref={ref}>
      <motion.section
        initial={{ x: x.initial }}
        animate={{
          x: inView && x.target,
          transitionEnd: {
            x: inView && 0
          }
        }}
        transition={{ type: "spring", damping: 19 }}
      >
        {children}
      </motion.section>
    </div>
  );
};

// Export a default component that wraps the AnimationReveal component with StyledDiv styling.
export default props => (
  <StyledDiv className="App">
    <AnimationReveal {...props} />
  </StyledDiv>
);
