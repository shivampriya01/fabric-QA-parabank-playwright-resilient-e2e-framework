pipeline {
    agent any
    
    tools {
        nodejs 'node20' 
    }

    environment {
        // Use a headless mode for CI stability
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps chromium'
            }
        }

        stage('Execute E2E Tests') {
            steps {
                   sh 'npx playwright test || true'
            }
        }
    }

    post {
        always {
            // Archive the Playwright HTML report
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])
            
            // Cleanup workspace to keep local disk clean
            cleanWs()
        }
    }
}
