import { Client } from "@gradio/client";

// Helper to convert data URL to Blob
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

// Fetch image URL to Blob
async function urlToBlob(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error fetching image for blob:", error);
    throw error;
  }
}

export async function generateVtonImage(humanImageDataUrl, garmentImageUrl, garmentDescription = "clothing") {
  try {
    console.log("Preparing images for AI...");
    const humanBlob = dataURLtoBlob(humanImageDataUrl);
    const garmentBlob = await urlToBlob(garmentImageUrl);

    console.log("Connecting to HuggingFace Space...");
    const client = await Client.connect("yisol/IDM-VTON", { token: import.meta.env.VITE_HF_TOKEN });
    
    console.log("Submitting job to queue (this may take a while)...");
    const result = await client.predict("/tryon", { 
      dict: { background: humanBlob, layers: [], composite: null },
      garm_img: garmentBlob,
      garment_des: garmentDescription,
      is_checked: true,
      is_checked_crop: false,
      denoise_steps: 30,
      seed: 42
    });

    console.log("AI Generation Complete:", result);
    
    if (result && result.data && result.data[0] && result.data[0].url) {
        return result.data[0].url;
    }
    
    throw new Error("Invalid response format from Gradio API");
  } catch (error) {
    console.error("VTON Generation Error:", error);
    throw error;
  }
}
