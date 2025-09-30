import React from "react";

export default function SafeImg({ src, fallback = "/default-logo.png", alt = "", className = "", ...rest }) {
    const [imgSrc, setImgSrc] = React.useState(src || fallback);
    React.useEffect(() => { setImgSrc(src || fallback); }, [src, fallback]);
    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => setImgSrc(fallback)}
            {...rest}
        />
    );
}
