# Rabuste Coffee - 3D Model Optimization Guide

## 🎯 Best Practices for 3D Model Loading

### Current Implementation
The 3D coffee model is optimized for production with the following features:

### 1. **Preloading Strategy**
```typescript
// Model is preloaded with draco compression support
const gltf = useGLTF('/about%20us/coffee.glb', true);

// Preload at end of file (runs immediately)
useGLTF.preload('/about%20us/coffee.glb');
```

### 2. **Performance Optimizations**
- **High Performance Mode**: Uses GPU acceleration
- **No Drawing Buffer**: Reduces memory usage
- **Optimized DPR**: `[1, 1.5]` for balance between quality and performance
- **Selective Anti-aliasing**: Only where needed

### 3. **Error Handling**
- WebGL context loss detection and recovery
- Graceful fallback UI with error messages
- Automatic retry mechanism

### 4. **Mobile Optimization**
- Separate camera settings for mobile vs desktop
- Reduced complexity on mobile devices
- Touch-friendly controls

### 5. **Loading States**
- Suspense boundary for smooth loading
- Loading spinner while model initializes
- Error fallback component

## 📦 Model File Best Practices

### Recommended Model Specifications:
- **Format**: GLTF/GLB (binary)
- **File Size**: < 5MB (current: check your file)
- **Polygon Count**: < 50,000 triangles
- **Texture Size**: Max 2048x2048
- **Compression**: Draco compression enabled

### How to Optimize Your 3D Model:

1. **Use Draco Compression**
   - Reduces file size by 70-90%
   - Supported by all modern browsers
   - Already enabled in our implementation

2. **Reduce Polygon Count**
   ```
   Tools: Blender, Maya, 3ds Max
   - Use decimation/reduce modifier
   - Target: 10k-50k polygons
   ```

3. **Optimize Textures**
   - Use power-of-2 dimensions (512, 1024, 2048)
   - Compress textures (JPEG for color, PNG for alpha)
   - Consider texture atlasing

4. **Remove Unnecessary Data**
   - Remove hidden geometry
   - Merge duplicate materials
   - Remove unused UV maps
   - Clean up vertex colors

5. **Export Settings** (Blender example)
   ```
   Format: glTF Binary (.glb)
   ✅ Include: Selected Objects
   ✅ +Y Up
   ✅ Apply Modifiers
   ✅ UVs
   ✅ Normals
   ✅ Draco Mesh Compression
   ✅ Compression Level: 6
   ❌ Animations (if not needed)
   ❌ Cameras (if not needed)
   ❌ Lights (use Three.js lights)
   ```

## 🚀 Loading Performance Tips

### 1. **Progressive Loading**
```typescript
// Load low-poly version first (if you have one)
const lowPoly = useGLTF('/models/coffee-low.glb');
// Then load high-poly
const highPoly = useGLTF('/models/coffee-high.glb');
```

### 2. **Lazy Loading**
```typescript
// Only load when user scrolls to about page
const CoffeeModel3D = dynamic(() => import('./CoffeeModel3D'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});
```

### 3. **Caching**
- Browser automatically caches .glb files
- Use CDN for faster global delivery (Vercel handles this)
- Set proper cache headers

### 4. **Network Optimization**
```
Current implementation:
- Model loads with high priority
- Compressed with Draco
- Cached after first load
- Preloaded on page load
```

## 🎨 Visual Quality vs Performance

### Current Settings (Balanced):
- **Shadows**: ContactShadows (lightweight)
- **Lighting**: Multiple light sources (optimized)
- **Anti-aliasing**: Enabled (smooth edges)
- **Tone Mapping**: Default (realistic colors)

### If Performance Issues:
```typescript
// Reduce quality
dpr={[1, 1]}          // Lower DPR
antialias={false}     // Disable AA
shadows={false}       // Remove shadows

// Reduce lighting
// Use fewer lights or lower intensity
```

## 📊 Performance Monitoring

### Check Model Performance:
1. **Chrome DevTools Performance Tab**
   - Record while rotating model
   - Check FPS (should be 60fps)
   - Monitor GPU usage

2. **Three.js Stats**
   ```typescript
   // Add to Canvas for debugging
   import { Stats } from '@react-three/drei';
   
   <Canvas>
     <Stats />
     {/* rest of scene */}
   </Canvas>
   ```

3. **Bundle Size**
   ```bash
   # Check model file size
   ls -lh public/about\ us/coffee.glb
   
   # Should be < 5MB
   ```

## 🔧 Troubleshooting

### Model not loading?
1. Check file path (URL encode spaces: `%20`)
2. Verify file exists in `/public` folder
3. Check browser console for errors
4. Test WebGL support: https://get.webgl.org/

### Performance issues?
1. Check polygon count (< 50k)
2. Reduce texture sizes
3. Enable Draco compression
4. Lower DPR on mobile
5. Reduce number of lights

### Visual issues?
1. Check model normals
2. Verify materials exported correctly
3. Test lighting setup
4. Check camera position

## 🎯 Future Enhancements

Consider implementing:

1. **Level of Detail (LOD)**
   - Show lower poly model when far away
   - Swap to high poly on zoom

2. **Baked Lighting**
   - Pre-bake shadows and ambient occlusion
   - Faster rendering, more realistic

3. **Compressed Textures**
   - Use KTX2/Basis Universal format
   - Much smaller file sizes

4. **Instance Rendering**
   - If showing multiple models
   - Render once, display many times

---

## ✅ Current Status

Your 3D model implementation is **production-ready** with:
- ✅ Preloading enabled
- ✅ Error handling
- ✅ Mobile optimization
- ✅ Performance settings
- ✅ Lazy loading
- ✅ Proper suspense boundaries

**Recommended**: Test on various devices to ensure smooth 60fps performance!
