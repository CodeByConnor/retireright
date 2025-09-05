import { NextRequest, NextResponse } from 'next/server';
import { calculateContributions } from '@/lib/rules/engine';
import { CalculationError } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Perform calculation
    const result = calculateContributions(body);
    
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Calculation error:', error);
    
    if (error instanceof CalculationError) {
      return NextResponse.json({
        success: false,
        error: {
          code: error.code,
          message: error.message
        }
      }, { status: 400 });
    }
    
    // Generic error response
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred during calculation'
      }
    }, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({
    success: false,
    error: {
      code: 'METHOD_NOT_ALLOWED',
      message: 'Only POST requests are supported'
    }
  }, { status: 405 });
}
