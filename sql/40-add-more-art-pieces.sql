-- Add 6 new art pieces (7-12) to the art_pieces table

INSERT INTO art_pieces (name, description, price, artist, artist_pov, image_url, sort_order)
VALUES
(
  'Roman Holiday',
  'A charming watercolor study of two vintage scooters parked in a sun-bleached European alley. The loose, energetic splashes of yellow and blue paint convey a sense of movement and nostalgia, perfect for those who love the romance of travel.',
  12500,
  'Clara Bellini',
  'There is something so joyful about a Vespa. They represent freedom and style. I used watercolors to keep the feeling light and breezy, like a warm afternoon in Italy.',
  '7.jpg',
  7
),
(
  'The King’s Gambit',
  'A bold, expressionist take on the game of kings. The central golden King piece towers over the board, surrounded by gestural strokes of black and sienna. The dripping paint and rough textures suggest the high stakes and mental friction of a strategic battle.',
  15750,
  'Sudhir Gupta',
  'Chess is a game of silence and intense pressure. I did not want the pieces to look perfect; I wanted them to look battle-worn, capturing the weight of the decisions made on the board.',
  '8.jpg',
  8
),
(
  'The Golden Voyage',
  'A solitary figure stands in a small boat, silhouetted against a monumental sun. The heavy, impasto brushstrokes create a textured sea of gold and deep blue, capturing the quiet bravery of a lone traveler navigating the vast, shimmering unknown.',
  18200,
  'Sudhir Gupta',
  'Sunsets on the water are moments of profound reflection. This piece is about the courage of solitude—standing still while the world around you is a literal sea of fire and light.',
  '9.jpg',
  9
),
(
  'Midnight Luminescence',
  'A rainy evening transformed into a kaleidoscope of light. Streetlamps cast brilliant, fiery reflections onto the wet pavement, while a lone umbrella-clad figure walks through a forest of autumn colors. The heavy texture adds a physical depth to the glowing atmosphere.',
  19500,
  'Sudhir Gupta',
  'Rainy nights are usually seen as gloomy, but through a palette knife, they become electric. I wanted to show how artificial light dances with nature to create a second, more colorful world after dark.',
  '10.jpg',
  10
),
(
  'Nature’s Veil',
  'A surreal and mesmerizing portrait where the human form merges seamlessly with the flora. Vibrant yellow petals and deep purple leaves form a living mask around a single, piercing blue eye, creating a bridge between human consciousness and the wild spirit of the earth.',
  24500,
  'Sudhir Gupta',
  'I wanted to explore the idea that we don’t just observe nature; we are part of it. The eye is the window to the soul, but here, the petals are the window to our connection with the living world.',
  '11.jpg',
  11
),
(
  'Sacred Ghats',
  'An architectural tribute to the timeless beauty of Varanasi. The painting captures the intricate domes and bustling steps of the riverfront, with colorful boats resting on the Ganges. The bright, airy palette evokes the spiritual energy and morning light of a holy city.',
  21000,
  'Sudhir Gupta',
  'Varanasi is a city that breathes history. I focused on the contrast between the solid, ancient stone of the temples and the fluid, ever-changing life on the water.',
  '12.jpg',
  12
);

SELECT 'Added 6 new art pieces successfully! 🎨' as status;
