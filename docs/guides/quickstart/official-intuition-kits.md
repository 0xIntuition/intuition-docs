---
sidebar_position: 3
---

# Official Intuition Kits

Jump-start your development with our official Intuition starter kits. These pre-configured templates provide everything you need to build specific types of applications.

## Available Kits

### Web Application Kit
Perfect for building web-based applications with Intuition.

```bash
# Create a new web app
npx create-intuition-app@latest my-web-app --template web

cd my-web-app
npm install
npm run dev
```

**Features:**
- React/Next.js setup
- GraphQL client configuration
- TypeScript support
- Hot reloading
- Built-in styling

### Mobile Application Kit
Build cross-platform mobile apps with Intuition.

```bash
# Create a new mobile app
npx create-intuition-app@latest my-mobile-app --template mobile

cd my-mobile-app
npm install
npm run start
```

**Features:**
- React Native setup
- Expo integration
- Native Intuition SDK
- Offline support
- Push notifications

### Backend API Kit
Create server-side applications and APIs.

```bash
# Create a new backend app
npx create-intuition-app@latest my-backend --template backend

cd my-backend
npm install
npm run dev
```

**Features:**
- Express.js server
- GraphQL server setup
- Database integration
- Authentication middleware
- API documentation

### Smart Contract Kit
Develop and deploy smart contracts on Intuition.

```bash
# Create a new smart contract project
npx create-intuition-app@latest my-contract --template contract

cd my-contract
npm install
npm run compile
```

**Features:**
- Hardhat configuration
- Contract templates
- Testing framework
- Deployment scripts
- Gas optimization

## Kit Structure

Each kit includes:

```
my-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Application pages
│   ├── utils/         # Helper functions
│   └── types/         # TypeScript definitions
├── public/            # Static assets
├── contracts/         # Smart contracts (if applicable)
├── tests/             # Test files
├── docs/              # Documentation
└── package.json       # Dependencies and scripts
```

## Customization

All kits are fully customizable:

1. **Modify the configuration** in `intuition.config.js`
2. **Add your own components** in the `src/` directory
3. **Extend the GraphQL schema** for your specific needs
4. **Customize the styling** to match your brand

## Deployment

Each kit includes deployment configurations:

```bash
# Build for production
npm run build

# Deploy to Vercel (web apps)
npm run deploy

# Deploy to Expo (mobile apps)
npm run publish

# Deploy contracts to testnet
npm run deploy:testnet
```

## Community Support

- **Discord**: Join our community for help and discussions
- **GitHub**: Report issues and contribute to kits
- **Documentation**: Comprehensive guides for each kit
- **Examples**: Real-world applications built with each kit

## Next Steps

- Explore [Community-Built Kits](/guides/quickstart/community-built-kits) for additional templates
- Learn about [Smart Contracts](/guides/smart-contracts) for advanced features
- Check out the [GraphQL API](/graphql) for data integration

Choose the kit that best fits your project and start building with Intuition! 