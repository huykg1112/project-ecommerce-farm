declare module "react-image-magnify" {
  import React from "react";

  interface ReactImageMagnifyProps {
    smallImage: {
      alt: string;
      isFluidWidth: boolean;
      src: string;
    };
    largeImage: {
      src: string;
      width: number;
      height: number;
    };
    enlargedImageContainerStyle?: React.CSSProperties;
    enlargedImageStyle?: React.CSSProperties;
    lensStyle?: React.CSSProperties;
    magnifierHeight?: number;
    magnifierWidth?: number;
    isActivatedOnTouch?: boolean;
  }

  const ReactImageMagnify: React.FC<ReactImageMagnifyProps>;
  export default ReactImageMagnify;
}
