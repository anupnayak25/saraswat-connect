# IV SEMESTER MAJOR PROJECT SYNOPSIS

## COVER PAGE

**Title of the Project:**

**SARASWATH CONNECT: AN INTEGRATED TRAVEL SERVICE, BOOKING AND TRIP PLANNING PLATFORM**

**Synopsis Submitted in Partial Fulfilment of the Requirements for the Award of the Degree of**

Bachelor of Engineering / Bachelor of Technology in **\*\*\*\***\_\_\_\_**\*\*\*\***

**Submitted by**

1. Name of Student 1 - USN: **\*\*\*\***\_\_\_\_**\*\*\*\***
2. Name of Student 2 - USN: **\*\*\*\***\_\_\_\_**\*\*\*\***
3. Name of Student 3 - USN: **\*\*\*\***\_\_\_\_**\*\*\*\***
4. Name of Student 4 - USN: **\*\*\*\***\_\_\_\_**\*\*\*\***

**Under the Guidance of**

Guide Name: **\*\*\*\***\_\_\_\_**\*\*\*\***

Designation: **\*\*\*\***\_\_\_\_**\*\*\*\***

Department of **\*\*\*\***\_\_\_\_**\*\*\*\***

College Name: **\*\*\*\***\_\_\_\_**\*\*\*\***

University Name: **\*\*\*\***\_\_\_\_**\*\*\*\***

Academic Year: 2025-2026

---

## FIRST PAGE

**Department of **\*\*\***\*\_\_\_\_\*\***\*\*\*\*\*\*

**Major Project Synopsis**

**Project Title:** Saraswath Connect: An Integrated Travel Service, Booking and Trip Planning Platform

**Submitted by:**

1. ***
2. ***
3. ***
4. ***

**Guide:** **\*\*\*\***\_\_\_\_**\*\*\*\***

**Project Domain:** Web Application Development / Full Stack Application / Smart Travel and Tourism Service Management

**Tools and Technologies Used:** Next.js, React, JavaScript, Supabase, SQL, Tailwind CSS, REST-style service
integration, Role-Based Authentication

**Organization / Institution:** **\*\*\*\***\_\_\_\_**\*\*\*\***

**Date of Submission:** **\*\*\*\***\_\_\_\_**\*\*\*\***

---

## TABLE OF CONTENTS

Abstract ........................................................................ i

Chapter 1 Introduction ......................................................... 1 1.1 Project Introduction
....................................................... 1 1.2 Problem Description
........................................................ 2 1.3 Need for the Project
....................................................... 3 1.4 Objectives of the Project
.................................................. 3 1.5 Scope of the Project
....................................................... 4 1.6 Methodology
............................................................... 5

Chapter 2 Literature Survey .................................................... 6 2.1 Introduction to Literature Survey
.......................................... 6 2.2 Study of Existing Online Booking Systems
................................... 6 2.3 Study of Tourism/Destination Management and Pilgrimage Support Systems ..... 7
2.4 Study of Route Planning and Recommendation Systems ......................... 8 2.5 Identified Research Gap
................................................... 9

Chapter 3 System Study ........................................................ 10 3.1 Existing System with Limitations
........................................... 10 3.2 Proposed System with Objectives
............................................ 11 3.3 Feasibility Studies
....................................................... 13

Chapter 4 System Analysis ..................................................... 15 4.1 Requirement Specifications (SRS)
........................................... 15 4.2 Functional Requirements
................................................... 16 4.3 Non-Functional Requirements
................................................ 18 4.4 Software and Hardware Requirements
......................................... 19

Chapter 5 System Design ....................................................... 21 5.1 Design Overview
........................................................... 21 5.2 Use Case Diagram
.......................................................... 22 5.3 Activity Diagram
.......................................................... 23 5.4 System Flowchart
.......................................................... 24 5.5 E-R Diagram
............................................................... 25 5.6 Data Flow Diagram (DFD)
................................................... 26 5.7 File / Database Design
.................................................... 27 5.8 Normalization
............................................................. 31 5.9 Input / Output Form Design
................................................ 32 5.10 Screen Design
............................................................ 34

Chapter 6 Reference ........................................................... 36

---

## ABSTRACT

Saraswath Connect is a web-based integrated platform designed to simplify travel planning and service booking. In many
tourism and trip-planning scenarios, travelers are required to use multiple disconnected channels for accommodation
booking, vehicle hiring, service reservations (for example, pooja/ritual services where applicable), tour package
selection, and local trip planning. This creates inconvenience, lack of transparency, duplication of effort, and poor
coordination between service providers and end users. The proposed system addresses this problem by bringing major trip
planning and booking services into a single digital platform.

The project is developed as a modern full-stack web application using Next.js and React for the front end, Supabase for
backend services, authentication, and database management, and SQL for structured relational data storage. The system
supports user registration and login, role-based access control, room booking, vehicle booking, service booking
(including pooja bookings where applicable), package management, contact management, and a step-by-step trip planner
that assists users in building customized itineraries. Separate administrative interfaces are provided to manage places,
services, rooms, packages, and booking records.

The application aims to improve accessibility, efficiency, transparency, and user convenience for travelers, trip
planners, administrators, and accommodation managers. It also introduces a modular structure that can be extended in
future with real-time availability, payment gateway integration, maps-based route optimization, notifications, and
analytics dashboards. The project demonstrates how digital technology can modernize tourism and service booking systems
through a unified workflow.

**Keywords:** Travel service management, tourism booking, booking platform, trip planner, Next.js, Supabase, role-based
authentication, web application.

---

# CHAPTER 1 INTRODUCTION

## 1.1 Project Introduction

Digital transformation has changed the way users access travel, hospitality, and service-based platforms. However, in
many tourism and multi-destination travel scenarios, users still rely on fragmented systems, manual inquiries, phone
calls, and third-party intermediaries. A traveler planning a multi-stop trip may need to separately arrange
accommodation, vehicle transport, service bookings (including event/ritual reservations where applicable), nearby place
visits, and package-based travel. Such fragmentation results in delay, uncertainty, and poor user experience.

Saraswath Connect is proposed as a unified web platform that combines travel bookings and trip planning into a single
system. The application provides a user-friendly interface where a visitor can browse services, search rooms, reserve
services (including poojas where applicable), select vehicles, view tour packages, and use a guided trip planner. In
addition, administrators are provided with dedicated dashboards to manage places, service listings, bookings, and
operational data.

The project has been built using modern web technologies. The front end is created with Next.js and React, enabling
component-based design and responsive user interaction. Supabase is used for authentication, role management, and
database services. The platform follows a modular architecture in which each major service area such as rooms, poojas,
vehicles, packages, and trip planning is organized as an independent functional module.

The system is intended for tourism/service providers, administrators, and users who want a simple and integrated booking
experience. It bridges the gap between multi-service travel planning needs and digital convenience.

## 1.2 Problem Description

In the current environment, travelers face multiple practical issues when planning destination visits or multi-stop
tours:

1. Room booking information is often unavailable in a centralized format.
2. Vehicle rental and local transport are handled separately from accommodation and pooja services.
3. Pooja reservation is frequently manual, resulting in long waiting times and uncertainty.
4. Tour packages and nearby place recommendations are not integrated with booking systems.
5. Service providers and administrators may not have a common dashboard to manage services and bookings efficiently.
6. Users must repeatedly enter information across different services, causing inconvenience and inconsistency.
7. Existing solutions rarely provide role-based access for multiple service stakeholders such as administrators and
   accommodation managers.

Because of these limitations, users experience confusion, time loss, and difficulty in making reliable decisions.
Organizations also face challenges in service coordination, record maintenance, and digital administration.

## 1.3 Need for the Project

There is a strong need for a centralized platform that can integrate major travel planning and booking services. Such a
system should:

1. Offer one place for room booking, vehicle booking, pooja booking, and package browsing.
2. Reduce dependency on manual coordination and repetitive user interaction.
3. Improve booking visibility and administrative control.
4. Support authenticated and role-based access for secure operations.
5. Provide a guided trip planning workflow for better itinerary management.
6. Store and retrieve data reliably using a structured database.
7. Improve service quality for both end users and service management teams.

## 1.4 Objectives of the Project

The main objectives of Saraswath Connect are:

1. To design and develop a responsive web-based platform for travel and tourism services.
2. To integrate room booking, vehicle booking, pooja reservation, package viewing, and trip planning into one system.
3. To provide secure user authentication and role-based authorization.
4. To create separate administration interfaces for operational management.
5. To maintain service and booking data in a normalized relational database.
6. To improve user convenience and reduce service fragmentation.
7. To create a scalable foundation for future enhancements such as real-time availability, online payments,
   notifications, and map-based optimization.

## 1.5 Scope of the Project

The scope of the project includes the following modules:

1. **User Module**
   - User registration and login
   - Browsing services and destinations
   - Booking rooms, vehicles, poojas, and packages
   - Trip planning support

2. **Service Booking Module**
   - Pooja listing and reservation
   - Place and package display
   - Service-related information

3. **Travel Support Module**
   - Vehicle booking
   - Destination selection
   - Route and recommendation assistance

4. **Accommodation Module**
   - Room listing
   - Search by location, guest count, and dates
   - Booking support

5. **Administration Module**
   - Management of places, poojas, rooms, packages, and bookings
   - Role-based admin access
   - Summary dashboard and operational monitoring

6. **Database and Security Module**
   - Structured relational schema
   - Authentication integration
   - Row-level access control

The current project scope is focused on prototype-level functional integration. Full-scale production deployment
features such as payment gateway integration, advanced analytics, real-time occupancy forecasting, and SMS/email alerts
are proposed as future enhancements.

## 1.6 Methodology

The development methodology followed for this project is modular and iterative. The overall process includes:

1. Requirement gathering based on the problems faced in tourism and multi-service booking workflows.
2. Analysis of functional modules and user roles.
3. Design of database schema and system architecture.
4. Front-end module development using reusable UI components.
5. Backend integration using Supabase authentication and database services.
6. Role-based access design for admin and user modules.
7. Testing of booking flows, navigation, and administrative operations.
8. Documentation of the proposed system and design artifacts.

**Fig. 1.1 Overall Development Methodology**

[MIRO PROMPT: Create a clean process flow diagram for a software project titled "Development Methodology of Saraswath
Connect" with the steps Requirement Gathering -> Problem Analysis -> Module Identification -> Database Design -> UI/UX
Design -> Frontend Development -> Backend Integration -> Role-Based Security Setup -> Testing -> Documentation -> Future
Enhancement Planning. Use academic colors, simple arrows, and a professional report style.]

---

# CHAPTER 2 LITERATURE SURVEY

## 2.1 Introduction to Literature Survey

The literature survey examines existing work in online booking systems, destination/service management applications,
tourism recommendation systems, and route planning platforms. The purpose of this chapter is to identify current
approaches, strengths, limitations, and research gaps relevant to the proposed project.

## 2.2 Study of Existing Online Booking Systems

Modern booking platforms in travel and hospitality domains provide modules for hotel reservation, transport scheduling,
and user authentication. These systems are typically designed for commercial tourism and urban travel use cases. They
focus heavily on pricing, seasonal offers, and customer convenience. While such platforms are efficient for mainstream
travel, they do not specifically address the domain-specific operational requirements of multi-service trip planning.

Common characteristics of existing booking systems include:

1. Centralized listing of services.
2. Search and filter support.
3. Reservation forms and transaction history.
4. User account management.
5. Admin dashboards for basic service control.

However, these platforms usually do not combine specialized service categories such as pooja booking (where applicable),
route planning, and managed accommodations within the same user experience.

## 2.3 Study of Tourism/Destination Management and Pilgrimage Support Systems

Tourism/destination management software generally concentrates on internal administration such as listing management,
event scheduling, customer records, or operational dashboards. Some systems support online ticketing or service
offerings, but many are limited in scope and not integrated with transport, nearby attractions, accommodation inventory,
or package planning.

Pilgrimage support systems proposed in research and practice show that travelers need:

1. Destination-oriented information.
2. Service availability visibility.
3. Better planning assistance.
4. Reduced manual dependency.
5. Mobile and web accessibility.

Yet, most existing implementations treat each service independently. This creates a fragmented digital journey.

## 2.4 Study of Route Planning and Recommendation Systems

Route planning systems in tourism applications commonly rely on map services, geolocation, and preference-based
recommendations. They help users choose optimal travel paths, estimate cost, and discover nearby attractions. In the
context of multi-destination travel, route planning can significantly improve the trip experience by organizing
destination visits, nearby stay options, restaurants, and travel agencies.

Recommendation systems in related domains often use:

1. User preferences.
2. Location data.
3. Historical popularity.
4. Distance and travel time.
5. Cost optimization.

The proposed project borrows this conceptual foundation and adapts it to trip planning. In the current prototype, route
optimization and recommendations are represented in a structured workflow with extensibility for external map service
integration.

## 2.5 Identified Research Gap

Based on the study of existing systems, the following gaps are identified:

1. Lack of integrated platforms specifically designed for end-to-end trip planning with multiple service bookings.
2. Limited support for combining pooja, room, vehicle, and package booking in one application.
3. Inadequate role-based administration for multiple stakeholders such as administrators and accommodation managers.
4. Poor support for personalized trip planning.
5. Limited visibility of interrelated service data such as places, rooms, vehicles, poojas, and packages.

Saraswath Connect addresses these gaps by proposing a unified solution with modular service integration, secure user
management, and expansion-ready architecture.

**Table 2.1 Comparative View of Related Systems**

1. Generic hotel booking systems - Strong in accommodation booking, weak in pooja and pilgrimage planning.
2. Destination management systems - Strong in listing/control, weak in integrated booking support.
3. Travel itinerary planners - Strong in route planning, weak in integrated multi-service booking.
4. Saraswath Connect - Integrates service bookings, travel support, booking flows, and admin control in a single
   platform.

**Fig. 2.1 Comparative Positioning of the Proposed System**

[MIRO PROMPT: Create an academic comparison diagram titled "Comparative Positioning of Saraswath Connect" with four
columns: Generic Hotel Booking Systems, Destination Management Systems, Travel Itinerary Planners, and Saraswath
Connect. Compare features such as room booking, vehicle booking, pooja reservation, package management, trip planner,
role-based admin, and unified database. Highlight Saraswath Connect as the only system covering all features.]

---

# CHAPTER 3 SYSTEM STUDY

## 3.1 Existing System with Limitations

The existing process for trip planning and service access is mostly fragmented. Users typically depend on separate
sources for each service:

1. Room booking through offline inquiry or local office contact.
2. Vehicle arrangement through travel agents or informal contacts.
3. Service reservations (including pooja bookings where applicable) through service counters or individual
   communication.
4. Package details through brochures, local agents, or social media communication.
5. Travel planning through personal research rather than guided digital systems.

### 3.1.1 Limitations of the Existing System

1. No centralized platform for multiple services.
2. Manual management of bookings increases chances of human error.
3. Service information may not be updated consistently.
4. Lack of authenticated user records and booking history.
5. Poor coordination between service modules and travel support.
6. Difficulty in monitoring operations from an administrative perspective.
7. Limited scalability and poor reporting support.

## 3.2 Proposed System with Objectives

The proposed system is Saraswath Connect, a centralized web application that integrates service booking and trip
planning support. The platform allows users to browse and reserve services from one interface and enables administrators
to manage operational data through dedicated dashboards.

### 3.2.1 Core Features of the Proposed System

1. User registration and login.
2. Role-based access control for normal users, admins, and hotel admins.
3. Room booking interface.
4. Vehicle booking interface.
5. Pooja booking interface.
6. Tour package browsing and administration.
7. Trip planner with multi-step workflow.
8. Place management, booking visibility, and contact support.
9. Structured relational database with secure backend policies.

### 3.2.2 Advantages of the Proposed System

1. Unified access to related travel planning and booking services.
2. Better user experience through guided workflow and responsive interface.
3. Reduced manual effort for service and travel administrators.
4. Improved data consistency and maintainability.
5. Better extensibility for future modules.
6. Enhanced security through authenticated and role-restricted operations.

**Fig. 3.1 Existing System vs Proposed System**

[MIRO PROMPT: Create a side-by-side problem-solution diagram titled "Existing System vs Proposed System for Saraswath
Connect". On the left show fragmented services: manual pooja booking, separate room booking, independent vehicle
arrangement, scattered package details, no unified planning. On the right show integrated modules: unified booking
portal, trip planner, admin dashboard, role-based authentication, centralized database. Use professional academic
styling.]

## 3.3 Feasibility Studies

Feasibility analysis determines whether the project is practical from technical, economic, operational, and schedule
perspectives.

### 3.3.1 Technical Feasibility

The project is technically feasible because the selected technology stack is suitable for developing scalable web
applications.

1. Next.js provides a structured framework for modern web development.
2. React supports reusable components and state-driven UI.
3. Supabase offers authentication, relational data handling, and access control.
4. SQL supports normalized and query-efficient data structures.
5. The modular architecture allows incremental development.

### 3.3.2 Economic Feasibility

The project is economically feasible because it can be built using widely available development tools and cloud-based
backend services.

1. No specialized proprietary enterprise software is required for the prototype.
2. Open-source technologies reduce initial development cost.
3. Cloud backend services lower infrastructure setup effort.
4. Digitization can reduce long-term administrative burden and manual errors.

### 3.3.3 Operational Feasibility

The project is operationally feasible because it provides clear benefits to both users and administrators.

1. Users receive a convenient and centralized platform.
2. Admins receive better control over resources and booking data.
3. The user interface is simple and role-sensitive.
4. The system aligns with real operational needs of tourism and travel service management.

### 3.3.4 Schedule Feasibility

The project is schedule-feasible because the modules can be built and tested incrementally.

1. Front-end design can be developed in parallel with backend schema preparation.
2. Authentication and role setup can be implemented early.
3. Booking modules can be added one after another.
4. Documentation and testing can proceed throughout the development cycle.

**Table 3.1 Feasibility Summary**

1. Technical feasibility - High
2. Economic feasibility - Moderate to High
3. Operational feasibility - High
4. Schedule feasibility - High

---

# CHAPTER 4 SYSTEM ANALYSIS

## 4.1 Requirement Specifications (SRS)

The Software Requirement Specification defines the functional behavior, data needs, constraints, and quality
expectations of the system.

### 4.1.1 User Categories

The system includes the following user categories:

1. **Visitor / Guest User** - Can browse information and service pages.
2. **Registered User** - Can log in and use booking services.
3. **Admin** - Can manage places, poojas, rooms, packages, and booking records.
4. **Hotel Admin** - Can manage accommodation-related access and service operations.

### 4.1.2 Functional Modules

1. Authentication and role verification
2. Room booking
3. Vehicle booking
4. Pooja booking
5. Package browsing and administration
6. Trip planner workflow
7. Contact management
8. Admin dashboard and service management

## 4.2 Functional Requirements

### 4.2.1 Authentication Requirements

1. The system shall allow users to sign up with basic profile details.
2. The system shall allow users to sign in securely.
3. The system shall assign and retrieve user roles.
4. The system shall redirect users based on their roles.

### 4.2.2 Booking Requirements

1. The system shall display room options based on selected location and guest preferences.
2. The system shall allow users to view vehicle options and travel-related information.
3. The system shall allow users to choose pooja services and booking dates.
4. The system shall display available packages and highlights.
5. The system shall store booking details in the database.

### 4.2.3 Trip Planner Requirements

1. The system shall collect a starting point.
2. The system shall allow selection of multiple destinations.
3. The system shall generate an optimized route structure.
4. The system shall recommend hotels, restaurants, and attractions.
5. The system shall allow vehicle and travel agency selection.
6. The system shall calculate trip cost and booking summary.

### 4.2.4 Administrative Requirements

1. The admin shall be able to manage places.
2. The admin shall be able to manage poojas.
3. The admin shall be able to manage rooms.
4. The admin shall be able to manage packages.
5. The admin shall be able to view combined booking records.
6. The dashboard shall show summary statistics.

### 4.2.5 Contact and Support Requirements

1. The system shall provide a contact form.
2. The system shall store contact messages.
3. The platform shall display support information.

**Table 4.1 Functional Requirement Summary**

FR1 - User authentication and registration FR2 - Role-based access control FR3 - Room booking support FR4 - Vehicle
booking support FR5 - Pooja booking support FR6 - Package viewing and management FR7 - Multi-step trip planner FR8 -
Booking data storage and retrieval FR9 - Contact message support FR10 - Administrative dashboard

## 4.3 Non-Functional Requirements

### 4.3.1 Performance

1. The system should load pages within acceptable response time under normal usage.
2. Booking and data retrieval operations should be handled efficiently.
3. Database queries should be optimized with indexes on major entities.

### 4.3.2 Security

1. The system should support authenticated access.
2. Sensitive operations should be restricted based on role.
3. Database access should be governed by row-level security policies.
4. User session handling should be secure.

### 4.3.3 Usability

1. The user interface should be simple and intuitive.
2. The site should support responsive layouts for different screen sizes.
3. The booking workflow should minimize confusion and repeated input.

### 4.3.4 Reliability

1. The system should preserve booking and user data accurately.
2. The system should support consistent CRUD operations for admin data.
3. The application should recover gracefully from failed requests where possible.

### 4.3.5 Maintainability

1. The codebase should be modular and component-driven.
2. Data models should be structured for future changes.
3. New modules should be addable with minimal redesign.

### 4.3.6 Scalability

1. The system should support future integration of payment systems.
2. The platform should support additional destinations, bookings, and user roles.
3. The architecture should allow integration with maps and notification services.

## 4.4 Software and Hardware Requirements

### 4.4.1 Software Requirements

**Table 4.2 Software Requirements**

1. Operating System - Windows / Linux / macOS
2. Frontend Framework - Next.js
3. UI Library - React
4. Programming Language - JavaScript
5. Styling - Tailwind CSS
6. Backend Service - Supabase
7. Database - PostgreSQL-compatible relational database through Supabase
8. Development Environment - VS Code
9. Browser - Chrome / Edge / Firefox
10. Version Control - Git

### 4.4.2 Hardware Requirements

**Table 4.3 Hardware Requirements**

1. Processor - Intel i3 or above / equivalent
2. RAM - Minimum 4 GB, Recommended 8 GB or more
3. Storage - Minimum 20 GB free disk space
4. Network - Stable internet connectivity
5. Display - Standard system with browser support

### 4.4.3 Constraints

1. Real-time payment integration is outside the current prototype scope.
2. Route optimization is currently designed for extension and may depend on external map services in production.
3. Final deployment environment and hosting configuration may vary.

**Fig. 4.1 Requirement Analysis Model**

[MIRO PROMPT: Create a requirement analysis diagram titled "Requirement Analysis of Saraswath Connect" with four grouped
blocks: User Requirements, Functional Requirements, Non-Functional Requirements, and Technical Constraints. Under user
requirements include pilgrims, admins, hotel admins. Under functional requirements include rooms, vehicles, poojas,
packages, trip planner, contact. Under non-functional requirements include security, usability, performance,
maintainability. Under constraints include payment integration pending, external maps future integration, cloud
deployment dependency.]

---

# CHAPTER 5 SYSTEM DESIGN

## 5.1 Design Overview

The system design of Saraswath Connect is based on modular separation of concerns. The front end handles user
interaction, navigation, forms, and visualization. The backend service manages authentication, database storage, and
secured data access. The design supports independent modules that are logically connected through a common data model.

The application contains the following design layers:

1. **Presentation Layer** - User-facing pages and admin pages.
2. **Application Layer** - Component logic, context-based state management, and service orchestration.
3. **Data Layer** - Supabase database, relational tables, and access policies.
4. **Security Layer** - Authentication, role lookup, and protected routes.

**Fig. 5.1 System Architecture of Saraswath Connect**

[MIRO PROMPT: Create a professional layered system architecture diagram titled "System Architecture of Saraswath
Connect". Show four layers: Presentation Layer (Home, Rooms, Vehicles, Poojas, Packages, Trip Planner, Admin Dashboard),
Application Layer (React components, Next.js routing, Auth Context, Trip Planner Context), Backend Layer (Supabase Auth,
Supabase API, business logic services), Data Layer (users, places, rooms, vehicles, poojas, packages, bookings,
contact_messages tables). Show arrows between layers and role-based access around the security boundary.]

## 5.2 Use Case Diagram

The use case model identifies the major actors and interactions of the system.

### 5.2.1 Actors

1. Visitor
2. Registered User
3. Admin
4. Hotel Admin

### 5.2.2 Use Cases

1. Register account
2. Login/logout
3. Browse places and services
4. Book room
5. Book vehicle
6. Book pooja
7. View packages
8. Plan trip
9. Send contact message
10. Manage places
11. Manage poojas
12. Manage rooms
13. Manage packages
14. View and manage bookings

**Fig. 5.2 Use Case Diagram**

[MIRO PROMPT: Create a UML use case diagram titled "Use Case Diagram for Saraswath Connect". Actors: Visitor, Registered
User, Admin, Hotel Admin. Use cases: Sign Up, Login, Browse Services, Book Room, Book Vehicle, Book Pooja, View
Packages, Plan Trip, Send Contact Message, Manage Places, Manage Poojas, Manage Rooms, Manage Packages, View Bookings,
Logout. Connect Visitor to Browse Services and Send Contact Message, Registered User to booking and trip planning use
cases, Admin to management use cases, Hotel Admin to room-related management. Use standard UML notation.]

## 5.3 Activity Diagram

The activity flow for the user-facing booking process begins with authentication, continues through service selection,
and ends with booking confirmation or record storage.

### 5.3.1 General User Booking Flow

1. Open application
2. Browse or log in
3. Select service category
4. Enter booking details
5. Validate availability and form input
6. Submit booking
7. Store record in database
8. Display confirmation

### 5.3.2 Trip Planner Flow

1. Enter starting point
2. Select destinations
3. Generate route and recommendations
4. Select vehicle and agency
5. Review billing
6. Submit trip plan

**Fig. 5.3 Activity Diagram for Booking and Trip Planning**

[MIRO PROMPT: Create an activity diagram titled "Activity Diagram for Saraswath Connect" with two swimlanes: User and
System. Flow should include Open Platform -> Login/Register (decision: authenticated?) -> Select Service (Room / Vehicle
/ Pooja / Package / Trip Planner) -> Enter Details -> Validate Input -> Fetch Related Data -> Confirm Selection -> Save
Booking / Save Trip Plan -> Show Success Message. Add a branch for invalid input leading back to the form.]

## 5.4 System Flowchart

The system flowchart shows overall data movement and control sequence between users, interface, authentication,
database, and admin modules.

**Fig. 5.4 System Flowchart**

[MIRO PROMPT: Create a system flowchart titled "System Flowchart of Saraswath Connect" showing Start -> Home Page ->
User Chooses Module -> If Login Required then Auth Check -> Role Identification -> User Dashboard or Admin Dashboard ->
Data Fetch from Database -> Booking / Management Action -> Database Update -> Response to Interface -> End. Include
admin branch and normal user branch distinctly.]

## 5.5 E-R Diagram

The E-R design is centered around the `users`, `places`, `rooms`, `vehicles`, `poojas`, `packages`, and booking tables.
The database also includes junction tables for package-room and package-place relationships.

### 5.5.1 Major Entities

1. Users
2. Places
3. Travel Agents
4. Rooms
5. Tourist Places
6. Vehicles
7. Poojas
8. Packages
9. Package Rooms
10. Package Places
11. Room Bookings
12. Vehicle Bookings
13. Pooja Bookings
14. Package Bookings
15. Contact Messages

### 5.5.2 Key Relationships

1. One place can have many rooms.
2. One place can have many tourist places.
3. One travel agent can have many vehicles.
4. One place can host many poojas.
5. One place can have many packages.
6. One user can create many bookings.
7. One package can include many rooms and many tourist places through junction tables.

**Fig. 5.5 E-R Diagram**

[MIRO PROMPT: Create a detailed ER diagram titled "ER Diagram for Saraswath Connect" with entities Users, Places,
Travel_Agents, Rooms, Tourist_Places, Vehicles, Poojas, Packages, Package_Rooms, Package_Places, Room_Bookings,
Vehicle_Bookings, Pooja_Bookings, Package_Bookings, Contact_Messages. Show primary keys, foreign keys, and cardinalities
such as Places 1-to-many Rooms, Users 1-to-many Booking tables, Travel_Agents 1-to-many Vehicles, Packages many-to-many
Rooms via Package_Rooms, Packages many-to-many Tourist_Places via Package_Places.]

## 5.6 Data Flow Diagram (DFD)

The DFD represents how data moves between users, the application, and the database.

### 5.6.1 Level 0 DFD

At the highest level, the system receives input from users and administrators, processes booking and management actions,
and stores or retrieves data from the database.

**Fig. 5.6 Level 0 DFD**

[MIRO PROMPT: Create a Level 0 DFD titled "Level 0 DFD for Saraswath Connect" with external entities User and Admin, one
main process Saraswath Connect System, and one data store Central Database. Show flows such as registration details,
booking requests, management data, booking confirmations, and reports. Use standard DFD symbols.]

### 5.6.2 Level 1 DFD

The main process can be decomposed into:

1. User Authentication
2. Service Browsing
3. Booking Management
4. Trip Planning
5. Admin Service Management
6. Contact Handling

**Fig. 5.7 Level 1 DFD**

[MIRO PROMPT: Create a Level 1 DFD titled "Level 1 DFD for Saraswath Connect" decomposing the system into processes: 1.0
Authentication, 2.0 Service Browsing, 3.0 Booking Management, 4.0 Trip Planner, 5.0 Admin Management, 6.0 Contact
Support. Connect them with data stores Users, Services, Bookings, Places, and Messages. Include User and Admin as
external entities.]

## 5.7 File / Database Design

The project uses a relational schema that supports modular data storage and efficient querying.

### 5.7.1 Core Tables

**Table 5.1 Users Table**

Fields:

1. `id` - Primary key linked with authenticated user
2. `full_name`
3. `phone`
4. `email`
5. `role`
6. `created_at`
7. `updated_at`

**Table 5.2 Places Table**

Fields:

1. `id`
2. `name`
3. `description`
4. `nearby_places`
5. `image_url`
6. `created_at`
7. `updated_at`

**Table 5.3 Rooms Table**

Fields:

1. `id`
2. `name`
3. `type`
4. `place_id`
5. `contact`
6. `price_per_night`
7. `availability_status`
8. `max_guests`
9. `amenities`
10. `image_url`
11. `created_at`
12. `updated_at`

**Table 5.4 Vehicles Table**

Fields:

1. `id`
2. `type`
3. `agent_id`
4. `vehicle_number`
5. `capacity`
6. `price_per_km`
7. `availability_status`
8. `image_url`
9. `created_at`
10. `updated_at`

**Table 5.5 Poojas Table**

Fields:

1. `id`
2. `name`
3. `type`
4. `temple_place_id`
5. `timings`
6. `price`
7. `description`
8. `duration`
9. `image_url`
10. `created_at`
11. `updated_at`

**Table 5.6 Packages Table**

Fields:

1. `id`
2. `name`
3. `place_id`
4. `duration_days`
5. `price`
6. `description`
7. `highlights`
8. `image_url`
9. `is_available`
10. `created_at`
11. `updated_at`

**Table 5.7 Booking Tables**

1. Room bookings
2. Vehicle bookings
3. Pooja bookings
4. Package bookings

Each booking table contains:

1. Booking identifier
2. Service identifier
3. User identifier
4. Date-related fields
5. Quantity or traveler information
6. Total price
7. Booking status
8. Timestamps

### 5.7.2 Database Security Design

1. Row-level security is enabled.
2. Public read access is limited to service discovery tables where appropriate.
3. Users can read and update only their own records.
4. Bookings are scoped to the authenticated user.
5. Admin functions are protected through role-based access logic.

### 5.7.3 Indexing Strategy

Indexes are defined on foreign keys, availability fields, status fields, and booking dates to improve query performance.

**Fig. 5.8 Database Relationship Overview**

[MIRO PROMPT: Create a database relationship overview diagram titled "Database Design of Saraswath Connect" focusing on
Users, Places, Rooms, Vehicles, Poojas, Packages, Travel_Agents, and the four booking tables. Emphasize key foreign key
links, booking ownership by users, and package junction tables. Use a clean report-ready schema style.]

## 5.8 Normalization

The database design follows normalization principles to reduce redundancy and improve consistency.

### 5.8.1 First Normal Form (1NF)

All tables contain atomic values and uniquely identifiable rows. Separate tables are created for rooms, vehicles,
poojas, packages, and bookings instead of storing all service details in one unstructured table.

### 5.8.2 Second Normal Form (2NF)

Partial dependency is removed by storing details in separate related tables. For example, package-room and package-place
associations are maintained in junction tables rather than duplicate storage.

### 5.8.3 Third Normal Form (3NF)

Transitive dependency is minimized by keeping user information, service information, booking information, and place
information in their own entities. This improves maintainability and avoids update anomalies.

**Table 5.8 Normalization Summary**

1. 1NF - Atomic attributes and primary keys used
2. 2NF - Junction tables used for many-to-many relations
3. 3NF - Independent descriptive data separated into dedicated tables

## 5.9 Input / Output Form Design

### 5.9.1 Input Forms

The application contains the following major input forms:

1. Signup form
2. Login form
3. Room search and booking form
4. Vehicle booking form
5. Pooja booking form
6. Contact form
7. Admin data entry forms for places, poojas, rooms, and packages
8. Trip planner step forms

### 5.9.2 Output Forms

The application provides the following outputs:

1. Service listings
2. Booking summaries
3. Package highlights
4. Dashboard statistics
5. Recent booking records
6. Route recommendations and cost breakdown

**Fig. 5.9 Input-Output Design Overview**

[MIRO PROMPT: Create an input-output design diagram titled "Input and Output Design of Saraswath Connect". Left side
should show input forms: Signup, Login, Room Booking, Vehicle Booking, Pooja Booking, Contact, Admin CRUD Forms, Trip
Planner Steps. Right side should show outputs: Service Listings, Booking Confirmation, Package Details, Dashboard Stats,
Booking Reports, Route and Cost Summary. Connect them through the Saraswath Connect processing block in the center.]

## 5.10 Screen Design

The user interface is designed to be simple, responsive, and service-oriented. Major screens include:

1. Home page with hero section and service cards.
2. About page and contact page.
3. Rooms page with filters and booking action.
4. Vehicles page with travel form and options.
5. Poojas page with location and date selection.
6. Packages page with highlights and pricing.
7. Trip planner page with step indicator and billing summary.
8. Login and signup pages.
9. Saraswat admin dashboard and CRUD management pages.

### 5.10.1 Screen Design Principles

1. Responsive layout
2. Clear navigation
3. Minimal input complexity
4. Category-wise service segmentation
5. Distinct administrative and user views

**Fig. 5.10 Home and Service Navigation Screen Mockup**

[MIRO PROMPT: Create a report-style wireframe titled "Home and Service Navigation Screen of Saraswath Connect" showing a
navbar, hero banner, service cards for Room Booking, Vehicle Booking, Pooja Booking, Tour Packages, and footer. Keep it
grayscale or soft academic colors for documentation.]

**Fig. 5.11 Trip Planner Workflow Screen Mockup**

[MIRO PROMPT: Create a clean wireframe titled "Trip Planner Workflow Screen of Saraswath Connect" showing a 5-step
progress indicator: Starting Point, Destinations, Route & Places, Vehicle, Review. Below it show a card-based form area
and a summary side panel.]

**Fig. 5.12 Admin Dashboard Screen Mockup**

[MIRO PROMPT: Create an academic admin dashboard wireframe titled "Admin Dashboard of Saraswath Connect" showing sidebar
navigation, top title bar, stats cards for Poojas, Places, Packages, Rooms, Total Bookings, and a recent bookings
table.]

## 5.11 Summary of Design

The system design supports an integrated platform for travel planning and service booking by combining front-end
usability, backend structure, secure access, and extensible module design. The architecture is suitable for prototype
deployment and future enterprise-level enhancement.

---

# CHAPTER 6 REFERENCE

1. N. Koblitz, _A Course in Number Theory and Cryptography_, Springer-Verlag.
2. Ian Sommerville, _Software Engineering_, Pearson Education.
3. Roger S. Pressman and Bruce R. Maxim, _Software Engineering: A Practitioner’s Approach_, McGraw-Hill.
4. Abraham Silberschatz, Henry F. Korth and S. Sudarshan, _Database System Concepts_, McGraw-Hill.
5. Martin Kleppmann, _Designing Data-Intensive Applications_, O’Reilly Media.
6. David, “Insulation design to combat pollution problem,” Proceedings of IEEE, PAS, Vol. 1, Aug. 1981, pp. 1901-1907.
7. G. Booch, J. Rumbaugh and I. Jacobson, _The Unified Modeling Language User Guide_, Addison-Wesley.
8. Next.js Documentation, Vercel, available online at: https://nextjs.org/docs
9. React Documentation, Meta, available online at: https://react.dev
10. Supabase Documentation, Supabase, available online at: https://supabase.com/docs

---

## APPENDIX: OPTIONAL CONTENT YOU CAN KEEP OR REMOVE BEFORE FINAL SUBMISSION

### Proposed Future Enhancements

1. Integration with payment gateways for direct online payments.
2. Email and SMS notifications for booking confirmations.
3. Live availability management for rooms and vehicles.
4. Maps integration for real travel distance and route optimization.
5. Personalized recommendations using analytics or machine learning.
6. Review and rating systems for services and packages.
7. Multi-language support for broader accessibility.
8. Mobile application version for travelers and tourists.

### Conclusion

Saraswath Connect is an academically relevant and socially useful project that addresses a practical problem in travel
planning and service booking. By integrating room booking, vehicle booking, service reservation (including pooja where
applicable), package exploration, trip planning, and administrative control within a single digital platform, the system
demonstrates the effectiveness of full-stack web technologies in solving domain-specific operational problems. The
project is technically feasible, scalable, and suitable for further enhancement into a production-ready platform.
