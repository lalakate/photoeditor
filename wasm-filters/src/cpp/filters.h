#ifndef FILTERS_H
#define FILTERS_H

#include <vector>
#include <algorithm>
#include <cmath>

namespace filters {
    void applyBrightness(unsigned char* data, int width, int height, float value);
    void applyContrast(unsigned char* data, int width, int height, float value);
    void applySaturation(unsigned char* data, int width, int height, float value);
    void applyHue(unsigned char* data, int width, int height, float value);
    void applyBlur(unsigned char* data, int width, int height, float radius);
    void applySharpen(unsigned char* data, int width, int height, float value);
    void applyCurves(unsigned char* data, int width, int height, const std::vector<unsigned char>& curves);
    void applyHSLSaturation(unsigned char* data, int width, int height, float value);
    void applyLightness(unsigned char* data, int width, int height, float value);
}

#endif // FILTERS_H