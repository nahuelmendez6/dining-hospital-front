import React, { useRef } from "react";

export default function TestRef() {
  const ref = useRef(null);
  return <div ref={ref}>Test useRef hook works!</div>;
}
