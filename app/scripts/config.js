window.LAYERS_CONFIG = {
  basemaps: [
    [ "01566ece98bddfdf2f629926883b1102", "62dd22ae6163fe505703db8e47a731a8", "Elevation", 0, 2000 ],
    [ "6e4809beb567801c00d6cdfd6f3fd9d0", "a65a48ee541ed8850e1c7b9e79419f8e", "Water Bodies Distance", 0, 120 ],
    [ "d3a982a78ab9c886dd7acd46a1f9fad8", "a74edf0dd1444df596203217694c051b", "NDVI", 0, 1 ],
    [ "a3fd105200b6d127e8e917b463677cb1", "2034d9b8ca8eae46befddaf69ea49e60", "NDWI", -0.2, 0.5 ],
    [ "fbf6f68f4502e9ed90deef7b18890d23", "6b5eaaa9f1389f4aca280ef19dfbde69", "LST", 24, 32 ]
  ],
  overlays: [
    [ "c5c07972aff5a08cb39c31323ecfafe8", "42058d827fa0c581037ef985ce545060", "Malaria Risk (Resampled)", 0, 1 ],
    [ "6aed9776d4e0cde77c6fbe8bd66999b9", "4ea9bf377604c63e01f72c06b0c08eb8", "Malaria Risk", 0, 1 ],
    [ "ebabb7f712fddf4c684c04bc42208f9c", "c3a05998c079f6e9a194918ed84ab9f4", "Water Bodies Hansen", 0, 1 ]
  ]
};

window.LEGEND_CONFIG = {
  "LST": [24, 26, 28, 30, 32],
  "NDVI": [0.1, 0.2, 0.3, 0.5, 0.8],
  "NDWI": [-0.2, -0.1, 0, 0.4, 0.5],
  "Elevation": [0, "0.1-0.2", "0.2-0.4", "0.4-0.6", "0.8-1"],
  "Water Bodies Distance": [0, 20, 50, 100, 120],
  "Malaria Risk": [0.5, 1],
  "Malaria Risk (Resampled)": [0.5, 1]
};
