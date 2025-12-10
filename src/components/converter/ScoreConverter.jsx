import React, { useState, useMemo } from 'react';
import ScoreInput from './ScoreInput';
import ConversionResults from './ConversionResults';
import { motion } from 'framer-motion';

// Error function approximation for normal CDF
function erf(x) {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
}

// Standard normal CDF
function normalCDF(z) {
    return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

// Inverse normal CDF (approximation)
function inverseNormalCDF(p) {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    if (p === 0.5) return 0;

    // Rational approximation for lower region
    const a = [
        -3.969683028665376e+01,
        2.209460984245205e+02,
        -2.759285104469687e+02,
        1.383577518672690e+02,
        -3.066479806614716e+01,
        2.506628277459239e+00
    ];
    const b = [
        -5.447609879822406e+01,
        1.615858368580409e+02,
        -1.556989798598866e+02,
        6.680131188771972e+01,
        -1.328068155288572e+01
    ];
    const c = [
        -7.784894002430293e-03,
        -3.223964580411365e-01,
        -2.400758277161838e+00,
        -2.549732539343734e+00,
        4.374664141464968e+00,
        2.938163982698783e+00
    ];
    const d = [
        7.784695709041462e-03,
        3.224671290700398e-01,
        2.445134137142996e+00,
        3.754408661907416e+00
    ];

    const pLow = 0.02425;
    const pHigh = 1 - pLow;

    let q, r;

    if (p < pLow) {
        q = Math.sqrt(-2 * Math.log(p));
        return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
               ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
    } else if (p <= pHigh) {
        q = p - 0.5;
        r = q * q;
        return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q /
               (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
    } else {
        q = Math.sqrt(-2 * Math.log(1 - p));
        return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
                ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
    }
}

// Conversion functions - all go through Z-score as intermediate
function toZScore(value, type) {
    switch (type) {
        case 'z':
            return value;
        case 't':
            return (value - 50) / 10;
        case 'percentile':
            // Clamp percentile between 0.01 and 99.99 to avoid infinity
            const clampedP = Math.max(0.0001, Math.min(0.9999, value / 100));
            return inverseNormalCDF(clampedP);
        case 'standard':
            return (value - 100) / 15;
        case 'scaled':
            return (value - 10) / 3;
        default:
            return null;
    }
}

function fromZScore(z) {
    const percentile = normalCDF(z) * 100;
    return {
        z: z,
        t: z * 10 + 50,
        percentile: Math.max(0.01, Math.min(99.99, percentile)),
        standard: z * 15 + 100,
        scaled: z * 3 + 10
    };
}

export default function ScoreConverter() {
    const [inputValue, setInputValue] = useState('');
    const [scoreType, setScoreType] = useState('z');

    const convertedScores = useMemo(() => {
        const numValue = parseFloat(inputValue);
        
        if (isNaN(numValue) || inputValue === '') {
            return {
                z: null,
                t: null,
                percentile: null,
                standard: null,
                scaled: null
            };
        }

        // Validate percentile range
        if (scoreType === 'percentile' && (numValue <= 0 || numValue >= 100)) {
            return {
                z: null,
                t: null,
                percentile: numValue,
                standard: null,
                scaled: null
            };
        }

        const zScore = toZScore(numValue, scoreType);
        if (zScore === null || !isFinite(zScore)) {
            return {
                z: null,
                t: null,
                percentile: null,
                standard: null,
                scaled: null
            };
        }

        return fromZScore(zScore);
    }, [inputValue, scoreType]);

    return (
        <div className="space-y-8">
            <ScoreInput
                value={inputValue}
                onChange={setInputValue}
                scoreType={scoreType}
                onScoreTypeChange={setScoreType}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <ConversionResults 
                    scores={convertedScores} 
                    activeType={scoreType}
                />
            </motion.div>
        </div>
    );
}