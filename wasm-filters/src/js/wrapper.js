let wasmModule = null;
let isInitialized = false;
let initializationPromise = null;

export function initWasmFilters() {
  if (isInitialized) return Promise.resolve();

  if (initializationPromise) return initializationPromise;

  initializationPromise = new Promise(async (resolve, reject) => {
    try {
      const filtersModule = await import('/wasm/filters.js');
      const createFiltersModule = filtersModule.default;

      wasmModule = await createFiltersModule();
      isInitialized = true;
      console.log('WebAssembly filters initialized successfully');
      resolve();
    } catch (error) {
      console.error('Failed to initialize WebAssembly filters:', error);
      reject(error);
    }
  });

  return initializationPromise;
}

export async function applyWasmFilter(filterType, imageData, params) {
  if (!isInitialized) {
    await initWasmFilters();
  }

  if (!wasmModule) {
    throw new Error('WebAssembly module not initialized');
  }

  const clonedImageData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );

  try {
    const dataSize = clonedImageData.data.length;
    const dataPtr = wasmModule._malloc(dataSize);

    wasmModule.HEAPU8.set(clonedImageData.data, dataPtr);

    const paramValue = typeof params === 'number' ? params : params[0] || 0;
    wasmModule.ccall(
      'processImageData',
      null,
      ['string', 'number', 'number', 'number', 'number'],
      [
        filterType,
        dataPtr,
        clonedImageData.width,
        clonedImageData.height,
        paramValue,
      ]
    );

    const resultData = wasmModule.HEAPU8.subarray(dataPtr, dataPtr + dataSize);
    clonedImageData.data.set(resultData);

    wasmModule._free(dataPtr);

    return clonedImageData;
  } catch (error) {
    console.error('Error applying WASM filter:', error);
    throw error;
  }
}
