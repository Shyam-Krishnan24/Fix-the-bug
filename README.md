# Document Access System

## Overview

This application manages secure document records.

Documents are stored with metadata and access permissions.

Participants must identify issues in permission handling, storage logic, and security implementation.

---

# Architecture

Frontend

↓

Express Router

↓

Controller

↓

Service Layer

↓

File Utility

↓

JSON Database

---

# Folder Structure

```
frontend/
backend/
routes/
controllers/
services/
utils/
data/
```

---

# System Capabilities

• Store document metadata
• Retrieve documents
• Delete document entries

---

# APIs

Create document

POST

```
/api/create
```

List documents

GET

```
/api/list
```

Delete document

DELETE

```
/api/:id
```

---

# Bug Investigation Topics

Access Control

* Unauthorized document deletion
* Missing ownership checks

Storage

* Duplicate identifiers
* Data overwrite

Security

* Path manipulation risks
* Hardcoded secrets

Reliability

* Concurrent file updates
* JSON corruption

---

# Objective

Improve the system by ensuring:

* Proper access control
* Secure storage
* Reliable file operations
