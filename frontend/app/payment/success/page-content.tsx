'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [details, setDetails] = useState({
    payment_id: '',
    order_id: '',
    amount: '',
    status: 'success',
  });

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const orderId = searchParams.get('order_id');
    const amount = searchParams.get('amount');
    const status = searchParams.get('status') || 'success';

    setDetails({
      payment_id: paymentId || '',
      order_id: orderId || '',
      amount: amount || '0',
      status: status as 'success' | 'failed',
    });
  }, [searchParams]);

  const isSuccess = details.status === 'success';
  const formattedAmount = parseFloat(details.amount || '0').toFixed(2);

  return (
    <>
      {isSuccess ? (
        <div className="space-y-8">
          {/* Amount Section */}
          <div className="text-center border-b border-gray-200 pb-8">
            <p className="text-gray-600 text-sm mb-2">Amount Paid</p>
            <div className="text-5xl font-bold text-gray-900">
              ₹{formattedAmount}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-600 text-sm mb-2">Payment ID</p>
              <p className="text-gray-900 font-mono text-sm break-all">{details.payment_id}</p>
              <button
                onClick={() => navigator.clipboard.writeText(details.payment_id)}
                className="mt-3 text-blue-600 hover:text-blue-700 text-xs font-medium"
              >
                Copy to clipboard
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-600 text-sm mb-2">Order ID</p>
              <p className="text-gray-900 font-mono text-sm break-all">{details.order_id}</p>
              <button
                onClick={() => navigator.clipboard.writeText(details.order_id)}
                className="mt-3 text-blue-600 hover:text-blue-700 text-xs font-medium"
              >
                Copy to clipboard
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center space-x-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-green-900 font-semibold">Payment Processed</p>
              <p className="text-green-700 text-sm">Your payment has been successfully processed and your order is confirmed.</p>
            </div>
          </div>

          {/* Receipt Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-blue-900 text-sm mb-2">📧 Receipt</p>
            <p className="text-blue-700 text-sm">A detailed receipt has been sent to your email. Please keep it for your records.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-center transition-all duration-200 transform hover:scale-[1.02]"
            >
              Back to Home
            </Link>
            <button
              onClick={() => {
                const paymentDetails = `Payment ID: ${details.payment_id}\nOrder ID: ${details.order_id}\nAmount: ₹${formattedAmount}`;
                const element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(paymentDetails));
                element.setAttribute('download', 'payment_receipt.txt');
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Download Receipt
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <p className="text-gray-600 text-lg">Your payment could not be processed. Please try again.</p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm">If the problem persists, please contact our support team.</p>
          </div>
          <Link
            href="/payment"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200"
          >
            Try Again
          </Link>
        </div>
      )}
    </>
  );
}