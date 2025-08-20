#include "filters.h"
#include <cmath>
#include <algorithm>
#include <vector>

namespace filters {
    inline unsigned char clamp(int value) {
        return static_cast<unsigned char>(std::max(0, std::min(255, value)));
    }
    
    inline float clampf(float value) {
        return std::max(0.0f, std::min(1.0f, value));
    }
    
    void rgbToHsv(unsigned char r, unsigned char g, unsigned char b, float& h, float& s, float& v) {
        float rf = r / 255.0f;
        float gf = g / 255.0f;
        float bf = b / 255.0f;
        
        float max_val = std::max({rf, gf, bf});
        float min_val = std::min({rf, gf, bf});
        float delta = max_val - min_val;
        
        v = max_val;
        s = (max_val == 0) ? 0 : delta / max_val;
        
        if (delta == 0) {
            h = 0;
        } else if (max_val == rf) {
            h = 60 * fmod((gf - bf) / delta, 6);
        } else if (max_val == gf) {
            h = 60 * ((bf - rf) / delta + 2);
        } else {
            h = 60 * ((rf - gf) / delta + 4);
        }
        
        if (h < 0) h += 360;
    }
    
    void hsvToRgb(float h, float s, float v, unsigned char& r, unsigned char& g, unsigned char& b) {
        float c = v * s;
        float x = c * (1 - std::abs(fmod(h / 60.0f, 2) - 1));
        float m = v - c;
        
        float rf, gf, bf;
        
        if (h >= 0 && h < 60) {
            rf = c; gf = x; bf = 0;
        } else if (h >= 60 && h < 120) {
            rf = x; gf = c; bf = 0;
        } else if (h >= 120 && h < 180) {
            rf = 0; gf = c; bf = x;
        } else if (h >= 180 && h < 240) {
            rf = 0; gf = x; bf = c;
        } else if (h >= 240 && h < 300) {
            rf = x; gf = 0; bf = c;
        } else {
            rf = c; gf = 0; bf = x;
        }
        
        r = clamp(static_cast<int>((rf + m) * 255));
        g = clamp(static_cast<int>((gf + m) * 255));
        b = clamp(static_cast<int>((bf + m) * 255));
    }

    void applyBrightness(unsigned char* data, int width, int height, float value) {
        int totalPixels = width * height;
        float factor = 1.0f + value / 100.0f;
        
        for (int i = 0; i < totalPixels; i++) {
            int idx = i * 4; 
            
            data[idx] = clamp(static_cast<int>(data[idx] * factor));     
            data[idx + 1] = clamp(static_cast<int>(data[idx + 1] * factor)); 
            data[idx + 2] = clamp(static_cast<int>(data[idx + 2] * factor)); 
        }
    }

    void applyContrast(unsigned char* data, int width, int height, float value) {
        int totalPixels = width * height;
        float factor = (259.0f * (value + 255.0f)) / (255.0f * (259.0f - value));
        
        for (int i = 0; i < totalPixels; i++) {
            int idx = i * 4; 
            
            data[idx] = clamp(static_cast<int>(factor * (data[idx] - 128) + 128));    
            data[idx + 1] = clamp(static_cast<int>(factor * (data[idx + 1] - 128) + 128)); 
            data[idx + 2] = clamp(static_cast<int>(factor * (data[idx + 2] - 128) + 128)); 
        }
    }

    void applyBlur(unsigned char* data, int width, int height, float value) {
        int radius = std::max(1, static_cast<int>(value));
        int kernelSize = radius * 2 + 1;
        
        std::vector<unsigned char> tempData(width * height * 4);
        
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int r = 0, g = 0, b = 0, a = 0;
                int count = 0;
                
                for (int dy = -radius; dy <= radius; dy++) {
                    for (int dx = -radius; dx <= radius; dx++) {
                        int nx = x + dx;
                        int ny = y + dy;
                        
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            int idx = (ny * width + nx) * 4;
                            r += data[idx];
                            g += data[idx + 1];
                            b += data[idx + 2];
                            a += data[idx + 3];
                            count++;
                        }
                    }
                }
                
                int outIdx = (y * width + x) * 4;
                tempData[outIdx] = r / count;
                tempData[outIdx + 1] = g / count;
                tempData[outIdx + 2] = b / count;
                tempData[outIdx + 3] = a / count;
            }
        }
        
        std::copy(tempData.begin(), tempData.end(), data);
    }

    void applySharpen(unsigned char* data, int width, int height, float value) {
        float kernel[3][3] = {
            {0, -1, 0},
            {-1, 5, -1},
            {0, -1, 0}
        };
        
        float intensity = value / 100.0f;
        
        std::vector<unsigned char> tempData(width * height * 4);
        std::copy(data, data + width * height * 4, tempData.begin());
        
        for (int y = 1; y < height - 1; y++) {
            for (int x = 1; x < width - 1; x++) {
                for (int c = 0; c < 3; c++) { 
                    float sum = 0;
                    
                    for (int ky = -1; ky <= 1; ky++) {
                        for (int kx = -1; kx <= 1; kx++) {
                            int idx = ((y + ky) * width + (x + kx)) * 4 + c;
                            sum += tempData[idx] * kernel[ky + 1][kx + 1];
                        }
                    }
                    
                    int originalIdx = (y * width + x) * 4 + c;
                    float original = tempData[originalIdx];
                    float sharpened = original + intensity * (sum - original);
                    
                    data[originalIdx] = clamp(static_cast<int>(sharpened));
                }
            }
        }
    }

    void applySaturation(unsigned char* data, int width, int height, float value) {
        int totalPixels = width * height;
        float factor = 1.0f + value / 100.0f;
        
        for (int i = 0; i < totalPixels; i++) {
            int idx = i * 4; 
            
            unsigned char r = data[idx];
            unsigned char g = data[idx + 1];
            unsigned char b = data[idx + 2];
            
            float h, s, v;
            rgbToHsv(r, g, b, h, s, v);
            
            s = clampf(s * factor);
            
            hsvToRgb(h, s, v, r, g, b);
            
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
        }
    }

    void applyHue(unsigned char* data, int width, int height, float value) {
        int totalPixels = width * height;
        float hueShift = value;
        
        for (int i = 0; i < totalPixels; i++) {
            int idx = i * 4; 
            
            unsigned char r = data[idx];
            unsigned char g = data[idx + 1];
            unsigned char b = data[idx + 2];
            
            float h, s, v;
            rgbToHsv(r, g, b, h, s, v);
            
            h = fmod(h + hueShift + 360.0f, 360.0f);
            
            hsvToRgb(h, s, v, r, g, b);
            
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
        }
    }

    void applyCurves(unsigned char* data, int width, int height, const std::vector<unsigned char>& curves) {
        if (curves.size() != 256) return;
        
        int totalPixels = width * height;
        
        for (int i = 0; i < totalPixels; i++) {
            int idx = i * 4; 
            
            data[idx] = curves[data[idx]];         
            data[idx + 1] = curves[data[idx + 1]]; 
            data[idx + 2] = curves[data[idx + 2]];
        }
    }

    void applyHSLSaturation(unsigned char* data, int width, int height, float value) {
        int totalPixels = width * height;
        float factor = value / 100.0f;
        
        for (int i = 0; i < totalPixels; i++) {
            int idx = i * 4; 
            
            unsigned char r = data[idx];
            unsigned char g = data[idx + 1];
            unsigned char b = data[idx + 2];
            
            float h, s, v;
            rgbToHsv(r, g, b, h, s, v);
            
            float max_val = v;
            float min_val = (1.0f - s) * v;
            float l = (max_val + min_val) / 2.0f;
            
            float s_hsl = (l == 0 || l == 1) ? 0 : (max_val - min_val) / (1.0f - std::abs(2.0f * l - 1.0f));
            
            s_hsl = clampf(s_hsl + factor);
            
            float new_min_val = l - (s_hsl * l * (1.0f - std::abs(2.0f * l - 1.0f)) / 2.0f);
            float new_max_val = l + (s_hsl * l * (1.0f - std::abs(2.0f * l - 1.0f)) / 2.0f);
            v = new_max_val;
            s = (v == 0) ? 0 : (v - new_min_val) / v;
            
            hsvToRgb(h, s, v, r, g, b);
            
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
        }
    }

    void applyLightness(unsigned char* data, int width, int height, float value) {
        int totalPixels = width * height;
        float factor = value / 100.0f;
        
        for (int i = 0; i < totalPixels; i++) {
            int idx = i * 4; 
            
            unsigned char r = data[idx];
            unsigned char g = data[idx + 1];
            unsigned char b = data[idx + 2];
            
            float h, s, v;
            rgbToHsv(r, g, b, h, s, v);
            
            float max_val = v;
            float min_val = (1.0f - s) * v;
            float l = (max_val + min_val) / 2.0f;
            
            l = clampf(l + factor);
            
            if (l <= 0.5f) {
                v = (2.0f * l) / (1.0f + (1.0f - s));
            } else {
                v = (l + s - l * s) / (1.0f - (1.0f - l) * (1.0f - s));
            }
            
            if (l == 0 || l == 1) {
                s = 0;
            } else {
                s = 2.0f * (1.0f - l / v);
            }
            
            hsvToRgb(h, s, v, r, g, b);
            
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
        }
    }
}