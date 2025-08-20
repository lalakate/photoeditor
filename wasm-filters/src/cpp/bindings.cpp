#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <emscripten/emscripten.h>
#include <vector>
#include "filters.h"

using namespace emscripten;

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void processImageData(const char* filterType, unsigned char* data, int width, int height, float params) {
        std::string filter(filterType);
        
        if(filter == "brightness") {
            filters::applyBrightness(data, width, height, params);
        } else if(filter == "contrast") {
            filters::applyContrast(data, width, height, params);
        } else if(filter == "saturation") {
            filters::applySaturation(data, width, height, params);
        } else if(filter == "hue") {
            filters::applyHue(data, width, height, params);
        } else if(filter == "blur") {
            filters::applyBlur(data, width, height, params);
        } else if(filter == "sharpen") {
            filters::applySharpen(data, width, height, params);
        } else if(filter == "hslSaturation") {
            filters::applyHSLSaturation(data, width, height, params);
        } else if(filter == "lightness") {
            filters::applyLightness(data, width, height, params);
        }
    }
    
    EMSCRIPTEN_KEEPALIVE
    unsigned char* createBuffer(int size) {
        return new unsigned char[size];
    }
    
    EMSCRIPTEN_KEEPALIVE
    void deleteBuffer(unsigned char* buffer) {
        delete[] buffer;
    }
}

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void processImageDataWithCurves(unsigned char* data, int width, int height, unsigned char* curvesArray) {
        std::vector<unsigned char> curves(curvesArray, curvesArray + 256);
        filters::applyCurves(data, width, height, curves);
    }
}

void processImageDataComplex(std::string filterType, val imageDataArray, int width, int height, val params) {
    val data_array = imageDataArray["data"];
    unsigned char* data = reinterpret_cast<unsigned char*>(data_array.as<std::uintptr_t>());

    if(filterType == "curves") {
        std::vector<unsigned char> curves;
        val curvesArray = params.as<val>();
        int length = curvesArray["length"].as<int>();

        curves.resize(length);
        for(int i = 0; i < length; i++) {
            curves[i] = curvesArray[i].as<unsigned char>();
        }

        filters::applyCurves(data, width, height, curves);
    }
}

EMSCRIPTEN_BINDINGS(filters_module) {
    function("processImageDataComplex", &processImageDataComplex);
}