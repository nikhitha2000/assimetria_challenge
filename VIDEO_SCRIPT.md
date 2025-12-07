# Video Script Template

Use this as a guide for your 30-120 second video submission.

## Introduction (5-10 seconds)
"Hi, my name is [Your Name], and I'm submitting my technical challenge for Assimetria."

## What You Built (20-30 seconds)
"I built a full-stack auto-generated blog application with the following features:

- **Frontend**: React application with a clean, modern UI that displays articles in a list view and individual article pages
- **Backend**: Node.js/Express REST API that handles article management and AI integration
- **Database**: PostgreSQL for persistent article storage
- **AI Integration**: Uses HuggingFace Inference API (free tier) to automatically generate blog articles
- **Automation**: The system generates one new article per day automatically using node-cron
- **Deployment**: Fully containerized with Docker and deployed on AWS EC2 using ECR and CodeBuild"

## Technical Decisions (30-40 seconds)
"Here are some key technical decisions I made:

1. **AI Service**: I chose HuggingFace because it's completely free and doesn't require GPU resources, making it perfect for a cost-effective solution
2. **Architecture**: I separated frontend and backend into different containers for better scalability and maintainability
3. **Scheduling**: Used node-cron instead of EC2 cron jobs for better portability and easier testing
4. **Database**: PostgreSQL for reliability and proper data relationships, though I could have used SQLite for simplicity
5. **CI/CD**: CodeBuild + ECR for automated builds, with manual deployment scripts for EC2 - this balances automation with control
6. **Fallback Mechanism**: Implemented fallback articles so the app continues working even if the AI API is unavailable"

## What You Would Improve (15-20 seconds)
"If I had more time, I would:

1. Add authentication and admin panel for better article management
2. Implement caching (Redis) for frequently accessed articles
3. Add automated deployment from CodeBuild to EC2 using Systems Manager
4. Set up monitoring and alerting with CloudWatch
5. Add pagination UI and search functionality
6. Implement proper error tracking with Sentry or similar"

## Closing (5 seconds)
"Thank you for the opportunity, and I look forward to your feedback!"

---

## Tips for Recording

- **Environment**: Record in a quiet place with good lighting
- **Duration**: Aim for 60-90 seconds total
- **Visual Aids**: Consider showing:
  - The live application running
  - Code repository structure
  - AWS console showing deployed resources
- **Delivery**: Speak clearly and confidently
- **Practice**: Rehearse once or twice before recording

## What to Show (Optional Visuals)

1. Live application: Navigate through the blog, show articles
2. GitHub repository: Quick overview of project structure
3. AWS Console: Show EC2 instance, ECR repositories, CodeBuild project
4. Terminal: Show docker containers running, or deployment process



