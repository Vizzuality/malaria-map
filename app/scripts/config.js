window.LAYERS_CONFIG = {
  basemaps: [
    [ "b0d119463ffef91eb27c9e28eb02ea2d", "fe63453f305c313802ffb0397d6b3d8d", "Elevation", 0, 2000 ],
    [ "c590aa09251b50cacb404c3581a97415", "4c817373f6dc686a63a4ddac49dc0ab6", "Water Bodies Distance", 0, 120 ],
    [ "ac6a74678241980b1f086eefff0417b9", "29ec5ddc6e159da253f0d3cc5f7a9cea", "NDVI", 0, 1 ],
    [ "e0374a601d9d441704ff2ec33e635971", "7392363d051e1bde3c0147f1ab1de56a", "NDWI", -0.2, 0.5 ],
    [ "1773d9b596f153c61a27e453824b486a", "910f171ce487159d651942fa349f3124", "LST", 24, 32 ]
  ],
  overlays: [
    [ "be59590f33d7322919fc6630a0b43bcf", "18b3c6b1863e0113992ead9f8562c9dc", "Malaria Risk (Resampled)", 0, 1 ],
    [ "110b9fca1fdf756f3c27b846eeb2be0e", "3123b27b1ab7aebfdb9fb157691e4a31", "Malaria Risk", 0, 1 ],
    [ "2c77ff1333535698d602dd592dee9797", "2b89092e5f298aeb43024828899a7343", "Water Bodies Hansen", 0, 1 ]
  ]
};

window.LEGEND_CONFIG = {
  "LST": [24, 26, 28, 30, 32],
  "NDVI": [0.1, 0.2, 0.3, 0.5, 0.8],
  "NDWI": [-0.2, -0.1, 0, 0.4, 0.5],
  "Elevation": [200, 500, 1000, 1500, 2000],
  "Water Bodies Distance": [0, 20, 50, 100, 120],
  "Malaria Risk": [0.5, 1],
  "Malaria Risk (Resampled)": [0.5, 1],
  "Cities in Danger": [0, 0.5, 1],
  "Case Data": ["Without", "With"],
};
