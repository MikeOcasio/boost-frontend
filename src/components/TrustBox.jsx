"use client";

import { useEffect, useRef } from "react";
const TrustBox = () => {
  // Create a reference to the <div> element which will represent the TrustBox
  const ref = useRef(null);
  useEffect(() => {
    // If window.Trustpilot is available it means that we need to load the TrustBox from our ref.
    // If it's not, it means the script you pasted into <head /> isn't loaded  just yet.
    // When it is, it will automatically load the TrustBox.
    if (window.Trustpilot) {
      window.Trustpilot.loadFromElement(ref.current, true);
    }
  }, []);

  return (
    <div
      ref={ref}
      className="trustpilot-widget"
      data-locale="en-US"
      data-template-id="5419b6ffb0d04a076446a9af"
      data-businessunit-id="52bf36c8-28d9-423c-a5e1-35ee8833fc30"
      data-style-height="24px"
      data-style-width="100%"
      data-theme="light"
      data-sku="PBC2"
      data-no-reviews="hide"
      data-scroll-to-list="true"
    >
      <a
        href="https://www.trustpilot.com/review/ravenboost.com"
        target="_blank"
        rel="noopener"
      >
        {" "}
        Trustpilot
      </a>
    </div>
  );
};
export default TrustBox;
