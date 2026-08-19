export interface ReviewItem {
  id: string;
  name: string;
  profession: string;
  rating: number;
  review: string;
  portrait: string;
  backgroundColor: string;
  splashColor: string;
  accentColor?: string;
  mood: string;
  decorativeElement?: string;
}

export const REVIEWS_DATA: ReviewItem[] = [
  // 1. Sapphire Teal
  {
    id: "rev-1",
    name: "Oliver Bennett",
    profession: "Art Collector",
    rating: 5,
    review: "The low-sugar brownies are a lifesaver for my sweet cravings! They're decadent and satisfying, without the guilt. I'm hooked!",
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#0F6B73",
    splashColor: "#EAF7F5",
    accentColor: "#DDF8F4",
    mood: "Fresh Morning",
    decorativeElement: "droplet"
  },
  // 2. Copper Clay
  {
    id: "rev-2",
    name: "Sophia Martinez",
    profession: "Creative Director",
    rating: 5,
    review: "A masterpiece of flavor and styling. They didn't just bake a cake; they crafted a brand experience that dominated our event.",
    portrait: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#B55A36",
    splashColor: "#F5E7D6",
    mood: "Artisan Bakery",
    decorativeElement: "cookie"
  },
  // 3. Pine Fern
  {
    id: "rev-3",
    name: "Davie Cade",
    profession: "Brand Designer",
    rating: 5,
    review: "I love the fiber-rich cookies! They're crunchy, delicious, and keep me full longer. It's great to have a snack that's both tasty and good for me.",
    portrait: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#335C43",
    splashColor: "#F4F0E6",
    mood: "Organic Farm",
    decorativeElement: "quote"
  },
  // 4. Twilight Cobalt
  {
    id: "rev-4",
    name: "James Reed",
    profession: "Coffee Shop Owner",
    rating: 5,
    review: "Their pastries pair perfectly with our coffee. Customers keep asking where we get them from!",
    portrait: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#3D4EA3",
    splashColor: "#E9E3FF",
    mood: "Premium Signature",
    decorativeElement: "sparkle"
  },
  // 5. Mulled Berry
  {
    id: "rev-5",
    name: "Chloe Henderson",
    profession: "Illustrator",
    rating: 5,
    review: "Playful, colorful, and deliciously chunky. They bring raw artistic energy and nostalgia back into custom baking.",
    portrait: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#7B2748",
    splashColor: "#F7DDD3",
    mood: "Dessert Collection",
    decorativeElement: "stamp"
  },
  // 6. Sapphire Teal
  {
    id: "rev-6",
    name: "David Kim",
    profession: "Marketing Manager",
    rating: 5,
    review: "Consistent quality that our clients love. The packaging design is gorgeous and makes an immediate impression.",
    portrait: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#0F6B73",
    splashColor: "#EAF7F5",
    accentColor: "#DDF8F4",
    mood: "Fresh Morning",
    decorativeElement: "sparkle"
  },
  // 7. Copper Clay
  {
    id: "rev-7",
    name: "Elena Rostova",
    profession: "Interior Designer",
    rating: 5,
    review: "Absolute visual perfection. The geometric structure of their baked collection is a food photographer's dream.",
    portrait: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#B55A36",
    splashColor: "#F5E7D6",
    mood: "Artisan Bakery",
    decorativeElement: "droplet"
  },
  // 8. Pine Fern
  {
    id: "rev-8",
    name: "Isabella Vane",
    profession: "Photographer",
    rating: 5,
    review: "The contrast between the neobrutalist sharp edges and organic cake drops photographed like high-end fashion art.",
    portrait: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#335C43",
    splashColor: "#F4F0E6",
    mood: "Organic Farm",
    decorativeElement: "cookie"
  },
  // 9. Twilight Cobalt
  {
    id: "rev-9",
    name: "Alexander Wright",
    profession: "Gallery Curator",
    rating: 5,
    review: "Every bite is a story. Their cheesecake recipe is simply out of this world. Highly recommended!",
    portrait: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#3D4EA3",
    splashColor: "#E9E3FF",
    mood: "Premium Signature",
    decorativeElement: "stamp"
  },
  // 10. Mulled Berry
  {
    id: "rev-10",
    name: "Nadia Belhadj",
    profession: "Wedding Client",
    rating: 5,
    review: "They built us a dessert table that was the talk of our wedding reception. Excellent balance of sweetness and texture.",
    portrait: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=450&h=450&fit=crop&q=80",
    backgroundColor: "#7B2748",
    splashColor: "#F7DDD3",
    mood: "Dessert Collection",
    decorativeElement: "quote"
  }
];

export const SPLASH_PATHS = [
  "M20,130 C15,70 45,30 110,25 C180,20 220,65 215,130 C210,205 185,265 115,270 C45,275 25,200 20,130 Z",
  "M25,120 C10,60 55,15 125,20 C195,25 225,80 210,145 C195,215 160,280 95,265 C30,250 40,180 25,120 Z",
  "M15,140 C25,50 80,10 145,30 C210,50 230,110 205,175 C180,240 120,285 60,260 C0,235 5,210 15,140 Z",
  "M30,110 C20,40 70,20 135,15 C200,10 225,75 215,140 C205,205 170,270 100,275 C30,280 40,180 30,110 Z",
  "M10,135 C30,60 65,25 130,20 C195,15 220,70 210,135 C200,200 175,275 110,270 C45,265 -10,210 10,135 Z",
  "M35,125 C15,55 50,15 120,20 C190,25 230,85 210,150 C190,215 155,275 90,265 C25,255 55,195 35,125 Z",
  "M20,140 C10,75 40,30 115,20 C190,10 225,60 215,135 C205,210 165,280 105,270 C45,260 30,205 20,140 Z",
  "M25,115 C35,45 85,15 150,25 C215,35 220,100 200,165 C180,230 130,275 70,260 C10,245 15,185 25,115 Z",
  "M15,130 C5,65 55,20 125,15 C195,10 230,65 210,135 C190,205 160,270 95,265 C30,260 25,195 15,130 Z",
  "M30,120 C20,50 60,10 130,25 C200,40 225,95 205,160 C185,225 145,280 80,265 C15,250 40,190 30,120 Z"
];
