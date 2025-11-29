import { useEffect } from "react";

const SEO = ({ pageTitle }) => {
  useEffect(() => {
    document.title = pageTitle + " - Alp Dinamik | Lineer Hareket Sistemleri";
  }, []);
};

export default SEO;