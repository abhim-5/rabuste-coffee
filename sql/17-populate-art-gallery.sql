-- Populate Art Gallery Data
-- Run this AFTER running 16-art-gallery-schema.sql

-- Clear existing data (optional)
-- TRUNCATE art_pieces CASCADE;

INSERT INTO art_pieces (name, description, price, artist, artist_pov, image_url, sort_order)
VALUES
(
  'Dawn Chorus',
  'A delicate watercolor celebrating the quiet beauty of dawn, where vibrant finches perch gracefully on golden wheat stalks. The soft, earthy tones and gentle brushwork evoke the serene moment when nature awakens, and the first songbirds greet the morning light.',
  12999,
  'Priya Malhotra',
  'I''m captivated by those fleeting moments just before sunrise, when the world holds its breath. These finches represent hope and renewal—a reminder that each day brings fresh possibilities.',
  '1.jpg',
  1
),
(
  'Midnight Falls',
  'A dramatic nocturnal landscape where a luminous full moon illuminates a cascading waterfall through misty forests. Rich blues and teals create an ethereal atmosphere, while the play of moonlight on water captures nature''s mystical grandeur.',
  15999,
  'Arjun Reddy',
  'The night reveals a different world—one of mystery and magic. This painting explores the power of moonlight to transform the familiar into the extraordinary, where waterfalls become liquid silver.',
  '2.jpg',
  2
),
(
  'Wetland Companions',
  'A naturalist''s study featuring elegant waterfowl resting on weathered driftwood, rendered in classical watercolor technique. The composition celebrates biodiversity and the interconnected lives of marsh inhabitants, from sleek ravens to mottled ducks.',
  18999,
  'Kavya Sharma',
  'Wetlands are sanctuaries of life. Through careful observation and tender brushstrokes, I aim to honor these often-overlooked creatures and the delicate ecosystems they call home.',
  '3.jpg',
  3
),
(
  'Monsoon Transit',
  'An atmospheric urban scene capturing the romance of rain-soaked city streets, where a vintage tram glides through the drizzle as pedestrians navigate with umbrellas. Warm ochres and cool grays create a nostalgic mood of everyday poetry.',
  21999,
  'Rahul Verma',
  'Cities transform in the rain. The reflections, the softened edges, the shared shelter of strangers—monsoons reveal the humanity in our urban landscapes. This is my love letter to rainy days.',
  '4.jpg',
  4
),
(
  'Summer Garden',
  'A vibrant celebration of nature''s bounty, featuring cheerful daisies interwoven with ripe citrus fruits. The composition bursts with warmth and vitality, evoking sun-drenched gardens and the simple pleasures of seasonal abundance.',
  16999,
  'Meera Kapoor',
  'Flowers and fruit together represent life''s sweetness. I wanted to capture that feeling of walking through a garden in full bloom, where color and fragrance overwhelm the senses in the most delightful way.',
  '5.jpg',
  5
),
(
  'Bamboo Sanctuary',
  'A tranquil Asian-inspired landscape where graceful cranes wade through misty bamboo groves. Soft greens and subtle atmospheric perspective create depth and serenity, embodying the zen aesthetic of balance and natural harmony.',
  19999,
  'Sudhir Gupta',
  'Cranes symbolize longevity and wisdom in many cultures. Set against bamboo—which bends but never breaks—this painting is a meditation on resilience, grace, and the quiet strength found in nature.',
  '6.jpg',
  6
);

SELECT 'Art Gallery data populated successfully! ✅' as status;
