import React, { useEffect, useState } from "react";
import AnimationRevealPage from "../helpers/AnimationRevealPage";
import { Container as ContainerBase } from "../helpers/Layout.jsx";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import illustration from "../assets/images/login-illustration.svg";
import logo from "../assets/images/logo.svg";
import googleIconImageSrc from "../assets/images/google-icon.png";
import { ReactComponent as LoginIcon } from "feather-icons/dist/icons/log-in.svg";
import { Link } from "react-router-dom";
import EmailPasswordLogin from "../hooks/emailpasslogin";
import LoadingScreen from "../components/loading";

const Container = tw(ContainerBase)`min-h-screen text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;

const SocialButtonsContainer = tw.div`flex flex-col items-center`;
const SocialButton = styled.a`
  ${tw`w-full max-w-xs font-semibold rounded-lg py-3 border text-gray-900 bg-gray-100 hocus:bg-gray-200 hocus:border-gray-400 flex items-center justify-center transition-all duration-300 focus:outline-none focus:shadow-outline text-sm mt-5 first:mt-0`}
  .iconContainer {
    ${tw`bg-white p-2 rounded-full`}
  }
  .icon {
    ${tw`w-4`}
  }
  .text {
    ${tw`ml-4`}
  }
`;

const DividerTextContainer = tw.div`my-12 border-b text-center relative`;
const DividerText = tw.div`leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform -translate-y-1/2 absolute inset-x-0 top-1/2 bg-transparent`;

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${props => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-sm bg-contain bg-center bg-no-repeat`}
`;

const googleAuth = () => {
  window.open(`http://localhost:3000/auth/google/`, "_self");
};

const LoginComponent = ({
  logoLinkUrl = "#",
  illustrationImageSrc = illustration,
  headingText = "Sign In To OwwMarket",
  socialButtons = [
    {
      iconImageSrc: googleIconImageSrc,
      text: "Sign In With Google",
      callbackFunc: googleAuth
    }
  ],
  submitButtonText = "Sign In",
  SubmitButtonIcon = LoginIcon,
  forgotPasswordUrl = "#",
  signupUrl = "/signup",

}) => {

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [errormessage, seterrormessage] = useState("");
  const [successmessage, setsuccessmessage] = useState("");

  const getFromQueryParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const success = urlParams.get('success')
    const message = urlParams.get('message') 
    return { error, success, message};
  };

  useEffect(() => {
    const query = getFromQueryParams();
    if(query.success === "true") {
      setsuccessmessage(query.message)
      setTimeout(() => {
        setsuccessmessage("")
      }, 2500);
    }
  }, [])

  useEffect(() => {
    const query = getFromQueryParams();
    if(query.error === "gmailerror") {
      seterrormessage("This email is already registered with a different method. Please log in using your existing method.")
    }
  }, [])
 
  const submit = async (e) => {
    setloading(true);
    e.preventDefault();
    const res = await EmailPasswordLogin(email, password);
    setloading(false);
    if(res.success === false) {
      seterrormessage(res.error)
    }
  }

  const handleEmailUpdate = (e) => {
    setemail(e.target.value);
    console.log(email);
  }

  const handlePasswordUpdate = (e) => {
    setpassword(e.target.value);
    console.log(password);
  } 

  return loading ? <LoadingScreen text={'loading..'}/> :
    <AnimationRevealPage>
      <Container>
        <Content>
          <MainContainer>
            <LogoLink href={logoLinkUrl}>
              <LogoImage src={logo} />
            </LogoLink>
            <MainContent>
              <Heading>{headingText}</Heading>
              <FormContainer>
                <SocialButtonsContainer>
                  {socialButtons.map((socialButton, index) => (
                    <SocialButton key={index} onClick={socialButton.callbackFunc} tw="cursor-pointer">
                      <span className="iconContainer">
                        <img src={socialButton.iconImageSrc} className="icon" alt="" />
                      </span>
                      <span className="text">{socialButton.text}</span>
                    </SocialButton>
                  ))}
                </SocialButtonsContainer>
                <DividerTextContainer>
                  <DividerText>Or Sign in with your e-mail</DividerText>
                </DividerTextContainer>
                { errormessage && (
                  <p className="text-center text-red-600 text-base font-semibold mb-2">{errormessage}</p>
                )}
                { successmessage && (
                  <p className="text-center text-green-600 text-base font-bold mb-2">{successmessage}</p>
                )}
                <Form>
                  <Input type="email" placeholder="Email" onChange={handleEmailUpdate} value={email}/>
                  <Input type="password" placeholder="Password" onChange={handlePasswordUpdate} />
                  <SubmitButton type="submit" onClick={submit}>
                    <SubmitButtonIcon className="icon" />
                    <span className="text">{submitButtonText}</span>
                  </SubmitButton>
                </Form>
                <p tw="mt-6 text-xs text-gray-600 text-center">
                  <Link to={forgotPasswordUrl} tw="border-b border-gray-500 border-dotted">
                    Forgot Password ?
                  </Link>
                </p>
                <p tw="mt-8 text-sm text-gray-600 text-center">
                  Dont have an account?{" "}
                  <Link to={signupUrl} tw="border-b border-gray-500 border-dotted">
                    Sign Up
                  </Link>
                </p>
              </FormContainer>
            </MainContent>
          </MainContainer>
          <IllustrationContainer>
            <IllustrationImage imageSrc={illustrationImageSrc} />
          </IllustrationContainer>
        </Content>
      </Container>
    </AnimationRevealPage>
};

export default LoginComponent;