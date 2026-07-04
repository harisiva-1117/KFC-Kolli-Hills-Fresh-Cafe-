// Non-product static data for Kolli Hills Fresh Cafe homepage.
// Products & categories live in MongoDB and are fetched via /app/frontend/src/lib/api.js.
import logo from "../components/assets/logo.png";
import gallery1 from "../components/assets/gallery1.jpeg";
import gallery2 from "../components/assets/gallery2.jpeg";
import gallery3 from "../components/assets/gallery3.jpeg";
export const BRAND = {
  name: "Kolli Hills Fresh Cafe",
  short: "KFC Karavalli",
  phone: "+91 90801 31442",
  phoneHref: "tel:+919080131442",
  hours: "Open 24 Hours",
  pickup: "Pickup Only",
  prep: "10–15 Minutes Prep",
  logo: logo,
  mapsLink: "https://maps.app.goo.gl/XBeX74ddxnQcfs2A7",
  mapsEmbed:
    "https://www.google.com/maps?q=Kolli+Hills+Fresh+Cafe+Karavalli&output=embed",
};

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHw0fHxtaXN0eSUyMG1vdW50YWlucyUyMGZvcmVzdCUyMG5hdHVyZXxlbnwwfHx8fDE3ODMxMzg1Nzh8MA&ixlib=rb-4.1.0&q=85";

export const GALLERY = [
  gallery1,
  gallery2,
  gallery3,
  "https://images.unsplash.com/photo-1567726843492-df0484bb0b05?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBwbGFudGF0aW9uJTIwbWlzdHxlbnwwfHx8fDE3ODMxMzg1OTN8MA&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHw0fHxtaXN0eSUyMG1vdW50YWlucyUyMGZvcmVzdCUyMG5hdHVyZXxlbnwwfHx8fDE3ODMxMzg1Nzh8MA&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1668885309844-5bb50f7c2e61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzcGljZXMlMjBtYXJrZXR8ZW58MHx8fHwxNzgzMTM4NTg2fDA&ixlib=rb-4.1.0&q=85",
];

export const REVIEWS = [
  {
    name: "Aditi Ramanathan",
    location: "Namakkal",
    quote:
      "We stopped by on our way up the ghat road — the filter coffee tastes like it came straight from the plantation. We now stop every trip.",
    rating: 5,
  },
  {
    name: "Rahul Menon",
    location: "salem",
    quote:
      "The honey and spices are the real deal. Packed cleanly, priced fair. My kitchen has never smelt better since our last Kolli Hills trip.",
    rating: 5,
  },
  {
    name: "Sneha Iyer",
    location: "Coimbatore",
    quote:
      "Ordered ahead on the drive up. Sandwiches were hot, milkshakes were thick, and the staff waved us in like family. Warm hospitality.",
    rating: 5,
  },
  {
    name: "Karthik Subramanian",
    location: "Salem",
    quote:
      "Open 24 hours truly saved us on a late night descent. A rare place in the hills where you get quality this consistent.",
    rating: 5,
  },
];

export const CATEGORY_MARQUEE = [
  "Fresh Coffee",
  "Wild Honey",
  "Cold-Pressed Juice",
  "Hand-Picked Spices",
  "Grilled Sandwiches",
  "Estate Chocolate",
  "Dry Fruits",
  "Kolli Hills Specials",
];
