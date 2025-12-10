import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { TrendingUp, Percent, BarChart3, Activity, Gauge, Brain, GraduationCap, FileText } from 'lucide-react';

const scoreTypeInfo = {
    z: {
        title: 'Z-Score',
        icon: TrendingUp,
        color: 'indigo',
        description: 'A Z-score (or standard score) represents the number of standard deviations a value is from the mean.',
        interpretation: [
            'Z = 0: Exactly at the mean (average)',
            'Z = +1: One standard deviation above the mean',
            'Z = -1: One standard deviation below the mean',
            'Z = +2: Two standard deviations above (97.7th percentile)',
            'Z = -2: Two standard deviations below (2.3rd percentile)',
        ],
        useCases: [
            'Research and statistical analysis',
            'Comparing scores from different tests or scales',
            'Identifying outliers in data',
            'Standardizing variables in regression analysis',
        ],
        note: 'Most values fall between -3 and +3. Values beyond ±3 are rare (less than 0.3% of population).',
    },
    t: {
        title: 'T-Score',
        icon: Activity,
        color: 'violet',
        description: 'A T-score transforms Z-scores to eliminate negative numbers and decimals, making scores easier to communicate.',
        interpretation: [
            'T = 50: Average performance',
            'T = 60: One standard deviation above average',
            'T = 40: One standard deviation below average',
            'T = 70+: Significantly above average (top 2.3%)',
            'T = 30-: Significantly below average (bottom 2.3%)',
        ],
        useCases: [
            'Clinical assessments and psychological testing',
            'Personality inventories (MMPI, MCMI)',
            'Behavioral rating scales',
            'Educational achievement tests',
        ],
        note: 'T-scores typically range from 20 to 80, with 50 representing the mean.',
    },
    percentile: {
        title: 'Percentile Rank',
        icon: Percent,
        color: 'teal',
        description: 'Percentile rank indicates the percentage of scores in the reference group that fall at or below a given score.',
        interpretation: [
            '50th percentile: Exactly average',
            '75th percentile: Better than 75% of the comparison group',
            '90th percentile: Top 10% of performers',
            '25th percentile: Lower than 75% of the comparison group',
            '99th percentile: Top 1% of performers',
        ],
        useCases: [
            'Standardized test reporting (SAT, ACT, GRE)',
            'Growth charts and developmental assessments',
            'Clinical interpretation of test results',
            'Educational placement decisions',
        ],
        note: 'Percentiles are not equally spaced—differences near the median represent smaller raw score differences than differences in the extremes.',
    },
    standard: {
        title: 'Standard Score (IQ Scale)',
        icon: BarChart3,
        color: 'amber',
        description: 'Standard scores on the IQ scale have a mean of 100 and standard deviation of 15, commonly used for cognitive ability scores.',
        interpretation: [
            '100: Average intelligence',
            '115: One SD above (84th percentile) - High Average',
            '130+: Two SD above (98th percentile) - Very Superior',
            '85: One SD below (16th percentile) - Low Average',
            '70-: Two SD below (2nd percentile) - Significantly impaired',
        ],
        useCases: [
            'Intelligence testing (WAIS, WISC, Stanford-Binet)',
            'Cognitive ability assessments',
            'Educational evaluations and placement',
            'Diagnostic assessments for learning disabilities',
        ],
        note: 'This is the most common scale for reporting overall IQ and composite scores in cognitive assessments.',
    },
    scaled: {
        title: 'Scaled Score',
        icon: Gauge,
        color: 'rose',
        description: 'Scaled scores have a mean of 10 and standard deviation of 3, commonly used for subtest scores.',
        interpretation: [
            '10: Average performance on the subtest',
            '13: One SD above (84th percentile) - High Average',
            '16+: Two SD above (98th percentile) - Superior',
            '7: One SD below (16th percentile) - Low Average',
            '4-: Two SD below (2nd percentile) - Borderline',
        ],
        useCases: [
            'WAIS and WISC subtest scores',
            'Individual ability profiles within tests',
            'Identifying cognitive strengths and weaknesses',
            'Neuropsychological assessment batteries',
        ],
        note: 'Scaled scores typically range from 1 to 19, with most scores falling between 7 and 13.',
    },
    // IQ Test Presets
    wais: {
        title: 'WAIS-IV/V (Wechsler Adult Intelligence Scale)',
        icon: Brain,
        color: 'indigo',
        description: 'The WAIS is the most widely used intelligence test for adults aged 16-90. Full-scale IQ scores use Mean=100, SD=15.',
        interpretation: [
            '130+: Very Superior (top 2.3%)',
            '120-129: Superior (top 6.7-11%)',
            '110-119: High Average (75th-90th percentile)',
            '90-109: Average (25th-75th percentile)',
            '80-89: Low Average (9th-25th percentile)',
            '70-79: Borderline (2nd-9th percentile)',
            'Below 70: Extremely Low (bottom 2%)',
        ],
        useCases: [
            'Clinical assessment of adult intelligence',
            'Diagnosis of intellectual disabilities',
            'Identification of cognitive strengths/weaknesses',
            'Neuropsychological evaluations',
            'Educational and vocational planning',
        ],
        note: 'Index scores (Verbal Comprehension, Perceptual Reasoning, Working Memory, Processing Speed) also use the same scale.',
    },
    wisc: {
        title: 'WISC-V (Wechsler Intelligence Scale for Children)',
        icon: Brain,
        color: 'violet',
        description: 'The WISC-V is the most widely used intelligence test for children aged 6-16. Full-scale IQ scores use Mean=100, SD=15.',
        interpretation: [
            '130+: Very Superior/Gifted (top 2.3%)',
            '120-129: Superior (top 6.7-11%)',
            '110-119: High Average (75th-90th percentile)',
            '90-109: Average (25th-75th percentile)',
            '80-89: Low Average (9th-25th percentile)',
            '70-79: Borderline (2nd-9th percentile)',
            'Below 70: Extremely Low (bottom 2%)',
        ],
        useCases: [
            'Educational assessment and placement',
            'Gifted program identification',
            'Learning disability diagnosis',
            'Psychoeducational evaluations',
            'Special education eligibility',
        ],
        note: 'The WISC-V includes five primary index scores and a Full Scale IQ, all using this scale.',
    },
    'stanford-binet': {
        title: 'Stanford-Binet Intelligence Scales (5th Edition)',
        icon: Brain,
        color: 'amber',
        description: 'One of the oldest and most respected intelligence tests, used for ages 2-85+. Uses Mean=100, SD=15.',
        interpretation: [
            '130+: Very Superior/Gifted',
            '120-129: Superior',
            '110-119: High Average',
            '90-109: Average',
            '80-89: Low Average',
            '70-79: Borderline Impaired',
            'Below 70: Significantly Impaired',
        ],
        useCases: [
            'Early childhood cognitive assessment',
            'Gifted identification',
            'Developmental delay assessment',
            'Special education evaluation',
            'Research on cognitive development',
        ],
        note: 'The Stanford-Binet is particularly useful for assessing very young children and individuals at the extremes of intelligence.',
    },
    'woodcock-johnson': {
        title: 'Woodcock-Johnson IV Tests of Cognitive Abilities',
        icon: Brain,
        color: 'teal',
        description: 'A comprehensive battery assessing cognitive abilities and academic achievement. Uses Mean=100, SD=15.',
        interpretation: [
            '131+: Very Superior (top 2%)',
            '121-130: Superior (91st-98th percentile)',
            '111-120: High Average (76th-90th percentile)',
            '90-110: Average (25th-75th percentile)',
            '80-89: Low Average (9th-24th percentile)',
            '70-79: Low (3rd-8th percentile)',
            'Below 70: Very Low (bottom 2%)',
        ],
        useCases: [
            'Educational assessment and placement',
            'Learning disability diagnosis',
            'Cognitive processing evaluation',
            'Academic achievement testing',
            'Pre-K through geriatric assessment',
        ],
        note: 'WJ IV provides detailed analysis of specific cognitive abilities including processing speed, memory, and reasoning.',
    },
    // Educational Presets
    sat: {
        title: 'SAT (Scholastic Assessment Test)',
        icon: GraduationCap,
        color: 'indigo',
        description: 'The SAT is a standardized college admissions test. Each section (Math, Reading & Writing) is scored 200-800 with Mean≈500, SD≈100.',
        interpretation: [
            '700-800: Excellent (93rd-99th percentile)',
            '600-690: Good (75th-92nd percentile)',
            '500-590: Average (40th-74th percentile)',
            '400-490: Below Average (15th-39th percentile)',
            '200-390: Low (below 15th percentile)',
        ],
        useCases: [
            'College admissions',
            'Scholarship qualification',
            'Academic program placement',
            'Educational readiness assessment',
        ],
        note: 'Total SAT scores range from 400-1600 (sum of both sections). The 50th percentile is typically around 1050 total.',
    },
    act: {
        title: 'ACT (American College Testing)',
        icon: GraduationCap,
        color: 'violet',
        description: 'The ACT is a standardized college admissions test. Composite scores range 1-36 with Mean≈20.8, SD≈5.8.',
        interpretation: [
            '32-36: Excellent (97th-99th percentile)',
            '27-31: Very Good (87th-96th percentile)',
            '21-26: Above Average (50th-86th percentile)',
            '17-20: Average (25th-49th percentile)',
            '13-16: Below Average (10th-24th percentile)',
            'Below 13: Low (below 10th percentile)',
        ],
        useCases: [
            'College admissions',
            'Merit-based scholarships',
            'Course placement in college',
            'State-wide accountability testing',
        ],
        note: 'The ACT tests English, Math, Reading, and Science, with an optional Writing section.',
    },
    gre: {
        title: 'GRE (Graduate Record Examination)',
        icon: GraduationCap,
        color: 'teal',
        description: 'The GRE is required for many graduate school programs. Verbal and Quantitative sections are scored 130-170 with Mean≈150, SD≈8.5.',
        interpretation: [
            '165-170: Excellent (92nd-99th percentile)',
            '160-164: Very Good (82nd-91st percentile)',
            '155-159: Good (65th-81st percentile)',
            '150-154: Average (45th-64th percentile)',
            '145-149: Below Average (25th-44th percentile)',
            '130-144: Low (below 25th percentile)',
        ],
        useCases: [
            'Graduate school admissions',
            'PhD program applications',
            'Fellowship qualification',
            'International student assessment',
        ],
        note: 'The Analytical Writing section is scored separately on a 0-6 scale in half-point increments.',
    },
    gmat: {
        title: 'GMAT (Graduate Management Admission Test)',
        icon: GraduationCap,
        color: 'amber',
        description: 'The GMAT is used for business school admissions. Total scores range 200-800 with Mean≈550, SD≈100.',
        interpretation: [
            '700-800: Excellent (88th-99th percentile)',
            '650-699: Very Good (72nd-87th percentile)',
            '600-649: Good (56th-71st percentile)',
            '550-599: Average (40th-55th percentile)',
            '500-549: Below Average (26th-39th percentile)',
            '200-499: Low (below 26th percentile)',
        ],
        useCases: [
            'MBA program admissions',
            'Business school scholarships',
            'Executive MBA applications',
            'Masters in Management programs',
        ],
        note: 'The GMAT has four sections: Quantitative, Verbal, Integrated Reasoning, and Analytical Writing.',
    },
    // Subtest Presets
    'wais-subtest': {
        title: 'WAIS Subtest Scores',
        icon: FileText,
        color: 'indigo',
        description: 'Individual subtests on the WAIS (e.g., Block Design, Similarities, Digit Span) use scaled scores with Mean=10, SD=3.',
        interpretation: [
            '16-19: Very Superior (98th-99th percentile)',
            '14-15: Superior (91st-97th percentile)',
            '13: High Average (84th percentile)',
            '8-12: Average (25th-75th percentile)',
            '7: Low Average (16th percentile)',
            '5-6: Borderline (5th-9th percentile)',
            '1-4: Extremely Low (below 2nd percentile)',
        ],
        useCases: [
            'Identifying cognitive strengths and weaknesses',
            'Pattern analysis in neuropsychological assessment',
            'Differential diagnosis of learning disorders',
            'Profile analysis for intervention planning',
        ],
        note: 'Subtest scores are used to calculate Index scores and Full Scale IQ. Variability among subtests can be clinically significant.',
    },
    'wisc-subtest': {
        title: 'WISC Subtest Scores',
        icon: FileText,
        color: 'violet',
        description: 'Individual subtests on the WISC (e.g., Vocabulary, Matrix Reasoning, Digit Span) use scaled scores with Mean=10, SD=3.',
        interpretation: [
            '16-19: Very Superior (98th-99th percentile)',
            '14-15: Superior (91st-97th percentile)',
            '13: High Average (84th percentile)',
            '8-12: Average (25th-75th percentile)',
            '7: Low Average (16th percentile)',
            '5-6: Borderline (5th-9th percentile)',
            '1-4: Significantly Below Average (below 2nd percentile)',
        ],
        useCases: [
            'Educational assessment and planning',
            'Learning disability identification',
            'Cognitive profile analysis',
            'Intervention and accommodation planning',
            'Gifted program placement',
        ],
        note: 'Analyzing patterns across subtests helps identify specific learning strengths and challenges in children.',
    },
};

export default function ScoreTypeInfoModal({ scoreType, open, onOpenChange }) {
    const info = scoreTypeInfo[scoreType];
    
    if (!info) return null;

    const Icon = info.icon;
    
    const colorClasses = {
        indigo: 'text-indigo-600 bg-indigo-50',
        violet: 'text-violet-600 bg-violet-50',
        teal: 'text-teal-600 bg-teal-50',
        amber: 'text-amber-600 bg-amber-50',
        rose: 'text-rose-600 bg-rose-50',
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${colorClasses[info.color]}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-2xl">{info.title}</DialogTitle>
                    </div>
                    <DialogDescription className="text-base leading-relaxed">
                        {info.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                            <span className="text-lg">📊</span> Interpretation Guide
                        </h3>
                        <ul className="space-y-2">
                            {info.interpretation.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                                    <span className="text-indigo-500 mt-1">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                            <span className="text-lg">🎯</span> Common Use Cases
                        </h3>
                        <ul className="space-y-2">
                            {info.useCases.map((useCase, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                                    <span className="text-teal-500 mt-1">•</span>
                                    <span>{useCase}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-900">
                            <strong>Note:</strong> {info.note}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}