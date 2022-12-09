import { ChangeEvent, ChangeEventHandler, CSSProperties, MouseEventHandler, useCallback, useState } from "react";
import { styled } from "../../stitches.config";
import Button from "./Button";
import { RightArrow } from "./Icons";

export const AdvanceButton = (props: InputProps) => (
  <Button style={Object.assign({ display: "flex", borderRadius: "9999px", height: "2rem", width: "2rem", background: "$buttonBg", border: "0", cursor: "pointer", justifyContent: "center", alignItems: "center", padding: "0", lineHeight: 0 }, props.style || {})} onClick={props.onClick}>
    <RightArrow />
  </Button>
)

export const EmbeddedSubmitInput = (props: InputProps) => (
  <div style={{display: "flex", flexDirection: "row", position: "relative", alignItems: "center"}}>
    <Input value={props.value} type={props.type} size={props.size} variant={props.variant} cursor={props.cursor} onChange={props.onChange} placeholder={props.placeholder} style={{ width: "100%"}}>
    </Input>
    <AdvanceButton onClick={props.onClick} style={{ position: "absolute", right: "0.3rem", opacity: props.disabled ? "0.2" : "1" }}/>
  </div>
)

export const Input = styled("input", {
  // Reset
  appearance: "none",
  borderWidth: "0",
  borderRadius: "9999px",
  boxSizing: "border-box",
  fontFamily: "inherit",
  outline: "none",
  width: "100%",
  flex: "1",
  backgroundColor: "transparent",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  px: "$2",
  fontSize: "$md",
  lineHeight: 1,
  color: "$mauve12",
  boxShadow: `0 0 0 1px $colors$inputBorder`,
  height: 35,
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  "&::before": {
    boxSizing: "border-box",
  },
  "&::after": {
    boxSizing: "border-box",
  },
  fontVariantNumeric: "tabular-nums",

  "&:-webkit-autofill": {
    boxShadow:
      "inset 0 0 0 1px $colors$indigo6, inset 0 0 0 100px $colors$indigo3",
  },

  "&:-webkit-autofill::first-line": {
    fontFamily: "$untitled",
    color: "$indigo12",
  },

  "&:focus": {
    boxShadow: `0 0 0 1px $colors$focusOutline`,
    "&:-webkit-autofill": {
      boxShadow: `0 0 0 1px $colors$focusOutline`,
    },
  },
  "&::placeholder": {
    color: "$textMuted",
  },
  "&:disabled": {
    opacity: "0.5",
    pointerEvents: "none",
    cursor: "not-allowed",
    "&::placeholder": {
      color: "$mauve7",
    },
  },
  "&:read-only": {
    color: "$muted",
    "&:focus": {
      boxShadow: "inset 0px 0px 0px 1px $colors$focusOutline",
    },
  },

  variants: {
    size: {
      sm: {
        height: "$5",
        fontSize: "$1",
        lineHeight: "$sizes$4",
        "&:-webkit-autofill::first-line": {
          fontSize: "$1",
        },
      },
      md: {
        height: "$10",
        padding: "0 $3",
        fontSize: "$2",
        lineHeight: "$sizes$7",
        "&:-webkit-autofill::first-line": {
          fontSize: "$1",
        },
      },
      lg: {
        height: "$12",
        fontSize: "$2",
        lineHeight: "$sizes$6",
        "&:-webkit-autofill::first-line": {
          fontSize: "$3",
        },
      },
    },
    variant: {
      ghost: {
        boxShadow: "none",
        backgroundColor: "transparent",
        "@hover": {
          "&:hover": {
            boxShadow: "inset 0 0 0 1px $colors$mauve7",
          },
        },
        "&:focus": {
          backgroundColor: "$loContrast",
          boxShadow: `0 0 0 1px $colors$mauve10`,
        },
        "&:disabled": {
          backgroundColor: "transparent",
        },
        "&:read-only": {
          backgroundColor: "transparent",
        },
      },
      deep: {
        backgroundColor: "$deep",
        boxShadow: "none",
      },
    },
    state: {
      invalid: {
        boxShadow: "inset 0 0 0 1px $colors$error",
        "&:focus": {
          boxShadow:
            "inset 0px 0px 0px 1px $colors$error, 0px 0px 0px 1px $colors$error",
        },
      },
      valid: {
        boxShadow: "inset 0 0 0 1px $colors$success",
        "&:focus": {
          boxShadow:
            "inset 0px 0px 0px 1px $colors$success, 0px 0px 0px 1px $colors$success",
        },
      },
    },
    cursor: {
      default: {
        cursor: "default",
        "&:focus": {
          cursor: "text",
        },
      },
      text: {
        cursor: "text",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const Select = styled("select", {
  // Reset

  position: "relative",
  borderWidth: "0",
  boxSizing: "border-box",
  fontFamily: "inherit",
  outline: "none",
  width: "auto",
  flex: "1",
  backgroundColor: "transparent",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  px: "$2",
  fontSize: "$md",
  lineHeight: 1,
  color: "$mauve12",
  boxShadow: `0 0 0 1px $colors$inputBorder`,
  height: 35,
  borderRadius: "32px",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  padding: "0 $1 0 $2",
  "&::before": {
    boxSizing: "border-box",
  },
  "&::after": {
    boxSizing: "border-box",
  },
  fontVariantNumeric: "tabular-nums",

  "&:-webkit-autofill": {
    boxShadow:
      "inset 0 0 0 1px $colors$indigo6, inset 0 0 0 100px $colors$indigo3",
  },

  "&:-webkit-autofill::first-line": {
    fontFamily: "$untitled",
    color: "$indigo12",
  },

  "&:focus": {
    boxShadow: `0 0 0 1px $colors$focusOutline`,
    "&:-webkit-autofill": {
      boxShadow: `0 0 0 1px $colors$focusOutline`,
    },
  },
  "&::placeholder": {
    color: "$extraMuted",
  },
  "&:disabled": {
    opacity: "0.5",
    pointerEvents: "none",
    cursor: "not-allowed",
    "&::placeholder": {
      color: "$mauve7",
    },
  },
  "&:read-only": {
    color: "$muted",
    "&:focus": {
      boxShadow: "inset 0px 0px 0px 1px $colors$focusOutline",
    },
  },

  variants: {
    size: {
      sm: {
        height: "$5",
        fontSize: "$1",
        lineHeight: "$sizes$4",
        "&:-webkit-autofill::first-line": {
          fontSize: "$1",
        },
      },
      md: {
        height: "$10",

        fontSize: "$2",
        lineHeight: "$sizes$7",
        "&:-webkit-autofill::first-line": {
          fontSize: "$1",
        },
      },
      lg: {
        height: "$12",
        fontSize: "$2",
        lineHeight: "$sizes$6",
        "&:-webkit-autofill::first-line": {
          fontSize: "$3",
        },
      },
    },
    variant: {
      ghost: {
        boxShadow: "none",
        backgroundColor: "transparent",
        "@hover": {
          "&:hover": {
            boxShadow: "inset 0 0 0 1px $colors$mauve7",
          },
        },
        "&:focus": {
          backgroundColor: "$loContrast",
          boxShadow: `0 0 0 1px $colors$mauve10`,
        },
        "&:disabled": {
          backgroundColor: "transparent",
        },
        "&:read-only": {
          backgroundColor: "transparent",
        },
      },
      deep: {
        backgroundColor: "$deep",
        boxShadow: "none",
      },
    },
    state: {
      invalid: {
        boxShadow: "inset 0 0 0 1px $colors$error",
        "&:focus": {
          boxShadow:
            "inset 0px 0px 0px 1px $colors$error, 0px 0px 0px 1px $colors$error",
        },
      },
      valid: {
        boxShadow: "inset 0 0 0 1px $colors$success",
        "&:focus": {
          boxShadow:
            "inset 0px 0px 0px 1px $colors$success, 0px 0px 0px 1px $colors$success",
        },
      },
    },
    cursor: {
      default: {
        cursor: "default",
        "&:focus": {
          cursor: "text",
        },
      },
      text: {
        cursor: "text",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type InputProps = {
  validationFunction?: (event: ChangeEvent<HTMLInputElement>) => boolean;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: string;
  size?: "sm" | "md" | "lg" | undefined;
  variant?: "ghost" | "deep" | undefined;
  state?: "invalid" | "valid" | undefined;
  cursor?: "text" | "default" | undefined;
  style?: CSSProperties;
  placeholder?: string;
  disabled?: boolean;
}

export const ValidatedInput = (props: InputProps) => {
  const [overriddenState, overrideState] = useState<"invalid" | "valid" | undefined>(undefined)

  const validate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const validationResult = props.validationFunction ? props.validationFunction(event) : true
    overrideState(validationResult ? "valid" : "invalid")
    props.onChange && props.onChange(event)
  }, [props])

  return <Input value={props.value} type={props.type} size={props.size} variant={props.variant} cursor={props.cursor} state={overriddenState} onChange={(event) => validate(event)}/>
}
