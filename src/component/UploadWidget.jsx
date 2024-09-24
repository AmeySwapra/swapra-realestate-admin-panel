import { createContext, useEffect, useState } from "react";
import { Button, useToast } from '@chakra-ui/react';


const CloudinaryScriptContext = createContext();

function UploadWidget({ uwConfig, setImageUrl }) {
  const [loaded, setLoaded] = useState(false);
  const toast = useToast();

  useEffect(() => {
    
    const existingScript = document.getElementById("cloudinary-widget-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "cloudinary-widget-script";
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      script.onload = () => setLoaded(true); 
      document.body.appendChild(script);
    } else {
      setLoaded(true); 
    }
  }, []);

  const openUploadWidget = () => {
    if (!loaded) {
      toast({
        title: "Upload widget is not ready.",
        description: "Please wait for the widget to fully load.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      uwConfig,
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Image uploaded: ", result.info.secure_url);
          setImageUrl(result.info.secure_url); 
        } else if (error) {
          toast({
            title: "Upload failed",
            description: "There was an issue uploading your image. Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    );
    widget.open(); 
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <Button
        id="upload_widget"
        colorScheme="teal"
        onClick={openUploadWidget}
        isDisabled={!loaded} 
      >
        {loaded ? "Upload Image" : "Loading..."}
      </Button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };
