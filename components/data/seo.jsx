"use client"
import { useEffect } from "react";

const SEO = ({ pageTitle }) => {
  useEffect(() => {
    document.title = pageTitle + " - Alpdinamik | Lineer Hareket Sistemleri";
  }, [pageTitle]);
  
  return null;
};

export default SEO;