let wasmModule = null;
let isInitialized = false;
let initializationPromise = null;

export function initWasmFilters() {
  if (isInitialized) return Promise.resolve();

  if (initializationPromise) return initializationPromise;

  initializationPromise = new Promise(async (resolve, reject) => {
    try {
      // Используем относительный путь для корректной работы на GitHub Pages
      const response = await fetch(import.meta.env.BASE_URL + 'wasm/filters.js');
      const jsCode = await response.text();

      const script = document.createElement('script');
      script.textContent = jsCode;
      document.head.appendChild(script);

      let attempts = 0;
      while (!window.createFiltersModule && attempts < 100) {
        await new Promise(resolve => setTimeout(resolve, 50));
        attempts++;
      }

      if (!window.createFiltersModule) {
        throw new Error('createFiltersModule not found');
      }

      wasmModule = await window.createFiltersModule({
        locateFile: path => {
          if (path.endsWith('.wasm')) {
            // Используем относительный путь для wasm
            return import.meta.env.BASE_URL + 'wasm/filters.wasm';
          }
          return path;
        },
      });

      try {
        delete window.createFiltersModule;
      } catch (error) {
        window.createFiltersModule = undefined;
      }

      isInitialized = true;
      resolve();
    } catch (error) {
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

    if (
      filterType === 'curves' &&
      Array.isArray(params) &&
      params.length === 256
    ) {
      const curvesPtr = wasmModule._malloc(256);

      for (let i = 0; i < 256; i++) {
        wasmModule.HEAPU8[curvesPtr + i] = params[i];
      }

      wasmModule.ccall(
        'processImageDataWithCurves',
        null,
        ['number', 'number', 'number', 'number'],
        [dataPtr, clonedImageData.width, clonedImageData.height, curvesPtr]
      );

      wasmModule._free(curvesPtr);
    } else {
      const paramValue = typeof params === 'number' ? params : 0;
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
    }

    const resultData = wasmModule.HEAPU8.subarray(dataPtr, dataPtr + dataSize);
    clonedImageData.data.set(resultData);

    wasmModule._free(dataPtr);

    return clonedImageData;
  } catch (error) {
    throw error;
  }
}
