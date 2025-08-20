let wasmModule: any = null;

export const initWasm = async (): Promise<void> => {
  if (!wasmModule) {
    const importObject = {
      env: {
        memoryBase: 0,
        tableBase: 0,
        memory: new WebAssembly.Memory({ initial: 256 }),
        table: new WebAssembly.Table({ initial: 2, element: 'anyfunc' }),
      },
    };

    const response = await fetch('/wasm/imageProcessor.wasm');
    const buffer = await response.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(buffer, importObject);
    wasmModule = instance.exports;
  }
};

export const applyGrayscale = (
  imageData: Uint8ClampedArray,
  width: number,
  height: number
): Uint8ClampedArray => {
  if (!wasmModule) {
    throw new Error('WASM module not initialized');
  }

  const inputPtr = wasmModule.__getBuffer(imageData.length);
  wasmModule.HEAPU8.set(imageData, inputPtr);

  wasmModule.grayscale_filter(inputPtr, width, height);

  const result = new Uint8ClampedArray(
    wasmModule.HEAPU8.slice(inputPtr, inputPtr + imageData.length)
  );

  wasmModule.__releaseBuffer(inputPtr);
  return result;
};
