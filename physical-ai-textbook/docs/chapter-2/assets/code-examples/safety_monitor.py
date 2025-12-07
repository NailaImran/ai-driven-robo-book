#!/usr/bin/env python3
"""
Safety Monitoring System for Bipedal Robots

Detects dangerous conditions and triggers emergency stop.
From Lesson 2.3: Control Theory for Bipedal Locomotion
"""

import numpy as np
from enum import Enum
from dataclasses import dataclass, field
from typing import Callable


class SafetyLevel(Enum):
    """Robot safety state"""
    SAFE = 0          # All systems normal
    WARNING = 1       # Approaching limits, close monitoring
    CRITICAL = 2      # Imminent danger, prepare to stop
    EMERGENCY = 3     # Immediate shutdown required


@dataclass
class SafetyThresholds:
    """Safety limits for robot operation"""
    # Balance thresholds
    max_pitch_angle: float = 0.35  # radians (~20 degrees)
    max_roll_angle: float = 0.30
    max_pitch_rate: float = 1.0    # rad/s
    max_roll_rate: float = 0.8

    # Force/torque thresholds
    max_joint_torque: float = 150.0  # NÅm
    max_motor_current: float = 50.0  # Amps

    # Temperature thresholds
    max_motor_temp: float = 80.0     # Celsius
    max_battery_temp: float = 60.0

    # Power thresholds
    min_battery_voltage: float = 22.0  # Volts (for 24V system)
    min_battery_charge: float = 0.10   # 10% remaining

    # Communication thresholds
    max_command_timeout: float = 0.5   # seconds
    min_imu_update_rate: float = 100.0  # Hz


@dataclass
class RobotState:
    """Complete robot state snapshot"""
    # Balance
    pitch: float = 0.0
    roll: float = 0.0
    pitch_rate: float = 0.0
    roll_rate: float = 0.0

    # Joints (example for 6 joints)
    joint_torques: list = field(default_factory=lambda: [0.0] * 6)
    joint_currents: list = field(default_factory=lambda: [0.0] * 6)
    joint_temps: list = field(default_factory=lambda: [0.0] * 6)

    # Power
    battery_voltage: float = 24.0
    battery_charge: float = 1.0
    battery_temp: float = 25.0

    # Communication
    last_command_time: float = 0.0
    imu_update_rate: float = 100.0

    # Timestamp
    timestamp: float = 0.0


class SafetyMonitor:
    """Monitor robot state and enforce safety constraints"""

    def __init__(self, thresholds: SafetyThresholds = None, callback: Callable = None):
        """
        Args:
            thresholds: Safety limits
            callback: Optional callback function for events:
                callback('warning', reason)
                callback('critical', reason)
                callback('emergency_stop', reason)
        """
        self.thresholds = thresholds or SafetyThresholds()
        self.callback = callback
        self.current_level = SafetyLevel.SAFE
        self.violation_history = []

    def check_safety(self, state: RobotState) -> SafetyLevel:
        """
        Perform comprehensive safety check

        Returns:
            Current safety level and triggers appropriate callbacks
        """
        violations = []

        # Balance checks
        balance_level = self._check_balance(state, violations)

        # Joint/torque checks
        torque_level = self._check_joint_limits(state, violations)

        # Temperature checks
        temp_level = self._check_temperatures(state, violations)

        # Power checks
        power_level = self._check_power(state, violations)

        # Communication checks
        comm_level = self._check_communication(state, violations)

        # Determine overall safety level (worst case)
        safety_level = max([balance_level, torque_level, temp_level, power_level, comm_level])
        self.current_level = safety_level

        # Trigger callbacks
        if safety_level == SafetyLevel.WARNING and self.callback:
            for violation in violations:
                self.callback('warning', violation)

        elif safety_level == SafetyLevel.CRITICAL and self.callback:
            for violation in violations:
                self.callback('critical', violation)

        elif safety_level == SafetyLevel.EMERGENCY and self.callback:
            self.callback('emergency_stop', f'Multiple critical violations: {violations}')

        # Log violation
        if violations:
            self.violation_history.append({
                'timestamp': state.timestamp,
                'level': safety_level,
                'violations': violations
            })

        return safety_level

    def _check_balance(self, state: RobotState, violations: list) -> SafetyLevel:
        """Check body balance angles and rates"""
        level = SafetyLevel.SAFE

        # Extreme angles = emergency
        if abs(state.pitch) > self.thresholds.max_pitch_angle * 1.2:
            violations.append(f'Extreme pitch: {np.degrees(state.pitch):.1f}°')
            level = SafetyLevel.EMERGENCY

        elif abs(state.pitch) > self.thresholds.max_pitch_angle:
            violations.append(f'High pitch: {np.degrees(state.pitch):.1f}°')
            level = max(level, SafetyLevel.CRITICAL)

        elif abs(state.pitch) > self.thresholds.max_pitch_angle * 0.7:
            violations.append(f'Pitch approaching limit: {np.degrees(state.pitch):.1f}°')
            level = max(level, SafetyLevel.WARNING)

        # Similar for roll
        if abs(state.roll) > self.thresholds.max_roll_angle * 1.2:
            violations.append(f'Extreme roll: {np.degrees(state.roll):.1f}°')
            level = SafetyLevel.EMERGENCY

        elif abs(state.roll) > self.thresholds.max_roll_angle:
            violations.append(f'High roll: {np.degrees(state.roll):.1f}°')
            level = max(level, SafetyLevel.CRITICAL)

        # High angular velocity
        if abs(state.pitch_rate) > self.thresholds.max_pitch_rate * 1.5:
            violations.append(f'Extreme pitch rate: {state.pitch_rate:.2f} rad/s')
            level = SafetyLevel.EMERGENCY

        elif abs(state.pitch_rate) > self.thresholds.max_pitch_rate:
            violations.append(f'High pitch rate: {state.pitch_rate:.2f} rad/s')
            level = max(level, SafetyLevel.CRITICAL)

        return level

    def _check_joint_limits(self, state: RobotState, violations: list) -> SafetyLevel:
        """Check joint torques and currents"""
        level = SafetyLevel.SAFE

        for i, torque in enumerate(state.joint_torques):
            if abs(torque) > self.thresholds.max_joint_torque * 1.1:
                violations.append(f'Extreme torque on joint {i}: {torque:.1f} NÅm')
                level = SafetyLevel.EMERGENCY

            elif abs(torque) > self.thresholds.max_joint_torque:
                violations.append(f'High torque on joint {i}: {torque:.1f} NÅm')
                level = max(level, SafetyLevel.CRITICAL)

        for i, current in enumerate(state.joint_currents):
            if current > self.thresholds.max_motor_current:
                violations.append(f'High current on motor {i}: {current:.1f} A')
                level = max(level, SafetyLevel.WARNING)

        return level

    def _check_temperatures(self, state: RobotState, violations: list) -> SafetyLevel:
        """Check motor and battery temperatures"""
        level = SafetyLevel.SAFE

        for i, temp in enumerate(state.joint_temps):
            if temp > self.thresholds.max_motor_temp + 10:
                violations.append(f'Critical motor {i} temperature: {temp:.1f}°C')
                level = SafetyLevel.EMERGENCY

            elif temp > self.thresholds.max_motor_temp:
                violations.append(f'High motor {i} temperature: {temp:.1f}°C')
                level = max(level, SafetyLevel.WARNING)

        if state.battery_temp > self.thresholds.max_battery_temp:
            violations.append(f'High battery temperature: {state.battery_temp:.1f}°C')
            level = max(level, SafetyLevel.WARNING)

        return level

    def _check_power(self, state: RobotState, violations: list) -> SafetyLevel:
        """Check battery voltage and charge"""
        level = SafetyLevel.SAFE

        if state.battery_voltage < self.thresholds.min_battery_voltage:
            violations.append(f'Low battery voltage: {state.battery_voltage:.1f} V')
            level = SafetyLevel.CRITICAL

        if state.battery_charge < self.thresholds.min_battery_charge:
            violations.append(f'Low battery charge: {state.battery_charge:.1%}')
            level = max(level, SafetyLevel.CRITICAL)

        if state.battery_charge < 0.20:
            violations.append(f'Battery below 20%: {state.battery_charge:.1%}')
            level = max(level, SafetyLevel.WARNING)

        return level

    def _check_communication(self, state: RobotState, violations: list) -> SafetyLevel:
        """Check communication and sensor health"""
        level = SafetyLevel.SAFE

        # Command timeout
        if state.last_command_time > self.thresholds.max_command_timeout:
            violations.append(f'Command timeout: {state.last_command_time:.2f} s')
            level = SafetyLevel.CRITICAL

        # IMU update rate
        if state.imu_update_rate < self.thresholds.min_imu_update_rate * 0.8:
            violations.append(f'Low IMU update rate: {state.imu_update_rate:.1f} Hz')
            level = max(level, SafetyLevel.WARNING)

        return level

    def get_status_report(self) -> dict:
        """Get detailed safety status"""
        return {
            'current_level': self.current_level.name,
            'violation_count': len(self.violation_history),
            'recent_violations': self.violation_history[-5:] if self.violation_history else []
        }


class EmergencyStop:
    """Emergency stop handler"""

    def __init__(self):
        self.is_active = False
        self.reason = None
        self.triggered_at = None

    def trigger(self, reason: str, timestamp: float):
        """Activate emergency stop"""
        self.is_active = True
        self.reason = reason
        self.triggered_at = timestamp
        print(f"[EMERGENCY STOP] {reason} at t={timestamp:.3f}s")

    def reset(self):
        """Reset emergency stop (after clearing hazard)"""
        self.is_active = False
        self.reason = None
        self.triggered_at = None


if __name__ == '__main__':
    print("=== Safety Monitoring System Test ===\n")

    # Create safety monitor with custom thresholds
    thresholds = SafetyThresholds()
    estop = EmergencyStop()

    def on_safety_event(event_type: str, reason: str):
        print(f"[{event_type.upper()}] {reason}")
        if event_type == 'emergency_stop':
            estop.trigger(reason, timestamp=0.0)

    monitor = SafetyMonitor(thresholds, callback=on_safety_event)

    # Scenario 1: Normal operation
    print("Scenario 1: Normal operation")
    state = RobotState(
        pitch=0.1,
        roll=0.05,
        pitch_rate=0.2,
        roll_rate=0.1,
        battery_voltage=24.0,
        battery_charge=0.85
    )
    level = monitor.check_safety(state)
    print(f"Safety Level: {level.name}\n")

    # Scenario 2: Warning conditions
    print("Scenario 2: Approaching pitch limit")
    state.pitch = 0.24  # 70% of max
    level = monitor.check_safety(state)
    print(f"Safety Level: {level.name}\n")

    # Scenario 3: Critical condition
    print("Scenario 3: Excessive pitch angle")
    state.pitch = 0.40  # Exceeds limit
    level = monitor.check_safety(state)
    print(f"Safety Level: {level.name}\n")

    # Scenario 4: Multiple violations
    print("Scenario 4: Multiple critical violations")
    state.pitch = 0.45
    state.roll = 0.35
    state.battery_voltage = 20.0
    level = monitor.check_safety(state)
    print(f"Safety Level: {level.name}\n")

    # Report
    print("Status Report:")
    report = monitor.get_status_report()
    print(f"  Current Level: {report['current_level']}")
    print(f"  Total Violations: {report['violation_count']}")

    print("\n Safety monitoring test complete!")
