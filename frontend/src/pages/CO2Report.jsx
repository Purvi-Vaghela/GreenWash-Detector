import { useState } from 'react';
import Navbar from '../components/Navbar';
import { 
  Leaf, TrendingDown, Clock, DollarSign, Award, Factory, 
  Zap, Sun, Wind, Droplets, Recycle, Truck, Building2,
  ChevronDown, ChevronUp, Target, BarChart3, PieChart,
  ArrowRight, CheckCircle, AlertTriangle, Lightbulb
} from 'lucide-react';

// Demo data for CO2 recommendations
const DEMO_DATA = {
  company_name: "EcoTech Industries Pvt Ltd",
  industry: "Manufacturing",
  current_emissions: "12,500 Metric Tons CO₂/year",
  reduction_potential: "35-45%",
  baseline_year: "2024",
  target_year: "2030",
  
  emission_breakdown: [
    { source: "Electricity", percentage: 45, tons: 5625, color: "bg-amber-500" },
    { source: "Transportation", percentage: 25, tons: 3125, color: "bg-blue-500" },
    { source: "Manufacturing", percentage: 20, tons: 2500, color: "bg-purple-500" },
    { source: "Heating/Cooling", percentage: 10, tons: 1250, color: "bg-emerald-500" },
  ],

  recommendations: [
    {
      id: 1,
      action: "Install Rooftop Solar Panels (500 kW)",
      description: "Deploy solar PV system on factory rooftop to generate clean electricity",
      impact: "2,100 tons CO₂/year",
      impact_percent: "16.8%",
      priority: "HIGH",
      timeline: "6-12 months",
      cost: "₹3.5 Crore",
      savings: "₹85 Lakh/year",
      payback: "4.1 years",
      icon: Sun,
      category: "Renewable Energy"
    },
    {
      id: 2,
      action: "Switch to Electric Vehicle Fleet",
      description: "Replace diesel trucks with electric vehicles for logistics",
      impact: "1,500 tons CO₂/year",
      impact_percent: "12%",
      priority: "HIGH",
      timeline: "12-18 months",
      cost: "₹2.8 Crore",
      savings: "₹45 Lakh/year",
      payback: "6.2 years",
      icon: Truck,
      category: "Transportation"
    },
    {
      id: 3,
      action: "Energy-Efficient Equipment Upgrade",
      description: "Replace old machinery with IE4/IE5 rated motors and VFDs",
      impact: "950 tons CO₂/year",
      impact_percent: "7.6%",
      priority: "MEDIUM",
      timeline: "3-6 months",
      cost: "₹1.2 Crore",
      savings: "₹32 Lakh/year",
      payback: "3.7 years",
      icon: Zap,
      category: "Energy Efficiency"
    },
    {
      id: 4,
      action: "LED Lighting Retrofit",
      description: "Replace all conventional lighting with smart LED systems",
      impact: "320 tons CO₂/year",
      impact_percent: "2.6%",
      priority: "LOW",
      timeline: "1-2 months",
      cost: "₹25 Lakh",
      savings: "₹8 Lakh/year",
      payback: "3.1 years",
      icon: Lightbulb,
      category: "Energy Efficiency"
    },
    {
      id: 5,
      action: "Waste Heat Recovery System",
      description: "Capture and reuse waste heat from manufacturing processes",
      impact: "680 tons CO₂/year",
      impact_percent: "5.4%",
      priority: "MEDIUM",
      timeline: "6-9 months",
      cost: "₹95 Lakh",
      savings: "₹28 Lakh/year",
      payback: "3.4 years",
      icon: Factory,
      category: "Process Optimization"
    },
    {
      id: 6,
      action: "Water Recycling & Treatment Plant",
      description: "Implement zero liquid discharge system",
      impact: "180 tons CO₂/year",
      impact_percent: "1.4%",
      priority: "LOW",
      timeline: "9-12 months",
      cost: "₹1.5 Crore",
      savings: "₹18 Lakh/year",
      payback: "8.3 years",
      icon: Droplets,
      category: "Water Management"
    }
  ],

  certifications: [
    { name: "ISO 14001", status: "Recommended", description: "Environmental Management System" },
    { name: "ISO 50001", status: "Recommended", description: "Energy Management System" },
    { name: "SBTi", status: "Target", description: "Science Based Targets initiative" },
    { name: "CDP", status: "Target", description: "Carbon Disclosure Project" },
    { name: "LEED", status: "Optional", description: "Green Building Certification" },
  ],

  industry_benchmark: {
    company_intensity: 0.85,
    industry_avg: 1.2,
    best_in_class: 0.45,
    unit: "tons CO₂/₹Lakh revenue"
  }
};

const PRIORITY_STYLES = {
  HIGH: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-500' },
  MEDIUM: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-500' },
  LOW: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-500' },
};

export default function CO2Report() {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const data = DEMO_DATA;
  const categories = ['all', ...new Set(data.recommendations.map(r => r.category))];
  
  const filteredRecs = selectedCategory === 'all' 
    ? data.recommendations 
    : data.recommendations.filter(r => r.category === selectedCategory);

  const totalReduction = data.recommendations.reduce((sum, r) => {
    const tons = parseFloat(r.impact.replace(/[^0-9.]/g, ''));
    return sum + tons;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CO₂ Reduction Report</h1>
              <p className="text-gray-600">AI-Generated Sustainability Roadmap</p>
            </div>
          </div>
        </div>

        {/* Company Overview Card */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-8 text-white mb-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-emerald-100 text-sm mb-1">Company</p>
              <h2 className="text-2xl font-bold mb-1">{data.company_name}</h2>
              <p className="text-emerald-200">{data.industry} Sector</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-emerald-100 text-xs mb-1">Current Emissions</p>
                <p className="text-xl font-bold">{data.current_emissions}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-emerald-100 text-xs mb-1">Reduction Potential</p>
                <p className="text-xl font-bold flex items-center gap-1">
                  <TrendingDown className="w-5 h-5" />
                  {data.reduction_potential}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-emerald-100 text-xs mb-1">Baseline Year</p>
                <p className="text-xl font-bold">{data.baseline_year}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-emerald-100 text-xs mb-1">Target Year</p>
                <p className="text-xl font-bold">{data.target_year}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Emission Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Emission Sources Breakdown</h3>
              </div>
              
              <div className="space-y-4">
                {data.emission_breakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{item.source}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{item.tons.toLocaleString()} tons</span>
                        <span className="font-bold text-gray-900">{item.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Recommended Actions</h3>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Total Potential:</span>
                  <span className="font-bold text-emerald-600">{totalReduction.toLocaleString()} tons/year</span>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Actions' : cat}
                  </button>
                ))}
              </div>

              {/* Recommendations List */}
              <div className="space-y-4">
                {filteredRecs.map((rec) => {
                  const Icon = rec.icon;
                  const style = PRIORITY_STYLES[rec.priority];
                  const isExpanded = expandedId === rec.id;

                  return (
                    <div 
                      key={rec.id}
                      className={`border ${style.border} rounded-xl overflow-hidden transition-all`}
                    >
                      <div 
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${isExpanded ? 'bg-gray-50' : ''}`}
                        onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 ${style.bg} rounded-xl`}>
                            <Icon className={`w-6 h-6 ${style.text}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900">{rec.action}</h4>
                                <p className="text-sm text-gray-500 mt-1">{rec.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${style.badge}`}>
                                  {rec.priority}
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 mt-3">
                              <div className="flex items-center gap-1 text-sm">
                                <TrendingDown className="w-4 h-4 text-emerald-500" />
                                <span className="text-gray-600">{rec.impact}</span>
                                <span className="text-emerald-600 font-medium">({rec.impact_percent})</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Clock className="w-4 h-4 text-blue-500" />
                                {rec.timeline}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="bg-white rounded-lg p-3 border">
                              <p className="text-xs text-gray-500 mb-1">Investment Cost</p>
                              <p className="font-bold text-gray-900">{rec.cost}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border">
                              <p className="text-xs text-gray-500 mb-1">Annual Savings</p>
                              <p className="font-bold text-emerald-600">{rec.savings}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border">
                              <p className="text-xs text-gray-500 mb-1">Payback Period</p>
                              <p className="font-bold text-blue-600">{rec.payback}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Industry Benchmark */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Industry Benchmark</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Your Company</span>
                    <span className="font-bold text-emerald-600">{data.industry_benchmark.company_intensity}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Industry Average</span>
                    <span className="font-bold text-amber-600">{data.industry_benchmark.industry_avg}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Best in Class</span>
                    <span className="font-bold text-blue-600">{data.industry_benchmark.best_in_class}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '37%' }} />
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                Unit: {data.industry_benchmark.unit}
              </p>

              <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">29% better than industry average</span>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Recommended Certifications</h3>
              </div>
              
              <div className="space-y-3">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{cert.name}</p>
                      <p className="text-xs text-gray-500">{cert.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cert.status === 'Recommended' ? 'bg-emerald-100 text-emerald-700' :
                      cert.status === 'Target' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {cert.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-4">Implementation Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Actions</span>
                  <span className="font-bold">{data.recommendations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">High Priority</span>
                  <span className="font-bold text-red-400">
                    {data.recommendations.filter(r => r.priority === 'HIGH').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Investment</span>
                  <span className="font-bold">₹9.8 Crore</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Annual Savings</span>
                  <span className="font-bold text-emerald-400">₹2.16 Crore</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Payback</span>
                  <span className="font-bold">4.5 years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
