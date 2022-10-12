import { CSS, styled } from "@stitches/react";

const Path = styled("path", {
  stroke: "$buttonText",
});

type IconProps = {
  css?: CSS;
}

export const RightArrow = ({css}: IconProps) => (
  <svg width="21" height="20" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M3.91321 12H20.4132" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" css={Object.assign(css || {}, {transform: "translate(1px, 0)"})}/>
    <Path d="M13.6632 5.25L20.4132 12L13.6632 18.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" css={Object.assign(css || {}, {transform: "translate(1px, 0)"})}/>
  </svg>
)

export const ClockCounterClockwise = ({css}: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M12 7.5V12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" css={css}/>
    <Path d="M15.8971 14.25L12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" css={css}/>
    <Path d="M6.73437 9.34839H2.98438V5.59839" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" css={css}/>
    <Path d="M6.16635 17.8336C7.32014 18.9874 8.79015 19.7732 10.3905 20.0915C11.9908 20.4098 13.6496 20.2464 15.1571 19.622C16.6646 18.9976 17.9531 17.9402 18.8596 16.5835C19.7661 15.2268 20.25 13.6317 20.25 12C20.25 10.3683 19.7661 8.77325 18.8596 7.41655C17.9531 6.05984 16.6646 5.00242 15.1571 4.378C13.6496 3.75357 11.9908 3.5902 10.3905 3.90853C8.79015 4.22685 7.32014 5.01259 6.16635 6.16637L2.98438 9.34835" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" css={css}/>
  </svg>
)

export const House = ({css}: IconProps) => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M14.2495 19.9994V15.4993C14.2495 15.3004 14.1704 15.1096 14.0298 14.969C13.8891 14.8283 13.6984 14.7493 13.4995 14.7493H10.4995C10.3005 14.7493 10.1098 14.8283 9.96912 14.969C9.82847 15.1096 9.74945 15.3004 9.74945 15.4993V19.9994C9.74945 20.1983 9.67045 20.389 9.52981 20.5297C9.38918 20.6703 9.19844 20.7494 8.99954 20.7494L4.50009 20.75C4.40159 20.75 4.30406 20.7306 4.21305 20.6929C4.12205 20.6552 4.03936 20.6 3.9697 20.5303C3.90005 20.4607 3.8448 20.378 3.8071 20.287C3.7694 20.196 3.75 20.0985 3.75 20V11.3318C3.75 11.2273 3.77183 11.124 3.8141 11.0284C3.85637 10.9329 3.91814 10.8472 3.99545 10.7769L11.4949 3.95803C11.633 3.8325 11.8129 3.76295 11.9995 3.76294C12.186 3.76293 12.3659 3.83248 12.504 3.95799L20.0045 10.7769C20.0818 10.8472 20.1436 10.9329 20.1859 11.0284C20.2282 11.124 20.25 11.2274 20.25 11.3319V20C20.25 20.0985 20.2306 20.196 20.1929 20.287C20.1552 20.378 20.1 20.4607 20.0303 20.5304C19.9606 20.6 19.878 20.6552 19.7869 20.6929C19.6959 20.7306 19.5984 20.75 19.4999 20.75L14.9994 20.7494C14.8005 20.7494 14.6097 20.6703 14.4691 20.5297C14.3285 20.389 14.2494 20.1983 14.2495 19.9994V19.9994Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" css={css}/>
  </svg>
)
