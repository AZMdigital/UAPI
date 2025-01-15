# API Hub Backend & Integrations

## Overview
The API Hub project consists of multiple components:
- **API Hub Backend**: A microservice handling backend functionality.
- **API Hub Integrations**: A service enabling seamless integration with external systems.
- **API Hub Portal**: A frontend portal built with Next.js for user interaction.

---

## Branching Strategy and Automatic Deployment

### API Hub Backend
#### Dev Environment Deployment:
1. Create a new feature branch from `staging`.
2. Make changes to your feature branch and test locally.
3. Merge your feature branch into the `develop` branch. This will trigger an automatic deployment to the development environment.

### API Hub Integrations
#### Dev Environment Deployment:
1. Create a new feature branch from `staging`.
2. Make changes to your feature branch and test locally.
3. Merge your feature branch into the `develop` branch. This will trigger an automatic deployment to the development environment.
4. QA will perform testing on the development environment.
5. Once testing is completed and passed, raise a Pull Request (PR) to merge your feature branch into the `staging` branch.

#### Sandbox Environment Deployment:
1. To release changes to the client, merge the `staging` branch into the `sandbox` branch.
2. This will trigger an automatic deployment to the sandbox environment.
3. QA will perform testing on the sandbox environment.

---

## API Hub Portal
### Technologies Used
1. **Next.js / React.js**
2. **TypeScript**

### Directory Structure
```
├── pages                                 # Contains Next.js pages
    ├── _app.tsx                          # Initializes pages and manages package wrappers
    ├── _document.tsx                     # Augments <html> and <body> tags
├── src
    ├── config                            # Global config files
    ├── api                               # API endpoints
        ├── rest
    ├── modules
        ├── _core                         # Reusable components and utilities
            ├── components                # Main components (e.g., login, register forms) and reusable parts
                ├── fragments             # Smaller component parts (e.g., input fields)
            ├── layouts                   # Main page layouts
            ├── styles                    # Component styles
            ├── labels                    # Localization for components
            ├── utils                     # Project utilities
    ├── styles                            # Module-specific styles
    ├── utils                             # Helper methods
```

---

## Setup Development Environment

### Step 1: Install Node.js
1. Install **nvm (Node.js version manager)**:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
   ```
2. Install Node.js version 16.13.0:
   ```bash
   nvm install v16.13.0
   nvm use v16.13.0
   ```

### Step 2: Install Git
For Linux and Windows users:
```bash
sudo apt-get install git
```

### Step 3: Clone the Repository
```bash
git clone <project-clone-SSH-URL>
```

### Step 4: Install Yarn Packages
```bash
yarn install --frozen-lockfile
```

### Step 5: Set Environment Variables
Environment variables are pre-configured; no additional setup is required.

### Step 6: Run the Local Development Server
```bash
yarn run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## Run Tests
### With Coverage Reports
```bash
yarn run test
```

### In Watch Mode
```bash
yarn run test:watch
```

---

## Setup Build
### Using Yarn
Run the build script with the appropriate environment:
```bash
yarn run build
```
For specific environments:
- Development: `yarn run build`
- Staging: `yarn run build:staging`
- Production: `yarn run build:production`

### Start the Server
```bash
yarn run start
```

---

## Additional Configuration
### Install VSCode ESLint Plugin
1. Open the VSCode extension browser (shortcut: `Cmd+Shift+X` on Mac).
2. Search for `eslint`.
3. Install the top result, called **ESLint**.

---

## Contribution Guidelines
- Follow the branching strategy outlined above.
- Ensure all code changes are tested locally before raising a PR.
- Communicate with the QA team for testing requirements.

---

## Contact
For further assistance or queries, contact the project maintainer.

