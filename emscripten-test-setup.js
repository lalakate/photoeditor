// emscripten-test-setup.js — универсальный мок для emscripten/wasm-тестов

function moduleMock(options, cb) {
  if (typeof cb === "function") cb({});
  return {};
}
moduleMock.onRuntimeInitialized = () => {};
moduleMock.delayed_throw = () => {};

globalThis.module = moduleMock;
globalThis.Module = {
  onRuntimeInitialized: () => {},
  delayed_throw: () => {},
};
