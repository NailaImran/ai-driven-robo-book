---
id: quiz
title: Chapter Quiz
sidebar_position: 11
keywords: [quiz, assessment, test, questions, physical-ai]
---

# Chapter 1 Quiz

Test your understanding of Physical AI fundamentals and lab setup considerations.

## Multiple Choice Questions

### Question 1
What is the primary difference between traditional AI and Physical AI?

A) Physical AI uses more computational power
B) Physical AI interacts with the physical world through sensors and actuators
C) Physical AI is more expensive to develop
D) Physical AI only works with computer vision

<details>
<summary>Answer</summary>
**B) Physical AI interacts with the physical world through sensors and actuators**

Physical AI is characterized by its embodiment - the integration of AI with physical systems that can perceive and act in the real world.
</details>

---

### Question 2
What does "embodied intelligence" emphasize?

A) The size of the robot
B) The role of physical embodiment in cognition
C) The weight of computing hardware
D) The number of sensors used

<details>
<summary>Answer</summary>
**B) The role of physical embodiment in cognition**

Embodied intelligence recognizes that intelligence emerges from the interaction between an agent's body, brain, and environment.
</details>

---

### Question 3
For a 3-year robotics project, which setup is typically more cost-effective?

A) Cloud-only solution
B) On-premise hardware
C) Hybrid cloud
D) They cost the same

<details>
<summary>Answer</summary>
**B) On-premise hardware**

The break-even point is around 20-22 months. For projects lasting 2+ years, on-premise hardware becomes more economical despite higher upfront costs.
</details>

---

### Question 4
What is the approximate break-even point between on-premise and cloud computing for robotics projects?

A) 6-8 months
B) 12-15 months
C) 20-22 months
D) 36+ months

<details>
<summary>Answer</summary>
**C) 20-22 months**

Based on the cost analysis in the lab setup guide, on-premise solutions break even with cloud solutions at around 20-22 months.
</details>

---

### Question 5
What is CapEx in the context of robotics lab setup?

A) Monthly cloud computing costs
B) Upfront costs for hardware purchases
C) Electricity bills
D) Software subscription fees

<details>
<summary>Answer</summary>
**B) Upfront costs for hardware purchases**

CapEx (Capital Expenditure) refers to one-time investments in equipment and hardware that provide long-term value.
</details>

---

## True or False

### Question 6
Edge computing means processing data on the robot itself rather than in the cloud.

<details>
<summary>Answer</summary>
**True**

Edge computing refers to computation that occurs at or near the source of data generation, reducing latency and dependency on network connectivity.
</details>

---

### Question 7
A servo motor is only used for linear motion.

<details>
<summary>Answer</summary>
**False**

Servo motors are rotary actuators used for precise control of angular position, velocity, and acceleration.
</details>

---

## Short Answer Questions

### Question 8
List three key sensors commonly used in physical AI systems and their purposes.

<details>
<summary>Sample Answer</summary>
1. **Camera/Vision Sensor**: Captures visual information for computer vision tasks
2. **IMU (Inertial Measurement Unit)**: Measures motion, orientation, and acceleration
3. **Distance/Depth Sensor (e.g., LiDAR, RealSense)**: Measures distances to objects for navigation and obstacle avoidance
</details>

---

### Question 9
Explain the difference between CapEx and OpEx in the context of setting up a robotics lab.

<details>
<summary>Sample Answer</summary>
**CapEx (Capital Expenditure)**: One-time upfront costs for purchasing hardware like computers, robots, sensors, and actuators. These provide long-term value.

**OpEx (Operating Expenditure)**: Recurring costs such as cloud computing fees, electricity, internet, software subscriptions, and maintenance. These are ongoing monthly or annual expenses.
</details>

---

### Question 10
What are the advantages and disadvantages of starting with cloud-based computing vs. on-premise hardware for a student robotics project?

<details>
<summary>Sample Answer</summary>
**Cloud Advantages**:
- Low upfront cost
- Scalable resources
- No hardware maintenance
- Good for short-term projects (&lt;1 year)

**Cloud Disadvantages**:
- Recurring monthly costs
- Requires internet connectivity
- Higher long-term cost for extended projects
- Latency issues for real-time control

**On-Premise Advantages**:
- Cost-effective for long-term projects (2+ years)
- Low latency for real-time control
- No ongoing subscription fees
- Full control over hardware

**On-Premise Disadvantages**:
- High upfront investment
- Hardware maintenance responsibility
- Limited scalability without additional investment
</details>

---

## Reflection Questions

### Question 11
Consider a robot that needs to navigate autonomously in a warehouse. What types of sensors would you prioritize and why?

<details>
<summary>Discussion Points</summary>
Key considerations:
- **LiDAR/Depth sensors**: For precise distance measurement and obstacle detection
- **Cameras**: For visual recognition of objects, QR codes, or markers
- **IMU**: For tracking movement and orientation
- **Wheel encoders**: For precise motion control
- **Proximity sensors**: For close-range obstacle avoidance

The priority depends on the specific requirements: navigation accuracy, object recognition needs, safety requirements, and budget constraints.
</details>

---

### Question 12
How does the concept of "embodied intelligence" change the way we approach AI development compared to purely software-based AI?

<details>
<summary>Discussion Points</summary>
Embodied intelligence requires:
- Consideration of physical constraints and dynamics
- Real-time processing for sensor-motor loops
- Robustness to environmental uncertainty
- Integration of perception and action
- Learning from physical interaction
- Safety and reliability in the real world

This contrasts with software AI which operates in controlled, digital environments without physical consequences.
</details>

---

## Score Your Knowledge

- **0-4 correct**: Review the chapter material and focus on fundamental concepts
- **5-7 correct**: Good foundation, review areas where you struggled
- **8-10 correct**: Strong understanding of the basics
- **11-12 correct**: Excellent comprehension, ready to move forward

Remember: Understanding these fundamentals is crucial for succeeding in Physical AI development!
