import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Creator, Brand } from "../types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Users, Target, Star } from "lucide-react";

interface Props {
  creator: Creator;
  brand: Brand;
}

interface MatchResult {
  score: number;
  overlap: string[];
  recommendation: string;
  collaborationType: string;
  riskLevel: 'low' | 'medium' | 'high';
}

function calculateMatchScore(creator: Creator, brand: Brand): MatchResult {
  const overlap = creator.keywords.filter((k) => brand.keywords.includes(k));
  const score = Math.round((overlap.length / brand.keywords.length) * 100);
  
  // Enhanced recommendation logic
  let recommendation = "";
  let collaborationType = "";
  let riskLevel: 'low' | 'medium' | 'high' = 'medium';

  if (score >= 80) {
    recommendation = "Excellent match! Strong alignment with brand values and audience.";
    collaborationType = "Long-term brand partnership";
    riskLevel = 'low';
  } else if (score >= 60) {
    recommendation = "Good match with solid potential for collaboration.";
    collaborationType = creator.engagementRate > 5 
      ? "Campaign-specific partnerships" 
      : "Product placement opportunities";
    riskLevel = 'low';
  } else if (score >= 40) {
    recommendation = "Moderate match. Consider for specific campaigns or niche targeting.";
    collaborationType = "Limited campaign collaboration";
    riskLevel = 'medium';
  } else {
    recommendation = "Low alignment. Consider alternative creators or different approach.";
    collaborationType = "One-off content creation";
    riskLevel = 'high';
  }

  return { score, overlap, recommendation, collaborationType, riskLevel };
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export default function MatchResult({ creator, brand }: Props) {
  const { score, overlap, recommendation, collaborationType, riskLevel } = calculateMatchScore(creator, brand);

  const pieData = [
    { name: "Match", value: score, color: "#6366F1" },
    { name: "Gap", value: 100 - score, color: "#E5E7EB" },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Match Analysis</h2>
            <Badge className={`${getRiskColor(riskLevel)} border-0`}>
              {riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Creator Profile
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <p className="font-medium text-blue-900">{creator.name}</p>
                <p className="text-blue-700">Platform: {creator.platform}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {formatNumber(creator.followers)} followers
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {creator.engagementRate}% engagement
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Brand Profile
              </h3>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-medium text-purple-900">{brand.brandName}</p>
                {/* <p className="text-purple-700 mt-2">Industry: {brand.industry || 'Not specified'}</p> */}
              </div>
            </div>
          </div>

          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <ResponsiveContainer width={300} height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              
              <motion.div
                className={`absolute inset-0 flex items-center justify-center`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                    {score}%
                  </div>
                  <div className="text-sm text-gray-600 font-medium">MATCH</div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg font-medium text-gray-700"
            >
              {recommendation}
            </motion.div>
          </div>

    
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Shared Values & Keywords</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {overlap.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {overlap.map((keyword, index) => (
                    <motion.div
                      key={keyword}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                    >
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 px-3 py-1">
                        {keyword}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">No shared keywords identified. Consider broader alignment opportunities.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Recommended Collaboration</h3>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Target className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-indigo-900 mb-2">{collaborationType}</h4>
                  <p className="text-indigo-800">
                    {creator.engagementRate > 5 && creator.followers > 100000
                      ? "High engagement and large reach make this creator ideal for comprehensive brand campaigns with measurable ROI."
                      : creator.engagementRate > 5
                      ? "High engagement rate suggests strong audience connection - perfect for authentic product reviews and testimonials."
                      : creator.followers > 100000
                      ? "Large audience reach provides excellent brand awareness opportunities and broad market exposure."
                      : "Niche audience alignment may offer targeted reach for specific demographics or interests."}
                  </p>
                </div>
              </div>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{formatNumber(creator.followers)}</div>
              <div className="text-sm text-gray-600">Potential Reach</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-green-600">{creator.engagementRate}%</div>
              <div className="text-sm text-gray-600">Engagement Rate</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-purple-600">{overlap.length}</div>
              <div className="text-sm text-gray-600">Shared Keywords</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}