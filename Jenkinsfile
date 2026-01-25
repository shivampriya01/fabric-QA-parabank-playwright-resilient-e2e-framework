//Jenkinsfile (Optimized for Windows)
pipeline {
    agent any
    
    environment {
        // This pulls the path of the NodeJS tool you configured as 'node20'
        NODE_HOME = tool name: 'node20', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        // Adds Node to the PATH so 'npm' and 'npx' can be found
        PATH = "${NODE_HOME};${env.PATH}"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
                bat 'npx playwright install --with-deps chromium'
            }
        }

        stage('Execute E2E Tests') {
            steps {
                   bat 'npx playwright test --reporter=list'
            }
        }
    }

    post {
        always {
            // Archive the Playwright HTML report
            publishHTML(target:[
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
