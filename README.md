# VideoPlayground

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Three.js](https://img.shields.io/badge/Three.js-r150+-black) ![Face-api.js](https://img.shields.io/badge/Face--api.js-Detection-orange)

VideoPlayground is an interactive computer graphics web application focused on real-time video post-processing and face tracking. 

Developed as a project for the Computer Graphics course at the Federal University of Bahia (UFBA), this application serves as a sandbox to explore shaders, image processing, and 3D overlay techniques directly in the browser.

## Key Features

* **Flexible Input:** Use your Webcam for real-time interaction or upload a Video File (loops automatically).
* **Playback Control:** Pause and resume video playback at any time via the UI.
* **Face Tracking Features:** Powered by `face-api.js`, users can switch between:
    * *Tiny Face Detector* (Better Performance).
    * *SSD Mobilenet V1* (Higher Accuracy).

---

## Modules

The application is divided into four distinct playgrounds:

### 1. Video Post-Processing
A general-purpose processing engine. You can stack multiple filters on top of each other to create complex visual effects.
* **Stackable Filters:** Add as many filters as you like (e.g., Log/Gamma Correction, Sobel, Monochrome).
* **Order Matters:** The output of one filter feeds into the next, allowing for unique combinations depending on the stack order.
* **Granular Control:** Each active filter adds a folder to the control panel where its specific parameters can be tweaked.

### 2. Anonymization (2D Mask)
Focuses on face detection to overlay 2D assets.
* **Custom Masks:** Upload your own image (PNG/JPG) to use as a mask or select the default mask.
* **Tracking:** The image automatically scales and positions itself based on the detected face bounding box.

### 3. Anonymization (3D Mask)
A more advanced implementation using **Three.js** to render a 3D object over the user's face.
* **Dynamic Lighting:** The lighting on the 3D mask changes dynamically based on the average color of the video's corners, simulating environment reflection.

### 4. Anonymization (Filters)
Instead of overlaying objects, this module uses post-processing shaders to "censor" or stylize identity.
* **Privacy Filters:** Includes Pixelation, Gaussian Blur, and Glitch effects.
* **Region of Interest (ROI):** Choose to apply the effect to the **entire video** or restrict it only to the **detected face area**.

---

## Utilized Libraries

* **[Three.js](https://threejs.org/):** Core rendering engine for video textures, shaders, and 3D models.
* **[face-api.js](https://github.com/justadudewhohacks/face-api.js/):** JavaScript API for face detection and face landmark recognition on the browser.
* **[lil-gui](https://lil-gui.georgealways.com/):** Lightweight floating graphical user interface for controlling parameters.

---

## How to Run

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/LucasTBorges/VideoPlayground.git
    cd VideoPlayground
    ```

2.  **Start a local server:**
    * **VS Code (Recommended):** Install the "Live Server" extension and click "Go Live" on `index.html`.
    * **Python:**
        ```bash
        # Python 3.x
        python -m http.server
        ```
    * **Node.js:**
        ```bash
        npx http-server
        ```

3.  **Open in Browser:**
    Navigate to `http://localhost:5500` (or the port specified by your server).

---

## Assets

* **3D Asset:** ["Porcelain Mask"](https://sketchfab.com/3d-models/porcelain-mask-596d7fbddfdd4cbab5a81878e1bd7741) by *sleepwalker77* on Sketchfab (CC BY 4.0).
* **Default Mask Image:** ["Venitian Carnival Mask"](https://www.emojis.com/emoji/venitian-carnival-mask-FZqS2JhUdl) from Emojis.com.

---

> **Note:** For best performance, use a browser with hardware acceleration enabled (Chrome/Edge/Firefox recommended). Face detection speed depends on your GPU/CPU capabilities.