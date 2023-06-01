import { styled } from "@stitches/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { House } from "./Icons"

const Nav = styled("nav", {
  display: "flex",
  flexDirection: "row",
  textTransform: "uppercase",
  alignItems: "center",
  "> a": {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline"
    }
  }
})

const NavDiv = styled("nav", {
  display: "flex",
  flexDirection: "row",
  "> a": {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline"
    }
  }
})

const Separator = styled("div", {
  padding: "0 0.5rem",
  "&::before": {
    content: "/"
  }
})

const Breadcrumb = () => {
  const router = useRouter()
  const [path, setPath] = useState<string[]>([])

  useEffect(() => {
    setPath(router.asPath.split("/").filter((subPath) => subPath !== ""))
  }, [router])

  const getWholePath = useCallback(() => path.join("/"), [path])

  return (
    <Nav>
      {/* Link to homepage */}
      <Link href="/" passHref>
        <a
          style={{
            display: "flex",
            flexWrap: "nowrap",
            flexDirection: "row",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <House css={{ stroke: "#FFFFFF" }} />
          HOME
        </a>
      </Link>

      {/* Print remaining path */}
      {path.map((subPath) => {
        // Construct the link
        const href =
          "/" + getWholePath().substring(0, getWholePath().indexOf(subPath) + subPath.length)

        // Text = subPath if subPath is NOT an address, otherwise truncate
        let text = subPath
        if (subPath.substring(0, 2) === "0x") {
          text = subPath
            .substring(0, 5)
            .concat("…")
            .concat(subPath.substring(subPath.length - 3, subPath.length))
        }

        return (
          <NavDiv key={href}>
            <Separator />
            <Link href={href}>{text}</Link>
          </NavDiv>
        )
      })}
    </Nav>
  )
}

export default Breadcrumb
