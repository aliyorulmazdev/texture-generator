import React, { useState } from "react";
import "./Generator.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ButtonGroup from "@mui/material/ButtonGroup";
import { toast } from "react-toastify";
import Tour from "reactour"; // reactour kütüphanesini ekleyin
import axios from "axios";

const Generator = () => {
  const [svgElements, setSvgElements] = useState([]);
  const [colorPalette, setColorPalette] = useState([
    "#FF5733",
    "#33FF57",
    "#5733FF",
  ]);

  const uploadToImgbb = async () => {
    const imageContainers = document.querySelectorAll(".image");
  
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 600;
  
    imageContainers.forEach((imageContainer, index) => {
      const svgDataUrl = imageContainer.querySelector("svg").outerHTML;
  
      const img = new Image();
      img.src = "data:image/svg+xml," + encodeURIComponent(svgDataUrl);
  
      const row = Math.floor(index / 4);
      const col = index % 4;
  
      img.onload = () => {
        context.drawImage(img, col * 100, row * 100, 100, 100);
  
        if (index === 23) {
          canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append("image", blob);
  
            try {
              const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
                params: {
                  key: "53e046c88fda1d058938a434f4f15961", // Replace with your imgbb API key
                },
              });
  
              // Handle the imgbb API response
              const imageURL = response.data.data.url;
              console.log("Imgbb API response:", imageURL);
  
              // Copy the URL to the clipboard
              await navigator.clipboard.writeText(imageURL);
  
              toast.success("Image uploaded to imgbb. URL copied to clipboard.", {
                position: "bottom-center",
                autoClose: 3000,
              });
            } catch (error) {
              console.error("Error uploading to imgbb:", error);
              toast.error("Failed to upload to imgbb.", {
                position: "bottom-center",
                autoClose: 3000,
              });
            }
          }, "image/png");
        }
      };
    });
  };
  
  
  const generateRandomImage = () => {
    const getRandomColor = () => {
      const randomIndex = Math.floor(Math.random() * colorPalette.length);
      return colorPalette[randomIndex];
    };

    const getRandomDegree = () => Math.floor(Math.random() * 4) * 90;

    const getRandomShape = () =>
      Math.random() < 0.5 ? (
        <circle
          cx="50"
          cy="50"
          r="50"
          transform={`rotate(${getRandomDegree()} 50 50)`}
        />
      ) : (
        <circle
          cx="100"
          cy="0"
          r="100"
          transform={`rotate(${getRandomDegree()} 50 50)`}
        />
      );

    const newElements = Array(24)
      .fill(null)
      .map(() => ({
        color: getRandomColor(),
        shape: getRandomShape(),
      }));

    setSvgElements(newElements);
  };

  const tourSteps = [
    {
      selector: ".generate-button",
      content: "Bu düğmeye tıklayarak rastgele şekiller oluşturabilirsiniz.",
    },
    {
      selector: ".color-box",
      content:
        "Renk paletini değiştirmek için buradaki renkleri seçebilirsiniz.",
    },
    {
      selector: ".save-svg-button",
      content:
        "Şimdi 'Save as SVG' düğmesine tıklayarak bu görseli SVG olarak kaydedebilirsiniz.",
    },
    {
      selector: ".understood-button",
      content: "Hepsi Bu! Şimdi sanat zamanı!",
    },
  ];

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const startTour = () => {
    setIsTourOpen(true);
  };

  const saveImagesAsSinglePNG = () => {
    const imageContainers = document.querySelectorAll(".image");

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 600;

    imageContainers.forEach((imageContainer, index) => {
      const svgDataUrl = imageContainer.querySelector("svg").outerHTML;

      const img = new Image();
      img.src = "data:image/svg+xml," + encodeURIComponent(svgDataUrl);

      const row = Math.floor(index / 4);
      const col = index % 4;

      img.onload = () => {
        context.drawImage(img, col * 100, row * 100, 100, 100);

        if (index === 23) {
          const now = new Date();
          const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
          const timePart = now.toTimeString().slice(0, 8).replace(/:/g, "");
          const filename = `${datePart}-${timePart}-all_images.png`;

          const singleImageDataUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = singleImageDataUrl;
          link.download = filename;
          link.click();
          toast.success("Images saved as a single PNG file.", {
            position: "bottom-center",
            autoClose: 3000,
          });
        }
      };
    });
  };

  const saveImagesAsSingleSVG = () => {
    const imageContainers = document.querySelectorAll(".image");

    let svgData = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';
    svgData += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ';
    svgData += '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
    svgData +=
      '<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">';

    imageContainers.forEach((imageContainer, index) => {
      const svgContent = imageContainer.querySelector("svg").outerHTML;
      const row = Math.floor(index / 4) * 100;
      const col = (index % 4) * 100;
      svgData += `<g transform="translate(${col},${row})">${svgContent}</g>`;
    });

    svgData += "</svg>";

    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
    const timePart = now.toTimeString().slice(0, 8).replace(/:/g, "");
    const filename = `${datePart}-${timePart}-generatedtexture.svg`;

    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    toast.success("Images saved as a single SVG file.", {
      position: "bottom-center",
      autoClose: 3000,
    });
  };

  const changePaletteColor = (index, newColor) => {
    const newPalette = [...colorPalette];
    newPalette[index] = newColor;
    setColorPalette(newPalette);
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Card>
        <CardContent>
          <ButtonGroup
            variant="contained"
            color="primary"
            sx={{
              display: "flex",
              justifyContent: "center",
              boxShadow: 0,
            }}
          >
            <Button onClick={generateRandomImage} className="generate-button">
              Generate
            </Button>
            <Button color='secondary' onClick={startTour}>Bana Öğret</Button>
          </ButtonGroup>
          <Tour
            steps={tourSteps}
            isOpen={isTourOpen}
            onRequestClose={() => {
              setCurrentStep(0);
              setIsTourOpen(false);
            }}
            currentStep={currentStep}
            onBeforeChange={(newStep) => setCurrentStep(newStep)}
          />
          <div className="palette">
            {colorPalette.map((color, index) => (
              <div key={index} className="color-box">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => changePaletteColor(index, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="image-container">
            {svgElements.map((element, index) => (
              <div key={index} className="image">
                <svg
                  width="100"
                  height="100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g fill={element.color}>{element.shape}</g>
                </svg>
              </div>
            ))}
          </div>
          <ButtonGroup
            variant="contained"
            color="secondary"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              boxShadow: 0,
            }}
          >
            <Button onClick={saveImagesAsSingleSVG} className="save-svg-button">
              Save as SVG
            </Button>
            <Button onClick={saveImagesAsSinglePNG}>Save as PNG</Button>
            <Button onClick={uploadToImgbb}>Upload</Button>

          </ButtonGroup>
          <ButtonGroup
            color="secondary"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              boxShadow: 0,
            }}
          >
            <Button
              color="info"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/in/ali-yorulmaz-1a67a518a/"
                )
              }
            >
              LinkedIn
            </Button>
            <Button
              color="info"
              onClick={() => window.open("https://github.com/aliyorulmazdev")}
            >
              GitHub
            </Button>
            <Button
              color="info"
              onClick={() => window.open("https://instagram.com/kuprag_ali")}
            >
              Instagram
            </Button>
          </ButtonGroup>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Generator;
