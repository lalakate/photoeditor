cmake_minimum_required(VERSION 3.10)
project(wasm_filters)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_EXECUTABLE_SUFFIX ".js")
set(EMSCRIPTEN_LINK_FLAGS "--bind -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s EXPORT_NAME='createFiltersModule' -s EXPORTED_FUNCTIONS=['_processImageData','_processImageDataWithCurves','_createBuffer','_deleteBuffer','_malloc','_free'] -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap','setValue','getValue','HEAPU8']")

set(SOURCE_FILES
    src/cpp/filters.cpp
    src/cpp/bindings.cpp
)

add_executable(filters ${SOURCE_FILES})
set_target_properties(filters PROPERTIES LINK_FLAGS "${EMSCRIPTEN_LINK_FLAGS}")

add_custom_command(TARGET filters POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E make_directory ${CMAKE_SOURCE_DIR}/dist
    COMMAND ${CMAKE_COMMAND} -E copy 
        ${CMAKE_CURRENT_BINARY_DIR}/filters.js
        ${CMAKE_CURRENT_BINARY_DIR}/filters.wasm
        ${CMAKE_SOURCE_DIR}/dist/
)