import React, { useState } from 'react'
import tw from 'twin.macro'
import styled from 'styled-components'
import Slider from 'react-slick';
import  {ReactComponent as ArrowLeftIcon}  from "../assets/images/arrow-left-3-icon.svg";
import {ReactComponent as ArrowRightIcon} from "../assets/images/arrow-right-3-icon.svg";

const ContentCard = tw.div`outline-none h-full flex! flex-col`;
const NameHeading = tw.div`mt-4 text-xl font-bold`;
const RowContainer =  tw.div`mt-auto flex justify-between items-center flex-col sm:flex-row`;
const ShopInfo = tw.blockquote`mt-4 mb-8 sm:mb-10 leading-relaxed font-medium text-gray-700 max-w-lg`;

const Controls = styled.div`
  ${tw`flex mt-8 sm:mt-0`}
  .divider {
    ${tw`my-3 border-r`}
  }
`;
const ControlButton = styled.button`
  ${tw`mx-3 p-4 rounded-full transition duration-300 bg-gray-200 hover:bg-gray-300 text-primary-500 hover:text-primary-700 focus:outline-none focus:shadow-outline`}
  svg {
    ${tw`w-4 h-4 stroke-3`}
  }
`;

const ShopPicture = tw.img`rounded-full w-24 h-24 sm:w-20 sm:h-20`;
const TextInfo = tw.div`text-center md:text-left sm:ml-6 mt-2 sm:mt-0`;
const ShopName = tw.h5`font-bold text-xl`;


const ShopCard = ({controls, Shop, SlideState}) => {

  return (
    <>
        <ContentCard>
            <RowContainer>
                <ShopInfo>
                    <ShopPicture src={Shop.image} alt={`${Shop.name} image`} />
                    <TextInfo>
                        <ShopName>{Shop.name}</ShopName>
                    </TextInfo>
                </ShopInfo>
                <Controls>
                      <ControlButton onClick={SlideState?.slickPrev}>
                        <ArrowLeftIcon />
                      </ControlButton>
                      <div className="divider" />
                      <ControlButton onClick={SlideState?.slickNext}>
                        <ArrowRightIcon />
                      </ControlButton>
                </Controls>

            </RowContainer>
            
            <NameHeading>{Shop.name}</NameHeading>
            <ShopInfo>{Shop.info}</ShopInfo>


        </ContentCard>
    </>
  )
}

export default ShopCard