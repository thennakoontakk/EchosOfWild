const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 3D model assets
config.resolver.assetExts.push('glb', 'gltf', 'mtl', 'obj');

// drei / three.js may ship .wasm files (e.g. Draco decoder)
config.resolver.assetExts.push('wasm');

module.exports = config;
