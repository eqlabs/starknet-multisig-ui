import { motion } from "framer-motion";
import { styled } from "../../stitches.config";

const Container = styled(motion.div, {
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "778px",
  margin: "0 auto",
  borderRadius: "45px",
  py: "$7",
  px: "$8",
  background: "$background"
});

export default Container
