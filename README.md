# 🧮 Math Jenga

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

An interactive educational game that combines the classic Jenga tower with mathematical challenges designed for elementary school students. Build mathematical skills while having fun!

## 🎯 Overview

Math Jenga is an engaging web-based learning game that helps children practice arithmetic operations (addition and subtraction) in a playful environment. Players select cubes from the tower, solve math problems, and strategically place them back on top, all while trying to keep the tower stable.

## ✨ Features

- 🎲 **Interactive Jenga Tower** - Click on numbered cubes to select them
- 🧮 **Dynamic Math Questions** - Randomly generated addition and subtraction problems
- 💯 **Answer Validation** - Immediate feedback on correct/incorrect answers
- ❤️ **Lives System** - Three lives to encourage careful thinking
- 🔄 **Tower Rotation** - View the tower from different angles
- 🎨 **Colorful Design** - Engaging visual experience with color-coded cubes
- 📱 **Responsive Layout** - Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/math_jenga.git
cd math_jenga
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the game.

## 🎮 How to Play

1. **Select a Cube** - Click on any numbered cube from the visible side of the tower
2. **Solve the Math Problem** - A modal will appear with an arithmetic problem
3. **Enter Your Answer** - Type the correct answer and submit
4. **Place the Cube** - If correct, place the cube on top of the tower in an empty white space
5. **Continue Playing** - Keep solving problems and building the tower higher!
6. **Watch Your Lives** - You have 3 lives. Incorrect answers will cost you a life

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) - React framework with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **UI Library:** [React 19](https://reactjs.org/) - Component-based UI
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management
- **Package Manager:** npm/yarn/pnpm

## 📁 Project Structure

```
math_jenga/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks
├── lib/                   # Core game logic
│   ├── Jenga.tsx         # Main Jenga tower component
│   └── QuestionModal.tsx # Math question modal
├── models/                # TypeScript models/types
│   └── Cube.ts           # Cube model definition
├── public/                # Static assets
├── store/                 # State management
│   └── useStore.ts       # Zustand store configuration
└── styles/                # Additional styles
```

## 🔮 Roadmap & Future Features

### Upcoming Enhancements

- [ ] **Multiplayer Mode** - Two-player competitive gameplay
- [ ] **Enhanced Animations** - Smooth cube movements and transitions
- [ ] **Tower Physics** - Realistic tower collapse mechanics
- [ ] **Difficulty Levels** - Easy, Medium, Hard (with multiplication/division)
- [ ] **Bilingual Support** - English and Spanish language options
- [ ] **Sound Effects** - Audio feedback for actions
- [ ] **Score Tracking** - High scores and progress statistics
- [ ] **Achievement System** - Unlock badges and rewards
- [ ] **Customizable Themes** - Different visual styles
- [ ] **Progressive Math Topics** - Advanced operations for older students

### Long-term Goals

- Mobile app version (React Native)
- Teacher dashboard for classroom use
- Printable worksheets generation
- Integration with educational standards (Common Core, etc.)

## 🌐 Deployment

### GitHub Pages

This project can be deployed to GitHub Pages:

```bash
npm run build
npm run export
```

The static site will be generated in the `out` directory.

### Other Platforms

- **Vercel**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/math_jenga)
- **Netlify**: [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/math_jenga)

## 🤝 Contributing

Contributions are welcome! If you'd like to improve Math Jenga:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- Portfolio: [your-portfolio.com](https://your-portfolio.com)
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Inspired by the classic Jenga game
- Built with modern web technologies for optimal performance
- Designed with elementary education best practices in mind

## 📊 Project Status

**Status:** Active Development 🟢

This project is actively maintained and new features are being added regularly.

---

<div align="center">
  <strong>Made with ❤️ for young mathematicians</strong>
  <br />
  <sub>Help kids learn math while having fun!</sub>
</div>
