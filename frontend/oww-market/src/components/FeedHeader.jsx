import { motion } from "framer-motion";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; // eslint-disable-line
import useAnimatedNavToggler from "../helpers/AnimatedNavToggler.jsx";
import logo from "../assets/images/logo.svg";
import { ReactComponent as MenuIcon } from "feather-icons/dist/icons/menu.svg";
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetProfileForUser } from "../hooks/helpers.jsx";
import { MdNotificationsActive } from "react-icons/md";
import { FcShop } from "react-icons/fc";
import { MdProductionQuantityLimits } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { imagefrombuffer } from "imagefrombuffer"; //first import 
import SearchBar from "./SearchBar.jsx";


const Header = tw.header`
  flex justify-between items-center
  max-w-screen-xl mx-auto sticky top-0 z-50 bg-white shadow-md px-4 h-16 py-2
`;

export const NavLinks = tw.div`inline-block lg:flex`;

/* hocus: stands for "on hover or focus"
 * hocus:bg-primary-700 will apply the bg-primary-700 class on hover or focus
 */
export const NavLink = tw.span`
  text-sm my-2 lg:mx-4 lg:my-0
  font-semibold tracking-wide transition duration-300
  pb-1 border-b-2 border-transparent hocus:text-primary-500
`;

export const PrimaryLink = tw(NavLink)`
  lg:mx-0
  px-8 py-3 rounded bg-primary-500 text-gray-100
  hocus:bg-primary-700 hocus:text-gray-200 focus:shadow-outline cursor-pointer
  border-b-0
`;

export const LogoLink = styled(NavLink)`
  ${tw`flex items-center font-black border-b-0 text-2xl! ml-0!`};

  img {
    ${tw`w-10 mr-3`}
  }
`;

export const MobileNavLinksContainer = tw.nav`flex flex-1 items-center justify-between lg:hidden`;
export const NavToggle = tw.button`
  lg:hidden z-20 focus:outline-none hocus:text-primary-500 transition duration-300
`;

export const MobileNavLinks = motion(styled.div`
${tw`lg:hidden z-10 fixed top-0 inset-x-0 m-4 mx-4 my-6 p-8 border text-center rounded-lg text-gray-900 bg-white`}
  ${NavLinks} {
    ${tw`flex flex-col items-center lg:flex-row`}
  }
`);

export const DesktopNavLinks = tw.nav`
  hidden lg:flex flex-1 justify-between items-center
`;

const userdata = localStorage.getItem("user");
let user = null;
if (userdata) {
  user = JSON.parse(userdata);
}


const Navbar = ({ roundedHeaderButton = false, logoLink, className, collapseBreakpointClass = "lg" }) => {

  const [user_profile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (
      async () => {
        const user_profile = await GetProfileForUser(user._id);
        const real_profile = user_profile.profile;
        setUserProfile(real_profile);
      }
    )();
  }, []);

  useEffect(() => {
    if (user_profile) {
      setLoading(false);
    }
  }, [user_profile]);

  let DesktopLinks = [
    <NavLinks key={1}>
      <Link to={`/shops/by/${user._id}`} >
        <div className="flex flex-col items-center">
          <FcShop className="text-2xl" />
          <NavLink tw="block">My Shops</NavLink>
        </div>
      </Link>
      <Link to={'/myproducts'}>
        <div className="flex flex-col items-center">
          <MdProductionQuantityLimits className="text-2xl" />
          <NavLink>My Products</NavLink>
        </div>
      </Link>
      {!user.seller && <Link>
        <div className="flex flex-col items-center">
          <GiReceiveMoney className="text-2xl" />
          <NavLink>Become a Seller</NavLink>
        </div>
      </Link>}
      <Link to={'/notification'}>
        <div className="flex flex-col items-center">
          <MdNotificationsActive className="text-2xl" />
          <NavLink>Notification</NavLink>
        </div>
      </Link>

    </NavLinks>
    ,
    <NavLinks key={2}>
      {!loading && <Link to={`/profile/of/${user_profile.owner}`}>
        <NavLink tw="lg:ml-12!" >
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-2">
              <img src={
                imagefrombuffer(
                  { data: user_profile?.image.data.data }
                )
              } alt="profile" className="w-full h-full rounded-full" />
            </div>
            <div className="text-xs">{user.name}</div>
          </div>
        </NavLink>
      </Link>}
    </NavLinks>
  ];

  let Mobilelinks = [
    <NavLinks key={1}>
      <Link to={`/shops/by/${user._id}`} >
        <div className="flex gap-x-1 items-center">
          <FcShop className="text-2xl" />
          <NavLink tw="block">My Shops</NavLink>
        </div>
      </Link>
      <Link to={'/myproducts'}>
        <div className="flex gap-x-1 items-center">
          <MdProductionQuantityLimits className="text-2xl" />
          <NavLink>My Products</NavLink>
        </div>
      </Link>
      {!user.seller && <Link>
        <div className="flex gap-x-1 items-center">
          <GiReceiveMoney className="text-2xl" />
          <NavLink>Become a Seller</NavLink>
        </div>
      </Link>}
      <Link to={'/notification'}>
        <div className="flex gap-x-1 items-center">
          <MdNotificationsActive className="text-2xl" />
          <NavLink>Notification</NavLink>
        </div>
      </Link>
      {!loading && <Link to={`profile/of/${user._id}`}>
        <NavLink tw="lg:ml-12!" >
          <div className="flex gap-x-1 items-center">
            <div className="w-8 h-8 rounded-full border-2">
              <img src={
                imagefrombuffer(
                  { data: user_profile?.image.data.data }
                )
              } alt="profile" className="w-full h-full rounded-full" />
            </div>
            <div className="text-xs">{user.name}</div>
          </div>
        </NavLink>
      </Link>}
    </NavLinks>
  ]
  // console.log(DesktopLinks, Mobilelinks);

  const { showNavLinks, animation, toggleNavbar } = useAnimatedNavToggler();
  const collapseBreakpointCss = collapseBreakPointCssMap[collapseBreakpointClass];

  const defaultLogoLink = (
    <LogoLink href="/">
      <div className="flex gap-x-2">
        <div className="flex items-center">
          <img src={logo} alt="logo" />
          <span>OwwMarket</span>
        </div>
      </div>
    </LogoLink>
  );

  logoLink = defaultLogoLink;

  console.log(loading, user_profile, Boolean(user_profile));
  return (
    <Header className={className || "header-Navbar"}>
      <DesktopNavLinks css={collapseBreakpointCss.desktopNavLinks}>
        <div className="flex items-center">
          {logoLink}
          <SearchBar />
        </div>

        {DesktopLinks}
      </DesktopNavLinks>

      <MobileNavLinksContainer css={collapseBreakpointCss.mobileNavLinksContainer}>
        {logoLink}
        <MobileNavLinks initial={{ x: "150%", display: "none" }} animate={animation} css={collapseBreakpointCss.mobileNavLinks}>
          {Mobilelinks}
        </MobileNavLinks>
        <NavToggle onClick={toggleNavbar} className={showNavLinks ? "open" : "closed"}>
          {showNavLinks ? <CloseIcon tw="w-6 h-6 mr-2 mt-4" /> : <MenuIcon tw="w-6 h-6" />}
        </NavToggle>
      </MobileNavLinksContainer>
    </Header>
  );
};

/* The below code is for generating dynamic break points for navbar.
 * Using this you can specify if you want to switch
 * to the toggleable mobile navbar at "sm", "md" or "lg" or "xl" above using the collapseBreakpointClass prop
 * Its written like this because we are using macros and we can not insert dynamic variables in macros
*/

const collapseBreakPointCssMap = {
  sm: {
    mobileNavLinks: tw`sm:hidden`,
    desktopNavLinks: tw`sm:flex`,
    mobileNavLinksContainer: tw`sm:hidden`
  },
  md: {
    mobileNavLinks: tw`md:hidden`,
    desktopNavLinks: tw`md:flex`,
    mobileNavLinksContainer: tw`md:hidden`
  },
  lg: {
    mobileNavLinks: tw`lg:hidden`,
    desktopNavLinks: tw`lg:flex`,
    mobileNavLinksContainer: tw`lg:hidden`
  },
  xl: {
    mobileNavLinks: tw`lg:hidden`,
    desktopNavLinks: tw`lg:flex`,
    mobileNavLinksContainer: tw`lg:hidden`
  }
};

// console.log(collapseBreakPointCssMap["lg"]);

export default Navbar;