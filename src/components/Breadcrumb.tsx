import { styled } from "@stitches/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const Nav = styled("nav", {
  display: "flex",
  flexDirection: "row",
  "> a": {
    textDecoration: "none",
    textTransform: "uppercase",
    "&:hover": {
      textDecoration: "underline"
    }
  },
})

const NavDiv = styled("nav", {
  display: "flex",
  flexDirection: "row",
  "> a": {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline"
    }
  },
})

const Separator = styled("div", {
  padding: "0 0.5rem",
  "&::before": {
    content: "/"
  },
})

const Breadcrumb= () => {
  const router = useRouter()
  const [path, setPath] = useState<string[]>([])

  useEffect(() => {
    setPath(router.asPath.split("/"))
  }, [router])

  return (
    <Nav>
      <Link href="/">HOME</Link><Separator/>
      {path.filter((link, index) => {
        if (index > 0) {
          let href = path.filter((_part, j) => {
            if (j <= index) {
              return true
            }
            return false
          }).join("/")
          let text = link.toUpperCase()

          if (link === "") {
            return false
          } else if (link.substring(0, 2) === "0x") {
            text = link.substring(0, 5).concat("…").concat(link.substring(link.length - 3, link.length)).toUpperCase()
          } else {
            text = link.toUpperCase()
          }

          let returnable = <Link href={href} key={href} passHref><Separator/>{text.toUpperCase()}</Link>
          if (index < path.length - 1) {
            returnable = <NavDiv key={href}><Link href={href}>{text.toUpperCase()}</Link><Separator/></NavDiv>
          }
          return returnable
        }
      })}
    </Nav>
  )
}

export default Breadcrumb
