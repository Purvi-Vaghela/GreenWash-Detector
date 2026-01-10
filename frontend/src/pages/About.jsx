import Navbar from '../components/Navbar';
import { 
  Shield, Brain, Target, GitCompare, BadgeCheck, 
  AlertCircle, AlertTriangle, CheckCircle, FileText,
  Search, Cpu, BarChart3, Users, Building2, Leaf
} from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-2xl mb-6">
            <Leaf className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GreenWash Detector</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered ESG Forensic Audit Tool for detecting corporate greenwashing 
            through advanced analysis and cross-referencing.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-emerald-100 text-lg leading-relaxed">
              To bring transparency and accountability to corporate sustainability claims. 
              We help government regulators identify potential greenwashing and assist 
              companies in improving their environmental reporting practices.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Upload Report</h3>
              <p className="text-gray-600 text-sm">
                Upload corporate sustainability PDF reports for analysis. 
                Our system extracts text and key metrics automatically.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Cross-Reference</h3>
              <p className="text-gray-600 text-sm">
                We search external news sources for the company to find 
                any contradictions between claims and reality.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. AI Analysis</h3>
              <p className="text-gray-600 text-sm">
                GPT-4o performs forensic ESG audit using our mathematical 
                scoring engine to calculate trust scores.
              </p>
            </div>
          </div>
        </section>

        {/* Scoring Formula */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            <Brain className="w-6 h-6 inline mr-2" />
            The Mathematical Scoring Engine
          </h2>
          
          <div className="bg-white rounded-3xl shadow-lg p-8">
            {/* Formula Display */}
            <div className="bg-slate-900 rounded-2xl p-6 mb-8 text-center">
              <p className="text-emerald-400 text-sm mb-2">Trust Score Formula</p>
              <p className="text-white text-2xl font-mono">
                T<sub>score</sub> = (0.40 × S) + (0.35 × C) + (0.25 × V)
              </p>
            </div>

            {/* Score Components */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-2 border-emerald-200 rounded-2xl p-6 bg-emerald-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Specificity (S)</h3>
                    <p className="text-emerald-600 text-sm font-semibold">Weight: 40%</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Measures concrete, measurable data in the report.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-emerald-700">✓ High Score:</p>
                  <ul className="text-gray-600 ml-4 space-y-1">
                    <li>• Metric Tons of CO₂</li>
                    <li>• Liters, kWh, MWh</li>
                    <li>• Yearly Deadlines</li>
                    <li>• Percentage targets</li>
                  </ul>
                  <p className="text-red-600 mt-3">✗ Low Score:</p>
                  <ul className="text-gray-600 ml-4 space-y-1">
                    <li>• "Eco-friendly"</li>
                    <li>• "Green initiatives"</li>
                    <li>• "Sustainable practices"</li>
                  </ul>
                </div>
              </div>

              <div className="border-2 border-blue-200 rounded-2xl p-6 bg-blue-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <GitCompare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Consistency (C)</h3>
                    <p className="text-blue-600 text-sm font-semibold">Weight: 35%</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Cross-references claims against external news data.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-emerald-700">✓ High Score:</p>
                  <ul className="text-gray-600 ml-4 space-y-1">
                    <li>• Claims match news</li>
                    <li>• No contradictions</li>
                    <li>• Positive coverage</li>
                  </ul>
                  <p className="text-red-600 mt-3">✗ Low Score (&lt;20):</p>
                  <ul className="text-gray-600 ml-4 space-y-1">
                    <li>• Claims "Clean Water"</li>
                    <li>• News: "Pollution Fines"</li>
                    <li>• Major contradictions</li>
                  </ul>
                </div>
              </div>

              <div className="border-2 border-purple-200 rounded-2xl p-6 bg-purple-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Verification (V)</h3>
                    <p className="text-purple-600 text-sm font-semibold">Weight: 25%</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Checks for third-party certifications.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-emerald-700">✓ High Score:</p>
                  <ul className="text-gray-600 ml-4 space-y-1">
                    <li>• ISO 14001</li>
                    <li>• B-Corp Certified</li>
                    <li>• SBTi Approved</li>
                    <li>• LEED, CDP</li>
                  </ul>
                  <p className="text-red-600 mt-3">✗ Low Score:</p>
                  <ul className="text-gray-600 ml-4 space-y-1">
                    <li>• No certifications</li>
                    <li>• Self-assessments only</li>
                    <li>• Unverified claims</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Traffic Light System */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Risk Classification</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="font-bold text-red-600">RED</h3>
                  <p className="text-gray-500 text-sm">Score &lt; 40</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                <strong>High Risk - Likely Greenwashing</strong><br />
                Significant contradictions found. Requires immediate investigation 
                and potential regulatory action.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-amber-500">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
                <div>
                  <h3 className="font-bold text-amber-600">YELLOW</h3>
                  <p className="text-gray-500 text-sm">Score 40-74</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                <strong>Medium Risk - Needs Investigation</strong><br />
                Some concerns identified. Company should improve transparency 
                and provide more specific data.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-emerald-500">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
                <div>
                  <h3 className="font-bold text-emerald-600">GREEN</h3>
                  <p className="text-gray-500 text-sm">Score ≥ 75</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                <strong>Low Risk - Appears Transparent</strong><br />
                Claims are well-supported with data and certifications. 
                No major contradictions found.
              </p>
            </div>
          </div>
        </section>

        {/* User Types */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Who Uses This?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Government Admin</h3>
                  <p className="text-gray-500 text-sm">Regulatory Officials</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Full audit access with contradiction detection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Confidential admin briefs on legal risks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  View all company reports and data
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Assign/deduct green credits
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Industry Partner</h3>
                  <p className="text-gray-500 text-sm">Companies & Corporations</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Upload sustainability reports for audit
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Get trust scores and improvement feedback
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Track report history and progress
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  View assigned green credits
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Technology Stack</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-cyan-600 font-bold">⚛️</span>
                </div>
                <p className="font-medium text-gray-900">React</p>
                <p className="text-xs text-gray-500">Frontend</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">🚀</span>
                </div>
                <p className="font-medium text-gray-900">FastAPI</p>
                <p className="text-xs text-gray-500">Backend</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-emerald-600 font-bold">🍃</span>
                </div>
                <p className="font-medium text-gray-900">MongoDB</p>
                <p className="text-xs text-gray-500">Database</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">🤖</span>
                </div>
                <p className="font-medium text-gray-900">GPT-4o</p>
                <p className="text-xs text-gray-500">AI Engine</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm">
          <p>© 2026 GreenWash Detector. Built for transparent sustainability reporting.</p>
        </footer>
      </main>
    </div>
  );
}
