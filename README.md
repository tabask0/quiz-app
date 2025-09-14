# Networking Interview Assessment App

A secure React-based quiz application designed for testing networking interview candidates. The app includes comprehensive networking questions and implements security measures to prevent answer inspection.

## Features

### 🔒 Security Features

- **Anti-Inspection Protection**: Disables developer tools, right-click, and keyboard shortcuts
- **Answer Obfuscation**: Correct answers are encrypted and obfuscated in the source code
- **Text Selection Disabled**: Prevents easy copying of questions and answers
- **DevTools Detection**: Automatically detects and blocks developer tools usage

### 📚 Quiz Features

- **10 Comprehensive Questions**: Covering OSI model, protocols, IP addressing, routing, VLANs, and more
- **Multiple Question Types**: Single-select and multi-select questions
- **Progress Tracking**: Visual progress bar and question navigation
- **Instant Scoring**: Real-time score calculation with detailed results
- **Responsive Design**: Works on desktop and mobile devices

### 🎨 Modern UI

- **Beautiful Gradient Design**: Modern glassmorphism design with smooth animations
- **Intuitive Navigation**: Easy-to-use interface with clear visual feedback
- **Accessibility**: Keyboard navigation and screen reader friendly
- **Mobile Responsive**: Optimized for all screen sizes

## Question Categories

- **Fundamentals**: OSI model basics
- **IP Addressing**: Private networks, subnet masks
- **Protocols**: TCP vs UDP, port numbers
- **OSI Model**: Layer-specific protocols
- **Subnetting**: Network addressing concepts
- **Network Devices**: Switches, routers, characteristics
- **Ports & Services**: Common port numbers
- **Routing**: Routing protocols (OSPF, BGP, RIP)
- **VLANs**: Virtual LAN concepts and benefits

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd networking-quiz-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Security Implementation

### Answer Obfuscation

Correct answers are stored using hexadecimal obfuscation and XOR encryption to prevent easy inspection:

```typescript
// Answers are obfuscated using bitwise operations
correctAnswers: q.correctAnswers.map((ans: number) => (ans + 0x1f2e) ^ 0xabcd);
```

### Anti-Inspection Measures

- Disables F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S
- Blocks right-click context menu
- Prevents text selection
- Detects developer tools by monitoring window dimensions
- Shows warning screen if developer tools are detected

## Usage

1. **Start the Quiz**: Click "Start Assessment" on the welcome screen
2. **Answer Questions**: Select single or multiple answers as indicated
3. **Navigate**: Use Previous/Next buttons or progress bar
4. **Complete**: Finish all questions to see your results
5. **Restart**: Take the quiz again if needed

## Technical Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Custom Hooks** for state management
- **CSS3** with modern features (Grid, Flexbox, Gradients)
- **Responsive Design** with mobile-first approach

## File Structure

```
src/
├── components/
│   ├── AntiInspection.tsx    # Security measures
│   ├── QuestionCard.tsx      # Question display component
│   ├── QuizNavigation.tsx    # Navigation controls
│   └── QuizResults.tsx       # Results display
├── data/
│   └── questions.ts          # Obfuscated question data
├── hooks/
│   └── useQuiz.ts           # Quiz state management
├── types/
│   └── quiz.ts              # TypeScript type definitions
├── App.tsx                  # Main application component
├── App.css                  # Application styles
└── main.tsx                 # Application entry point
```

## Customization

### Adding New Questions

Edit `src/data/questions.ts` and add new question objects following the existing format:

```typescript
{
  id: 0x1234, // Unique hexadecimal ID
  question: "Your question here?",
  options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  correctAnswers: [0, 1], // Index of correct answers
  type: "multiple" as const, // "single" or "multiple"
  category: "Category Name"
}
```

### Modifying Security Settings

Adjust the anti-inspection measures in `src/components/AntiInspection.tsx` to suit your needs.

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is for educational and assessment purposes. Please ensure compliance with your organization's policies when using for candidate evaluation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions, please create an issue in the repository or contact the development team.
