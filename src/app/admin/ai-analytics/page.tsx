// AI Analytics Admin Page
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Brain, TrendingUp, AlertCircle, Sparkles, Clock, BarChart3 } from 'lucide-react';

interface AnalysisResult {
    question: string;
    sql_executed: string;
    insights: {
        summary: string;
        key_metrics: Array<{ label: string; value: string | number; context?: string }>;
        insights: string[];
        recommendations: string[];
        confidence: number;
    };
    timestamp: string;
}

const SUGGESTED_QUESTIONS = [
    "What's my revenue for the last 7 days?",
    "Show me top 5 selling items this month",
    "How many new vs returning customers this week?",
    "What's the points redemption rate?",
    "Which days have the highest sales?",
    "What's the average order value?",
];

export default function AIAnalyticsPage() {
    const [question, setQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAsk = async () => {
        if (!question.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: question.trim() })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || data.reason || 'Analysis failed');
            }

            setResult(data);
            setQuestion('');
        } catch (err: any) {
            setError(err.message || 'Failed to analyze question');
            console.error('Analysis error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAsk();
        }
    };

    return (
        <div className="min-h-screen bg-transparent py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#8B6F47] to-[#7f3b2d] rounded-xl flex items-center justify-center shadow-md">
                            <Brain className="w-7 h-7 text-[#FFF9EB]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-display text-[#7f3b2d]">AI Analytics</h1>
                            <p className="text-[#8B6F47] font-medium">Superadmin Intelligence System</p>
                        </div>
                    </div>
                    <div className="bg-[#FFF9EB] border border-[#8B6F47]/20 rounded-lg p-4 mt-4 shadow-sm">
                        <div className="flex items-start gap-2">
                            <Sparkles className="w-5 h-5 text-[#8B6F47] mt-0.5" />
                            <div className="text-sm text-[#7f3b2d]">
                                <strong>Ask anything</strong> about your business data. I'll analyze orders, revenue, customers, menu performance, and more - all in natural language.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Input */}
                <div className="bg-[#FFF9EB] rounded-xl shadow-sm p-6 mb-6 border border-[#8B6F47]/10">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything about your business..."
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 border border-[#8B6F47]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B6F47] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white text-[#7f3b2d] placeholder-[#8B6F47]/50"
                        />
                        <button
                            onClick={handleAsk}
                            disabled={!question.trim() || isLoading}
                            className="bg-[#7f3b2d] text-white px-6 py-3 rounded-lg hover:bg-[#6d5638] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm font-medium"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Ask
                                </>
                            )}
                        </button>
                    </div>

                    {/* Suggested Questions */}
                    <div className="mt-4">
                        <p className="text-sm text-[#8B6F47] mb-2 font-medium">Quick questions:</p>
                        <div className="flex flex-wrap gap-2">
                            {SUGGESTED_QUESTIONS.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setQuestion(q)}
                                    disabled={isLoading}
                                    className="text-sm px-3 py-1.5 bg-[#faeade] hover:bg-[#ebdcc8] text-[#7f3b2d] rounded-full transition disabled:opacity-50 border border-[#8B6F47]/10"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                        >
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-red-900">Analysis Failed</p>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Display */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Summary Card */}
                            <div className="bg-[#FFF9EB] rounded-xl shadow-sm p-6 border border-[#8B6F47]/10">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold font-display text-[#7f3b2d] mb-2">
                                            {result.question}
                                        </h2>
                                        <p className="text-[#8B6F47]">{result.insights.summary}</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                        <TrendingUp className="w-4 h-4" />
                                        {Math.round(result.insights.confidence * 100)}% confident
                                    </div>
                                </div>

                                {/* Key Metrics */}
                                {result.insights.key_metrics && result.insights.key_metrics.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        {result.insights.key_metrics.map((metric, idx) => (
                                            <div key={idx} className="bg-[#faeade]/50 border border-[#8B6F47]/10 rounded-lg p-4">
                                                <p className="text-sm text-[#8B6F47] mb-1 font-medium">{metric.label}</p>
                                                <p className="text-2xl font-bold text-[#7f3b2d]">{metric.value}</p>
                                                {metric.context && (
                                                    <p className="text-xs text-[#8B6F47]/70 mt-1">{metric.context}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Insights */}
                                {result.insights.insights && result.insights.insights.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-[#7f3b2d] mb-3 flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-[#8B6F47]" />
                                            Key Insights
                                        </h3>
                                        <ul className="space-y-2">
                                            {result.insights.insights.map((insight, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-[#5c4d45]">
                                                    <span className="text-[#8B6F47] mt-1">•</span>
                                                    <span>{insight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Recommendations */}
                                {result.insights.recommendations && result.insights.recommendations.length > 0 && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5" />
                                            Recommendations
                                        </h3>
                                        <ul className="space-y-1">
                                            {result.insights.recommendations.map((rec, idx) => (
                                                <li key={idx} className="text-sm text-yellow-800 flex items-start gap-2">
                                                    <span>→</span>
                                                    <span>{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Metadata */}
                                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(result.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                    <details className="cursor-pointer">
                                        <summary className="hover:text-gray-700">View SQL</summary>
                                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                                            {result.sql_executed}
                                        </pre>
                                    </details>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
