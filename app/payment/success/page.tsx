import { Suspense } from 'react';
import PaymentSuccessContent from './page-content';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Success/Error Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-12 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-green-50 text-lg">
              Thank you for your payment
            </p>
          </div>

          {/* Payment Details */}
          <div className="px-8 py-12">
            <Suspense fallback={
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
            }>
              <PaymentSuccessContent />
            </Suspense>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Need help? Contact us at <span className="font-semibold text-gray-700">support@encogix.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}