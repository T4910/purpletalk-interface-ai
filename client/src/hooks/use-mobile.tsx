import * as React from "react";

const MOBILE_BREAKPOINT = 768; // - for table it should be changed

export function useIsMobile(
  props: { breakpoint?: number } = { breakpoint: 768 }
) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(max-width: ${(props.breakpoint ?? MOBILE_BREAKPOINT) - 1}px)`
    );
    const onChange = () => {
      setIsMobile(window.innerWidth < (props.breakpoint ?? MOBILE_BREAKPOINT));
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < (props.breakpoint ?? MOBILE_BREAKPOINT));
    return () => mql.removeEventListener("change", onChange);
  }, [props.breakpoint]);

  return !!isMobile;
}
