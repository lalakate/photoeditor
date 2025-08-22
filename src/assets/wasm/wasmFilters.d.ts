export declare function initWasmFilters(): Promise<void>;

export declare function applyWasmFilter(
  filterType: string,
  imageData: ImageData,
  params: number | number[]
): Promise<ImageData>;
