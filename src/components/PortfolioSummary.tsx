1	'use client';
2
3	import * as React from 'react';
4
5	const MOBILE_BREAKPOINT = 768;
6
7	export function useIsMobile() {
8	  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
8
9	  React.useEffect(() => {
10	    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
11	    const onChange = () => {
12	      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
13	    };
14	    mql.addEventListener('change', onChange);
15      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
16	    return () => mql.removeEventListener('change', onChange)
17	  }, [])
18
19	  return !!isMobile
20	}
21