import { useEffect } from "react";

const SEO = ({ pageTitle }) => {
  useEffect(() => {
    document.title = pageTitle + " - BuildGo - Constructions React Template";
  }, []);
};

export default SEO;