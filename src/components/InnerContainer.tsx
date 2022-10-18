import { styled } from "@stitches/react";

const InnerContainer = styled("div", {
  background: "$secondaryBackground",
  padding: "$8",
  display: "flex",
  flexDirection: "column",
  gap: "$6",
  borderRadius: "24px"
});

export const InnerContainerTitle = styled("span", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "0.5rem",
  paddingBottom: "$4",
  borderBottom: "1px $textMuted solid"
});

export default InnerContainer;
