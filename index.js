
```javascript
const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline");

const client = new Anthropic();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt user for input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to generate business ideas using Claude
async function generateBusinessIdeas(industry, budget, skills) {
  console.log("\n🤖 Generating business ideas...\n");

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Generate 3 innovative business ideas for someone interested in the ${industry} industry with a budget of $${budget} and skills in: ${skills}. 
        
For each idea, provide:
1. Business name
2. Brief description
3. Why it's viable given the budget and skills
4. Potential revenue streams
5. Initial steps to start

Format each idea clearly with headers.`,
      },
    ],
  });

  return response.content[0].text;
}

// Function to validate business idea using Claude
async function validateBusinessIdea(businessIdea, industry, budget) {
  console.log("\n✅ Validating business idea...\n");

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Analyze and validate the following business idea for viability:

Business Idea: ${businessIdea}
Industry: ${industry}
Budget: $${budget}

Provide a validation report including:
1. Market demand assessment
2. Competitive landscape
3. Feasibility within budget constraints
4. Risk factors
5. Success probability (percentage)
6. Recommendations

Be honest and constructive in your assessment.`,
      },
    ],
  });

  return response.content[0].text;
}

// Function to create implementation plan
async function createImplementationPlan(businessIdea, skills) {
  console.log("\n📋 Creating implementation plan...\n");

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Create a detailed 6-month implementation plan for the following business idea:

Business Idea: ${businessIdea}
Founder Skills: ${skills}

Include:
1. Month 1-2: Preparation phase (what to do)
2. Month 3-4: Launch phase (timeline and milestones)
3. Month 5-6: Growth phase (key metrics and targets)
4. Resources needed
5. Critical success factors
6. Contingency plans

Make it practical and actionable.`,
      },
    ],
  });

  return response.content[0].text;
}

// Main application flow
async function main() {
  console.log("🚀 Business Idea Generator with Validation System");
  console.log("=".repeat(50));
  console.log("\nWelcome! Let's generate and validate business ideas.\n");

  // Get user inputs
  const industry = await askQuestion(
    "What industry are you interested in? (e.g., tech, agriculture, retail): "
  );

  const budgetInput = await askQuestion("What's your startup budget? ($): ");
  const budget = parseFloat(budgetInput) || 10000;

  const skills = await askQuestion(
    "What are your main skills? (comma-separated): "
  );

  // Generate business ideas
  const businessIdeas = await generateBusinessIdeas(industry, budget, skills);
  console.log("\n" + "=".repeat(50));
  console.log("GENERATED BUSINESS IDEAS:");
  console.log("=".repeat(50));
  console.log(businessIdeas);

  // Ask if user wants to validate an idea
  const validateChoice = await askQuestion(
    "\nWould you like to validate one of these ideas? (yes/no): "
  );

  if (validateChoice.toLowerCase() === "yes") {
    const ideaToValidate = await askQuestion(
      "Enter the business idea name or brief description: "
    );

    // Validate the chosen idea
    const validation = await validateBusinessIdea(
      ideaToValidate,
      industry,
      budget
    );
    console.log("\n" + "=".repeat(50));
    console.log("VALIDATION REPORT:");
    console.log("=".repeat(50));
    console.log(validation);

    // Ask if user wants implementation plan
    const planChoice = await askQuestion(
      "\nWould you like a 6-month implementation plan? (yes/no): "
    );

    if (planChoice.toLowerCase() === "yes") {
      // Create implementation plan
      const plan = await createImplementationPlan(ideaToValidate, skills);
      console.log("\n" + "=".repeat(50));
      console.log("6-MONTH IMPLEMENTATION PLAN:");
      console.log("=".repeat(50));
      console.log(plan);
    }
  }

  // Ask for another round
  const anotherRound = await askQuestion(
    "\nWould you like to generate ideas for another industry? (yes/no): "
  );

  if (anotherRound.toLowerCase() === "yes") {
    rl.close();
    main(); // Recursively start over
  } else {
    console.log(
      "\n✨ Thank you for using the Business Idea Generator! Good luck! 🎯"
    );
    rl.close();
  }
}

// Run the application
main().catch((error) => {
  console.error("