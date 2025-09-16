'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { 
  Shield, 
  Users, 
  FileText, 
  Heart, 
  AlertTriangle, 
  BarChart3, 
  Lock, 
  CheckCircle, 
  Clock, 
  Database,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Prison Management System...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Prison Management System</h1>
                <p className="text-sm text-gray-600">Secure • Efficient • Comprehensive</p>
              </div>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Login to System
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern Correctional
            <span className="block text-blue-600">Facility Management</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive digital solution for managing inmates, staff, visitors, medical records, 
            security incidents, and facility operations with advanced security and compliance features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              Access System
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">System Features</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for correctional facility administration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Inmate Management */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Inmate Management</h4>
              <p className="text-gray-600 mb-4">
                Complete prisoner registration, tracking, cell assignment, and comprehensive record management
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Digital intake process</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Cell allocation system</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Behavioral tracking</li>
              </ul>
            </div>

            {/* Staff Administration */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Staff Administration</h4>
              <p className="text-gray-600 mb-4">
                Employee management, scheduling, role-based access control, and performance tracking
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Role-based permissions</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Shift scheduling</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Performance metrics</li>
              </ul>
            </div>

            {/* Visitor Management */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Visitor Management</h4>
              <p className="text-gray-600 mb-4">
                Visitor registration, background checks, appointment scheduling, and visit supervision
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Background verification</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Visit scheduling</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Security screening</li>
              </ul>
            </div>

            {/* Medical Records */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Medical Records</h4>
              <p className="text-gray-600 mb-4">
                Healthcare management, appointment scheduling, medical history, and treatment tracking
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Digital health records</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Medication tracking</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Emergency protocols</li>
              </ul>
            </div>

            {/* Security & Incidents */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Security & Incidents</h4>
              <p className="text-gray-600 mb-4">
                Incident reporting, investigation tracking, emergency response, and security protocols
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Real-time incident reporting</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Investigation workflow</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Emergency alerts</li>
              </ul>
            </div>

            {/* Reports & Analytics */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Reports & Analytics</h4>
              <p className="text-gray-600 mb-4">
                Comprehensive reporting, data analytics, compliance documentation, and performance metrics
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Automated reports</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Data visualization</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Export capabilities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Enterprise Security</h3>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Built with security-first architecture to protect sensitive correctional data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Role-Based Access</h4>
              <p className="text-gray-300">
                Granular permission system ensuring users only access authorized information
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Data Protection</h4>
              <p className="text-gray-300">
                Advanced encryption and secure data storage with comprehensive audit trails
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Compliance Ready</h4>
              <p className="text-gray-300">
                Built to meet correctional facility regulations and data protection standards
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h5 className="text-lg font-semibold">Prison Management System</h5>
                <p className="text-sm text-gray-400">Secure Correctional Facility Management</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2024 Prison Management System. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                For authorized personnel only
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
