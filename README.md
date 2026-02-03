**Resilient E2E Framework | ParaBank**

**Summary**
This repository hosts an industrial-grade **End-to-End (E2E) automation framework**__ for the ParaBank Banking application.
Engineered with a "**Resilience First**" philosophy, this framework solves specific challenges inherent to the ParaBank environment—specifically **database state management** and **data collisions**—using a hybrid (UI + API) testing strategy.
The pipeline is fully operational on both **local legacy infrastructure** (Jenkins on Windows) and **modern cloud CI** (GitHub Actions).

**Architectural Highlights & Design Decisions**
| Challenge | Architectural Solution |
| ---------- | ---------- |
| **State Flakiness** | **Global Setup Teardown:** Implemented a global-setup.ts module that hits the ParaBank Admin API to "Clean" and "Initialize" the DB before every run, ensuring idempotency. |
| **Data Collisions** | **Dynamic Data Generation:** Integrated faker-js with UUID logic to generate unique entities (e.g., user_a8f2) at runtime, allowing parallel execution without "User already exists" errors. |
| **Transaction Integrity** | **Hybrid Validation:** Critical flows (like Funds Transfer) are triggered via UI but validated via backend API calls to ensure data persistence, faster than pure UI checks. |
| **Cross-Platform CI** | **Conditional Execution:** The Jenkinsfile is optimized with Windows-specific batch commands (bat) and manual environment injection to bypass corporate admin restrictions. |

**Prerequisites**
- **Node.js**: v18 or higher
- **Java (JDK)**: v11+ (Required only for Jenkins execution)

**Installation**
1. **Clone the repository:**
   ```Bash```
   ```git clone https://github.com/shivampriya01/fabric-QA-parabank-playwright-resilient-e2e-framework.git
   cd fabric-QA-parabank-playwright-resilient-e2e-framework```

2. **Install Dependencies:**
   ```Bash```
   ```npm install```
   
3. **Install Playwright Browsers:**
    ```Bash```
    ```npx playwright install --with-deps```

**Execution Guide**
| **Action** | **Command** |
| **Run All Tests (Headless)** | ```npx playwright test``` | 
| **Run in Headed Mode** | ```npx playwright test --headed``` |
| **Run Specific Test** | ```npx playwright test tests/example.spec.ts``` |
| **View HTML Report** | ```npx playwright show-report``` |

**CI/CD Integration** 
This project demonstrates a dual-pipeline strategy to ensure redundancy and accessibility.

**GitHub Actions (Cloud-Native)**
The suite runs automatically on every push to the ~~~main branch.
- **Live Dashboard**: View Recent Actions Runs
- **Artifacts**: Full HTML reports and traces are zipped and stored for 30 days.

**Jenkins (Local/On-Prem)**
A robust ```Jenkinsfile``` is included for on-premise execution.
- **Pipeline Strategy**: Declarative Pipeline
- **Reporting**: Integrated HTML Publisher Plugin for embedded reports.
- **Agent Config**: Configured for agent any with Windows path handling.
<img width="947" height="563" alt="Screenshot - Jenkins Run for Builds - 2026-01-25" src="https://github.com/user-attachments/assets/3e51d498-d9b4-4405-be9e-e122cf98907e" />
[#7 - Jenkin Build Successful Run.txt](https://github.com/user-attachments/files/25030887/7.-.Jenkin.Build.Successful.Run.txt)

**Project Structure**
```Plaintext```
```fabric-QA-parabank/
├── .github/workflows/   # GitHub Actions YAML configuration
├── src/
│   ├── pages/           # Page Object Models (POM) - UI Logic
│   ├── utils/           # API Wrappers & Winston Logger
│   └── fixtures/        # Custom test fixtures (Login, Data)
├── tests/               # Spec files
├── global-setup.ts      # DB Initialization & Environment Cleaning
├── playwright.config.ts # Core configuration (Retries, Workers)
├── Jenkinsfile          # Jenkins Pipeline Script
└── README.md            # Documentation```

🔮 **Future Roadmap**
- **Dockerization**: Containerizing the test runner for completely isolated execution.
- **Visual Regression**: Adding Percy or Applitools for layout validation.
- **Performance**: Reusing the API Utils to run load tests via K6 or Artillerry.

📊 **Evidence of Execution**
 - **Cloud Run**: GitHub Actions Run #21325344440
 - **Local Jenkins Run**: See attached evidence in email submission / docs folder.

👨‍💻 **Author**
**Shivam Priya**__
QE Lead who is passionate about building resilient, scalable, and maintainable quality engineering solutions.
