import { CSS, styled } from "@stitches/react";

const Path = styled("path", {
  stroke: "$buttonText",
});

type IconProps = {
  width?: string;
  height?: string;
  viewBox?: string;
  css?: CSS;
}

export const RightArrow = ({css, width="21", height="20", viewBox="0 0 25 24"}: IconProps) => (
  <svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M3.91321 12H20.4132" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" css={Object.assign(css || {}, {transform: "translate(1px, 0)"})}/>
    <Path d="M13.6632 5.25L20.4132 12L13.6632 18.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" css={Object.assign(css || {}, {transform: "translate(1px, 0)"})}/>
  </svg>
)

export const ClockCounterClockwise = ({css, width="24", height="24", viewBox="0 0 24 24"}: IconProps) => (
  <svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M12 7.5V12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" css={css}/>
    <Path d="M15.8971 14.25L12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" css={css}/>
    <Path d="M6.73437 9.34839H2.98438V5.59839" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" css={css}/>
    <Path d="M6.16635 17.8336C7.32014 18.9874 8.79015 19.7732 10.3905 20.0915C11.9908 20.4098 13.6496 20.2464 15.1571 19.622C16.6646 18.9976 17.9531 17.9402 18.8596 16.5835C19.7661 15.2268 20.25 13.6317 20.25 12C20.25 10.3683 19.7661 8.77325 18.8596 7.41655C17.9531 6.05984 16.6646 5.00242 15.1571 4.378C13.6496 3.75357 11.9908 3.5902 10.3905 3.90853C8.79015 4.22685 7.32014 5.01259 6.16635 6.16637L2.98438 9.34835" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" css={css}/>
  </svg>
)

export const House = ({css, width="24", height="25", viewBox="0 0 24 25"}: IconProps) => (
  <svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M14.2495 19.9994V15.4993C14.2495 15.3004 14.1704 15.1096 14.0298 14.969C13.8891 14.8283 13.6984 14.7493 13.4995 14.7493H10.4995C10.3005 14.7493 10.1098 14.8283 9.96912 14.969C9.82847 15.1096 9.74945 15.3004 9.74945 15.4993V19.9994C9.74945 20.1983 9.67045 20.389 9.52981 20.5297C9.38918 20.6703 9.19844 20.7494 8.99954 20.7494L4.50009 20.75C4.40159 20.75 4.30406 20.7306 4.21305 20.6929C4.12205 20.6552 4.03936 20.6 3.9697 20.5303C3.90005 20.4607 3.8448 20.378 3.8071 20.287C3.7694 20.196 3.75 20.0985 3.75 20V11.3318C3.75 11.2273 3.77183 11.124 3.8141 11.0284C3.85637 10.9329 3.91814 10.8472 3.99545 10.7769L11.4949 3.95803C11.633 3.8325 11.8129 3.76295 11.9995 3.76294C12.186 3.76293 12.3659 3.83248 12.504 3.95799L20.0045 10.7769C20.0818 10.8472 20.1436 10.9329 20.1859 11.0284C20.2282 11.124 20.25 11.2274 20.25 11.3319V20C20.25 20.0985 20.2306 20.196 20.1929 20.287C20.1552 20.378 20.1 20.4607 20.0303 20.5304C19.9606 20.6 19.878 20.6552 19.7869 20.6929C19.6959 20.7306 19.5984 20.75 19.4999 20.75L14.9994 20.7494C14.8005 20.7494 14.6097 20.6703 14.4691 20.5297C14.3285 20.389 14.2494 20.1983 14.2495 19.9994V19.9994Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" css={css}/>
  </svg>
)

export const PencilLine = ({css, width="16", height="17", viewBox="0 0 16 17"}: IconProps) => (
  <svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M6 13.9999H3C2.86739 13.9999 2.74021 13.9472 2.64645 13.8535C2.55268 13.7597 2.5 13.6325 2.5 13.4999V10.707C2.5 10.6414 2.51293 10.5764 2.53806 10.5157C2.56319 10.455 2.60002 10.3999 2.64645 10.3535L10.1464 2.85348C10.2402 2.75971 10.3674 2.70703 10.5 2.70703C10.6326 2.70703 10.7598 2.75971 10.8536 2.85348L13.6464 5.64637C13.7402 5.74014 13.7929 5.86732 13.7929 5.99992C13.7929 6.13253 13.7402 6.25971 13.6464 6.35348L6 13.9999Z" css={css} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M8.5 4.5L12 8" css={css} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M13.5 13.9999H6.00005L2.53186 10.5317" css={css} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const Hourglass = ({css, width="24", height="24", viewBox="0 0 24 24"}: IconProps) => (
  <svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M5.56067 3.75H18.4394C18.5877 3.75 18.7327 3.79399 18.856 3.8764C18.9794 3.95881 19.0755 4.07594 19.1323 4.21299C19.189 4.35003 19.2039 4.50083 19.1749 4.64632C19.146 4.7918 19.0746 4.92544 18.9697 5.03033L12 12L5.03034 5.03033C4.92545 4.92544 4.85402 4.7918 4.82508 4.64632C4.79614 4.50083 4.81099 4.35003 4.86776 4.21299C4.92453 4.07594 5.02065 3.95881 5.14399 3.8764C5.26733 3.79399 5.41233 3.75 5.56067 3.75Z" css={css} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M5.56067 20.25H18.4394C18.5877 20.25 18.7327 20.206 18.856 20.1236C18.9794 20.0412 19.0755 19.9241 19.1323 19.787C19.189 19.65 19.2039 19.4992 19.1749 19.3537C19.146 19.2082 19.0746 19.0746 18.9697 18.9697L12 12L5.03034 18.9697C4.92545 19.0746 4.85402 19.2082 4.82508 19.3537C4.79614 19.4992 4.81099 19.65 4.86776 19.787C4.92453 19.9241 5.02065 20.0412 5.14399 20.1236C5.26733 20.206 5.41233 20.25 5.56067 20.25Z" css={css} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M6.75 6.75H17.25" css={css} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const SquareArrow = ({css, width="24", height="24", viewBox="0 0 24 24"}: IconProps) => (
  <svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M3.75 4.5L3.75 19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5Z" css={css} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M10.125 9.375H14.625V13.875" css={css} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9.375 14.625L14.625 9.375" css={css} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const Note = ({css, width="16", height="17", viewBox="0 0 16 17"}: IconProps) => (
  <svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M6 6.5H10" css={css} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M6 8.5H10" css={css} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M6 10.5H8" css={css} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9.79289 14H3C2.86739 14 2.74021 13.9473 2.64645 13.8536C2.55268 13.7598 2.5 13.6326 2.5 13.5V3.5C2.5 3.36739 2.55268 3.24021 2.64645 3.14645C2.74021 3.05268 2.86739 3 3 3H13C13.1326 3 13.2598 3.05268 13.3536 3.14645C13.4473 3.24021 13.5 3.36739 13.5 3.5V10.2929C13.5 10.3586 13.4871 10.4236 13.4619 10.4842C13.4368 10.5449 13.4 10.6 13.3536 10.6464L10.1464 13.8536C10.1 13.9 10.0449 13.9368 9.98423 13.9619C9.92357 13.9871 9.85855 14 9.79289 14V14Z" css={css} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M13.4548 10.4995H10V13.9545" css={css} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const User = ({css, width="16", height="17", viewBox="0 0 16 17"}: IconProps) => (
  <svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M8 10.5C10.2091 10.5 12 8.70914 12 6.5C12 4.29086 10.2091 2.5 8 2.5C5.79086 2.5 4 4.29086 4 6.5C4 8.70914 5.79086 10.5 8 10.5Z" css={css} strokeMiterlimit="10"/>
    <Path d="M1.93677 13.9994C2.55149 12.9354 3.4354 12.0519 4.49969 11.4376C5.56399 10.8234 6.77119 10.5 8.00003 10.5C9.22886 10.5 10.4361 10.8234 11.5003 11.4377C12.5646 12.052 13.4485 12.9355 14.0632 13.9995" css={css} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const Caret = ({css, width="17", height="10", viewBox="0 0 17 10"}: IconProps) => (
  <svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M1 1L8.5 8L16 1" css={css}/>
  </svg>
)
