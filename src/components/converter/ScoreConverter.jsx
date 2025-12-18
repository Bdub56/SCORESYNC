import React, { useState, useMemo, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ScoreInput, { scoreTypes } from './ScoreInput';
import ConversionResults from './ConversionResults';
import ClassificationBanner from './ClassificationBanner';
import SavedConversions from './SavedConversions';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { logActivity } from '../activityLogger';

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
function toZScore(value, type, mean, standardDeviation) {
    // Check if it's a preset type (which uses raw score logic)
    const selectedType = scoreTypes.find(t => t.value === type);
    const isPreset = selectedType?.category === 'preset';
    
    switch (type) {
        case 'raw':
            if (!standardDeviation || standardDeviation === 0) return null;
            return (value - mean) / standardDeviation;
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
            // Handle presets like raw scores
            if (isPreset) {
                if (!standardDeviation || standardDeviation === 0) return null;
                return (value - mean) / standardDeviation;
            }
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
    const [scoreType, setScoreType] = useState('raw');
    const [mean, setMean] = useState('100');
    const [standardDeviation, setStandardDeviation] = useState('15');
    const [scaleName, setScaleName] = useState('');
    const [name, setName] = useState('');
    const [ageYears, setAgeYears] = useState('');
    const [ageMonths, setAgeMonths] = useState('');
    const [administratorName, setAdministratorName] = useState('');
    const [administratorEmail, setAdministratorEmail] = useState('');

    const queryClient = useQueryClient();

    const saveMutation = useMutation({
        mutationFn: (data) => base44.entities.SavedConversion.create(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['savedConversions'] });
            toast.success('Conversion saved successfully!');
            logActivity('score_saved', `Saved ${data.scale_name} score for ${data.name || 'unnamed subject'}`, {
                scale: data.scale_name,
                score_type: data.score_type,
                subject: data.name,
            });
        },
    });

    // Auto-populate mean and SD when a preset is selected
    useEffect(() => {
        const selectedType = scoreTypes.find(t => t.value === scoreType);
        if (selectedType?.category === 'preset') {
            setMean(selectedType.mean.toString());
            setStandardDeviation(selectedType.sd.toString());
        }
    }, [scoreType]);

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

        const zScore = toZScore(numValue, scoreType, parseFloat(mean), parseFloat(standardDeviation));
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
        }, [inputValue, scoreType, mean, standardDeviation]);

        const handleSave = async () => {
            if (!scaleName.trim()) {
                toast.error('Please enter a scale/test name');
                return;
            }
            if (!inputValue || convertedScores.z === null) {
                toast.error('Please enter a valid score first');
                return;
            }

            return saveMutation.mutateAsync({
                name: name.trim() || null,
                age_years: ageYears ? parseFloat(ageYears) : null,
                age_months: ageMonths ? parseFloat(ageMonths) : null,
                administrator_name: administratorName.trim() || null,
                administrator_email: administratorEmail.trim() || null,
                scale_name: scaleName,
                score_type: scoreType,
                input_value: parseFloat(inputValue),
                mean: parseFloat(mean),
                standard_deviation: parseFloat(standardDeviation),
                z_score: convertedScores.z,
                t_score: convertedScores.t,
                percentile: convertedScores.percentile,
                standard_score: convertedScores.standard,
                scaled_score: convertedScores.scaled,
            });
        };

        const handleReset = () => {
            setInputValue('');
            setScaleName('');
            setName('');
            setAgeYears('');
            setAgeMonths('');
            setAdministratorName('');
            setAdministratorEmail('');
            setScoreType('raw');
            setMean('100');
            setStandardDeviation('15');
        };

        const getClassification = (scores) => {
            const standard = scores.standard;
            if (standard >= 130) return { label: 'Very Superior', color: '#10b981' };
            if (standard >= 120) return { label: 'Superior', color: '#3b82f6' };
            if (standard >= 110) return { label: 'High Average', color: '#8b5cf6' };
            if (standard >= 90) return { label: 'Average', color: '#6366f1' };
            if (standard >= 80) return { label: 'Low Average', color: '#f59e0b' };
            if (standard >= 70) return { label: 'Borderline', color: '#f97316' };
            return { label: 'Extremely Low', color: '#ef4444' };
        };

        const handleSaveReport = () => {
            if (!scaleName.trim() || !inputValue || convertedScores.z === null) {
                toast.error('Please enter valid data before generating report');
                return;
            }

            const doc = new jsPDF();
            const classification = getClassification(convertedScores);

            // Title
            doc.setFontSize(20);
            doc.setTextColor(51, 65, 85);
            doc.text('Psychometric Score Report', 105, 20, { align: 'center' });

            // Subject Info
            doc.setFontSize(12);
            doc.setTextColor(100, 116, 139);
            let yPos = 40;

            if (name) {
                doc.text(`Subject: ${name}`, 20, yPos);
                yPos += 8;
            }

            if (ageYears || ageMonths) {
                const ageStr = `${ageYears || 0} years ${ageMonths || 0} months`;
                doc.text(`Age: ${ageStr}`, 20, yPos);
                yPos += 8;
            }

            doc.text(`Test: ${scaleName}`, 20, yPos);
            yPos += 8;
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos);
            yPos += 15;

            // Input Score
            doc.setFontSize(14);
            doc.setTextColor(51, 65, 85);
            doc.text('Input Score', 20, yPos);
            yPos += 8;
            doc.setFontSize(11);
            doc.setTextColor(100, 116, 139);
            const scoreTypeLabel = scoreTypes.find(t => t.value === scoreType)?.label || scoreType;
            doc.text(`${scoreTypeLabel}: ${inputValue}`, 20, yPos);
            yPos += 15;

            // Classification
            doc.setFontSize(14);
            doc.setTextColor(51, 65, 85);
            doc.text('Classification', 20, yPos);
            yPos += 8;
            doc.setFontSize(12);
            doc.setTextColor(classification.color);
            doc.text(classification.label, 20, yPos);
            yPos += 15;

            // Converted Scores
            doc.setFontSize(14);
            doc.setTextColor(51, 65, 85);
            doc.text('Converted Scores', 20, yPos);
            yPos += 10;

            doc.setFontSize(11);
            doc.setTextColor(100, 116, 139);
            const scores = [
                { label: 'Z-Score', value: convertedScores.z?.toFixed(2) },
                { label: 'T-Score', value: convertedScores.t?.toFixed(1) },
                { label: 'Percentile', value: convertedScores.percentile?.toFixed(1) + '%' },
                { label: 'Standard Score (IQ)', value: convertedScores.standard?.toFixed(0) },
                { label: 'Scaled Score', value: convertedScores.scaled?.toFixed(1) }
            ];

            scores.forEach(score => {
                doc.text(`${score.label}: ${score.value}`, 20, yPos);
                yPos += 7;
            });

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text('Generated by Score Sync - Psychometric Score Converter', 105, 280, { align: 'center' });
            doc.text('All conversions assume normally distributed data', 105, 285, { align: 'center' });

            // Save
            const fileName = `${scaleName.replace(/[^a-z0-9]/gi, '_')}_${name || 'report'}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            toast.success('Report saved successfully!');
        };

        const canSave = scaleName.trim() && inputValue && convertedScores.z !== null;

        return (
        <div className="space-y-8">
                <ScoreInput
                    value={inputValue}
                    onChange={setInputValue}
                    scoreType={scoreType}
                    onScoreTypeChange={setScoreType}
                    meanValue={mean}
                    onMeanChange={setMean}
                    sdValue={standardDeviation}
                    onSdChange={setStandardDeviation}
                    scaleName={scaleName}
                    onScaleNameChange={setScaleName}
                    name={name}
                    onNameChange={setName}
                    ageYears={ageYears}
                    onAgeYearsChange={setAgeYears}
                    ageMonths={ageMonths}
                    onAgeMonthsChange={setAgeMonths}
                    administratorName={administratorName}
                    onAdministratorNameChange={setAdministratorName}
                    administratorEmail={administratorEmail}
                    onAdministratorEmailChange={setAdministratorEmail}
                    onSave={handleSave}
                    onReset={handleReset}
                    canSave={canSave}
                    onSaveReport={handleSaveReport}
                    scores={convertedScores}
                />

            <ClassificationBanner scores={convertedScores} />

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

            <SavedConversions 
                subjectName={name} 
                onSave={handleSave}
                onReset={handleReset}
                canSave={canSave}
            />
            </div>
            );
            }