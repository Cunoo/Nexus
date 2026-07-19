import React from 'react';
import Header from '../Header';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Reusable Header */}
            <Header />

            {/* Main Hero Content */}
            <main className="flex-1 max-w-6xl mx-auto px-6 py-16 flex flex-col items-center">
                
                {/* Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full mb-6">
                    Your All-in-One AI Workspace
                </span>

                {/* Main Heading */}
                <h2 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight text-center mb-6">
                    Smart AI Workplace <br />
                    <span className="text-blue-600">Tailored to Your Workflow</span>
                </h2>

                {/* Short Subtext */}
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl text-center mb-10 leading-relaxed">
                    Say goodbye to switching between tabs. Nexus AI brings summarization, web search, 
                    document management, and reporting into a single, modular dashboard.
                </p>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto mb-20">
                    <a
                        href="/login"
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm text-center transition-colors duration-200"
                    >
                        Enter Workspace
                    </a>
                    <a
                        href="#features"
                        className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm border border-gray-200 text-center transition-colors duration-200"
                    >
                        Explore Tools
                    </a>
                </div>

                {/* Features Dashboard Preview Grid */}
                <div id="features" className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Feature 1: Chatbot */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition-colors">
                        <div className="text-2xl mb-3">💬</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Chatbot</h3>
                        <p className="text-sm text-gray-600">
                            Context-aware AI assistant ready to brainstorm ideas, write text, or answer complex questions instantly.
                        </p>
                    </div>

                    {/* Feature 2: Summarization & Paraphrase */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition-colors">
                        <div className="text-2xl mb-3">📝</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Summarize & Paraphrase</h3>
                        <p className="text-sm text-gray-600">
                            Turn lengthy articles or messy notes into concise summaries and professionally rewritten content in seconds.
                        </p>
                    </div>

                    {/* Feature 3: Web Search */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition-colors">
                        <div className="text-2xl mb-3">🌐</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Real-Time Web Search</h3>
                        <p className="text-sm text-gray-600">
                            Search the live internet directly inside your dashboard to inject fresh facts and up-to-date data into your work.
                        </p>
                    </div>

                    {/* Feature 4: Document Upload */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition-colors">
                        <div className="text-2xl mb-3">📁</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Document Management</h3>
                        <p className="text-sm text-gray-600">
                            Upload PDFs, docs, or sheets. The AI reads them instantly, allowing you to extract data or query the files.
                        </p>
                    </div>

                    {/* Feature 5: Automated Reports */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition-colors">
                        <div className="text-2xl mb-3">📊</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Professional Reporting</h3>
                        <p className="text-sm text-gray-600">
                            Compile your findings, text summaries, and data inputs into beautifully structured reports ready to share.
                        </p>
                    </div>

                    {/* Feature 6: Modular Windows */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 bg-gradient-to-br from-blue-50 to-white">
                        <div className="text-2xl mb-3">🔲</div>
                        <h3 className="text-lg font-bold text-blue-600 mb-2">Custom Dashboard</h3>
                        <p className="text-sm text-gray-600">
                            Move, resize, and open multiple windows at the same time to create your perfect personalized environment.
                        </p>
                    </div>

                </div>
            </main>

            {/* Simple Footer */}
            <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500 bg-white">
                &copy; {new Date().getFullYear()} Nexus AI. All rights reserved.
            </footer>
        </div>
    );
};

export default HomePage;