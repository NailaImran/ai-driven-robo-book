/**
 * Unit conversion utilities for robotics
 *
 * Includes conversions for:
 * - Length (meters, centimeters, millimeters, inches, feet)
 * - Mass (kg, grams, pounds)
 * - Angles (radians, degrees)
 * - Velocity (m/s, km/h, mph)
 * - Force (Newtons, pounds-force)
 * - Torque (Nm, lb-ft)
 *
 * Implementation: T014 (Phase 2: Foundational Components)
 */

// ====================
// Length Conversions
// ====================

export const metersToMillimeters = (meters: number): number => meters * 1000;
export const millimetersToMeters = (millimeters: number): number => millimeters / 1000;

export const metersToCentimeters = (meters: number): number => meters * 100;
export const centimetersToMeters = (centimeters: number): number => centimeters / 100;

export const metersToInches = (meters: number): number => meters * 39.3701;
export const inchesToMeters = (inches: number): number => inches / 39.3701;

export const metersToFeet = (meters: number): number => meters * 3.28084;
export const feetToMeters = (feet: number): number => feet / 3.28084;

// ====================
// Mass Conversions
// ====================

export const kilogramsToGrams = (kg: number): number => kg * 1000;
export const gramsToKilograms = (grams: number): number => grams / 1000;

export const kilogramsToPounds = (kg: number): number => kg * 2.20462;
export const poundsToKilograms = (pounds: number): number => pounds / 2.20462;

// ====================
// Angle Conversions
// ====================

export const radiansToDegrees = (radians: number): number => (radians * 180) / Math.PI;
export const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180;

// ====================
// Velocity Conversions
// ====================

export const metersPerSecondToKilometersPerHour = (mps: number): number => mps * 3.6;
export const kilometersPerHourToMetersPerSecond = (kph: number): number => kph / 3.6;

export const metersPerSecondToMilesPerHour = (mps: number): number => mps * 2.23694;
export const milesPerHourToMetersPerSecond = (mph: number): number => mph / 2.23694;

// ====================
// Angular Velocity Conversions
// ====================

export const radiansPerSecondToRPM = (radPerSec: number): number => (radPerSec * 60) / (2 * Math.PI);
export const rpmToRadiansPerSecond = (rpm: number): number => (rpm * 2 * Math.PI) / 60;

export const degreesPerSecondToRPM = (degPerSec: number): number => (degPerSec * 60) / 360;
export const rpmToDegreesPerSecond = (rpm: number): number => (rpm * 360) / 60;

// ====================
// Force Conversions
// ====================

export const newtonsToPoundsForce = (newtons: number): number => newtons * 0.224809;
export const poundsForceToNewtons = (lbf: number): number => lbf / 0.224809;

// ====================
// Torque Conversions
// ====================

export const newtonMetersToPoundFeet = (nm: number): number => nm * 0.737562;
export const poundFeetToNewtonMeters = (lbft: number): number => lbft / 0.737562;

export const newtonMetersToNewtonMillimeters = (nm: number): number => nm * 1000;
export const newtonMillimetersToNewtonMeters = (nmm: number): number => nmm / 1000;

// ====================
// Power Conversions
// ====================

export const wattsToHorsepower = (watts: number): number => watts / 745.7;
export const horsepowerToWatts = (hp: number): number => hp * 745.7;

// ====================
// Pressure Conversions
// ====================

export const pascalsToPSI = (pascals: number): number => pascals / 6894.76;
export const psiToPascals = (psi: number): number => psi * 6894.76;

export const pascalsToBar = (pascals: number): number => pascals / 100000;
export const barToPascals = (bar: number): number => bar * 100000;

// ====================
// Temperature Conversions
// ====================

export const celsiusToFahrenheit = (celsius: number): number => (celsius * 9) / 5 + 32;
export const fahrenheitToCelsius = (fahrenheit: number): number => ((fahrenheit - 32) * 5) / 9;

export const celsiusToKelvin = (celsius: number): number => celsius + 273.15;
export const kelvinToCelsius = (kelvin: number): number => kelvin - 273.15;

// ====================
// Inertia Conversions
// ====================

export const kgMeterSquaredToGramMillimeterSquared = (kgm2: number): number => kgm2 * 1e9;
export const gramMillimeterSquaredToKgMeterSquared = (gmm2: number): number => gmm2 / 1e9;

// ====================
// Electrical Conversions
// ====================

export const wattsToMilliwatts = (watts: number): number => watts * 1000;
export const milliwattsToWatts = (milliwatts: number): number => milliwatts / 1000;

export const ampsToMilliamps = (amps: number): number => amps * 1000;
export const milliampsToAmps = (milliamps: number): number => milliamps / 1000;

// ====================
// Data Rate Conversions
// ====================

export const bytesPerSecondToMegabytesPerSecond = (bps: number): number => bps / 1_000_000;
export const megabytesPerSecondToBytesPerSecond = (mbps: number): number => mbps * 1_000_000;

export const bytesPerSecondToGigabytesPerSecond = (bps: number): number => bps / 1_000_000_000;
export const gigabytesPerSecondToBytesPerSecond = (gbps: number): number => gbps * 1_000_000_000;

// ====================
// Time Conversions
// ====================

export const secondsToMilliseconds = (seconds: number): number => seconds * 1000;
export const millisecondsToSeconds = (milliseconds: number): number => milliseconds / 1000;

export const secondsToMicroseconds = (seconds: number): number => seconds * 1_000_000;
export const microsecondsToSeconds = (microseconds: number): number => microseconds / 1_000_000;

export const secondsToMinutes = (seconds: number): number => seconds / 60;
export const minutesToSeconds = (minutes: number): number => minutes * 60;

export const secondsToHours = (seconds: number): number => seconds / 3600;
export const hoursToSeconds = (hours: number): number => hours * 3600;

// ====================
// Frequency Conversions
// ====================

export const hertzToKilohertz = (hz: number): number => hz / 1000;
export const kilohertzToHertz = (khz: number): number => khz * 1000;

export const hertzToMegahertz = (hz: number): number => hz / 1_000_000;
export const megahertzToHertz = (mhz: number): number => mhz * 1_000_000;

// ====================
// Utility Functions
// ====================

/**
 * Format number with specified decimal places
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

/**
 * Round to specified significant figures
 */
export const roundToSignificantFigures = (value: number, sigFigs: number): number => {
  if (value === 0) return 0;
  const magnitude = Math.floor(Math.log10(Math.abs(value)));
  const scale = Math.pow(10, sigFigs - magnitude - 1);
  return Math.round(value * scale) / scale;
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Linear interpolation between two values
 */
export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * clamp(t, 0, 1);
};

/**
 * Map value from one range to another
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};
