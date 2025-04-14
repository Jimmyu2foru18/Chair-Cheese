# ChairCheese Game

## Overview
ChairCheese is a fruit-ninja style game where players slice flying cheese objects while avoiding bombs. The game features power-ups, combos, and a scoring system based on successfully slicing cheese while avoiding obstacles.

## Game Features
- Slice flying cheese objects with your cursor
- Different cheese types with varying point values
- Power-ups that increase your score multiplier
- Combo system for consecutive slices
- Bombs to avoid
- Lives system (miss 5 cheese pieces and it's game over)

## How to Play
1. Click the "Start Slicing!" button to begin
2. Move your cursor across the screen to slice cheese objects
3. Avoid slicing bombs (they reduce your lives)
4. Try to slice cheese quickly to build combos
5. Collect power-ups for temporary score multipliers

## Technical Implementation
This game has been rebuilt from the original Three.js implementation to use HTML Canvas for better performance and reliability. The new implementation features:

- Canvas-based rendering for improved performance
- Proper collision detection using line-circle intersection
- Particle effects for visual feedback
- Responsive design that works on various screen sizes
- Touch support for mobile devices
- Chair-shaped obstacles instead of bombs
- Boundary checking to prevent objects from going off-screen
- Optimized movement speed for better gameplay

## Running the Game

### Local Development
1. Clone the repository to your local machine
2. Open the `new_index.html` file in your browser
3. No build steps or dependencies required!

### GitHub Pages Deployment
This project is configured for easy deployment to GitHub Pages:

1. Push your code to a GitHub repository
2. GitHub Actions will automatically deploy the game to GitHub Pages
3. Your game will be available at `https://[your-username].github.io/[repository-name]/`

Alternatively, you can manually deploy:

1. Go to your repository on GitHub
2. Navigate to Settings > Pages
3. Select the main branch as the source
4. Click Save


### Original Version
To run the original Three.js version:
```
python -m http.server 8000
```
Then open http://localhost:8000/ in your browser and open index.html

### New Version
To run the new Canvas-based version:
```
python -m http.server 8000
```
Then open http://localhost:8000/new_index.html in your browser

## Project Structure
- `index.html` - Original Three.js implementation HTML
- `app.js` - Original Three.js implementation JavaScript
- `style.css` - Original CSS styles
- `new_index.html` - New Canvas implementation HTML
- `new_game.js` - New Canvas implementation JavaScript
- `new_style.css` - New CSS styles for Canvas implementation
- `ChairCheese_Game_Documentation.md` - Detailed game documentation

## Future Improvements
- Additional cheese types with special behaviors
- More power-up varieties
- Difficulty progression
- Leaderboard system
- Sound effects and background music