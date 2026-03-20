export interface Category {
  id: string
  name: string
  emoji: string
  color: string        // Tailwind bg class
  words: string[]
}

export const TIMER_OPTIONS = [30, 60, 90] as const
export type TimerOption = typeof TIMER_OPTIONS[number]

export const categories: Category[] = [
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐾',
    color: 'bg-green-600',
    words: [
      'Dog', 'Cat', 'Bird', 'Fish', 'Horse', 'Cow', 'Pig', 'Sheep',
      'Rabbit', 'Duck', 'Chicken', 'Frog', 'Snake', 'Bear', 'Lion',
      'Tiger', 'Elephant', 'Monkey', 'Penguin', 'Giraffe',
      'Dolphin', 'Kangaroo', 'Parrot', 'Hamster', 'Crocodile',
      'Jellyfish', 'Seahorse', 'Koala', 'Flamingo', 'Gorilla',
      'Turtle', 'Spider', 'Butterfly', 'Bee', 'Ant',
    ],
  },
  {
    id: 'food',
    name: 'Food & Drink',
    emoji: '🍕',
    color: 'bg-orange-500',
    words: [
      'Pizza', 'Burger', 'Rice', 'Bread', 'Egg', 'Soup', 'Cake',
      'Apple', 'Banana', 'Orange', 'Strawberry', 'Watermelon',
      'Carrot', 'Tomato', 'Potato', 'Onion', 'Chicken', 'Fish',
      'Milk', 'Coffee', 'Tea', 'Juice', 'Water', 'Ice Cream',
      'Chocolate', 'Cookie', 'Sandwich', 'Salad', 'Pasta', 'Cheese',
      'Butter', 'Yogurt', 'Honey', 'Popcorn', 'Noodles',
    ],
  },
  {
    id: 'actions',
    name: 'Actions',
    emoji: '🎭',
    color: 'bg-purple-600',
    words: [
      'Running', 'Swimming', 'Dancing', 'Sleeping', 'Eating',
      'Drinking', 'Reading', 'Writing', 'Cooking', 'Driving',
      'Singing', 'Laughing', 'Crying', 'Jumping', 'Walking',
      'Climbing', 'Fishing', 'Painting', 'Playing', 'Waiting',
      'Watching', 'Listening', 'Talking', 'Thinking', 'Waving',
      'Brushing Teeth', 'Washing Hands', 'Taking a Photo', 'Opening a Door', 'Riding a Bike',
      'Kicking a Ball', 'Throwing', 'Catching', 'Knocking', 'Clapping',
    ],
  },
  {
    id: 'jobs',
    name: 'Jobs',
    emoji: '👷',
    color: 'bg-blue-600',
    words: [
      'Teacher', 'Doctor', 'Nurse', 'Cook', 'Driver', 'Farmer',
      'Police', 'Firefighter', 'Dentist', 'Pilot', 'Singer',
      'Actor', 'Painter', 'Builder', 'Cleaner', 'Baker',
      'Waiter', 'Barber', 'Mechanic', 'Soldier',
      'Astronaut', 'Scientist', 'Engineer', 'Journalist', 'Librarian',
      'Judge', 'Lawyer', 'Architect', 'Photographer', 'Vet',
      'Postman', 'Fisherman', 'Miner', 'Cashier', 'Sailor',
    ],
  },
  {
    id: 'places',
    name: 'Places',
    emoji: '🌍',
    color: 'bg-teal-600',
    words: [
      'School', 'Hospital', 'Park', 'Beach', 'Market',
      'Airport', 'Hotel', 'Restaurant', 'Library', 'Museum',
      'Cinema', 'Gym', 'Bank', 'Church', 'Farm',
      'Forest', 'Mountain', 'River', 'Desert', 'Island',
      'Zoo', 'Stadium', 'Station', 'Supermarket', 'Pharmacy',
      'Bakery', 'Post Office', 'Police Station', 'Fire Station', 'Castle',
      'Bridge', 'Harbour', 'Playground', 'Office', 'Factory',
    ],
  },
  {
    id: 'sports',
    name: 'Sports',
    emoji: '⚽',
    color: 'bg-red-600',
    words: [
      'Football', 'Basketball', 'Tennis', 'Swimming', 'Running',
      'Cycling', 'Boxing', 'Golf', 'Volleyball', 'Baseball',
      'Rugby', 'Cricket', 'Badminton', 'Skiing', 'Surfing',
      'Gymnastics', 'Wrestling', 'Archery', 'Rowing', 'Diving',
      'Skating', 'Climbing', 'Karate', 'Yoga', 'Dancing',
      'Bowling', 'Horse Riding', 'Snowboarding', 'Hiking', 'Table Tennis',
      'Weightlifting', 'Fencing', 'Sailing', 'Triathlon', 'Marathon',
    ],
  },
]
