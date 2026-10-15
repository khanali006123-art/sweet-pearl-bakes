import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { IProduct, IOrder, IContactMessage, ISubscriber, ISettings, IAuditLog } from '@sweetpearl/shared';

const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

export interface DatabaseData {
  products: IProduct[];
  orders: IOrder[];
  messages: IContactMessage[];
  subscribers: ISubscriber[];
  settings: ISettings;
  orderCounter: number;
  adminUsers: Array<{
    _id: string;
    email: string;
    passwordHash: string;
    role: 'owner' | 'staff';
    name: string;
  }>;
  auditLogs: IAuditLog[];
}

const defaultProducts: IProduct[] = [
  {
    "_id": "prod_1",
    "name": "Decadent Chocolate Brownies",
    "slug": "brownies",
    "category": "Bakery Item",
    "description": "Ultra-fudgy chocolate brownies with rich cocoa and a crackly crust. Freshly baked daily in Dera Ismail Khan.",
    "images": [
      {
        "url": "/products/brownies.jpg",
        "alt": "Decadent Chocolate Brownies"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Piece",
        "amountPKR": 220
      },
      {
        "label": "Box of 4 pcs",
        "amountPKR": 880
      },
      {
        "label": "Box of 6 pcs",
        "amountPKR": 1300
      },
      {
        "label": "Box of 12 pcs (Party Box)",
        "amountPKR": 2500
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Classic Double Chocolate",
      "Fudge Walnut"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 1
  },
  {
    "_id": "prod_2",
    "name": "Chocolate Swiss Roll",
    "slug": "choclate-swiss-roll",
    "category": "Bakery Item",
    "description": "Soft and delicate chocolate sponge rolled with rich chocolate cream filling.",
    "images": [
      {
        "url": "/products/choclate-swiss-roll.jpg",
        "alt": "Chocolate Swiss Roll"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Piece",
        "amountPKR": 100
      },
      {
        "label": "Pack of 4 pcs",
        "amountPKR": 400
      },
      {
        "label": "Pack of 8 pcs",
        "amountPKR": 800
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Chocolate Cream",
      "Vanilla Swirl"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 2
  },
  {
    "_id": "prod_3",
    "name": "Chocolate Filled Cupcake",
    "slug": "choclate-filled-cupcake",
    "category": "Bakery Item",
    "description": "Moist gourmet chocolate cupcakes with a molten chocolate core and swirl frosting.",
    "images": [
      {
        "url": "/products/choclate-filled-cupcake.jpg",
        "alt": "Chocolate Filled Cupcake"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Piece",
        "amountPKR": 200
      },
      {
        "label": "Box of 4 pcs",
        "amountPKR": 800
      },
      {
        "label": "Box of 6 pcs",
        "amountPKR": 1200
      },
      {
        "label": "Box of 12 pcs",
        "amountPKR": 2300
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Chocolate Lava",
      "Nutella Swirl",
      "Vanilla Buttercream"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 3
  },
  {
    "_id": "prod_4",
    "name": "Banana Bread / Slice Cake",
    "slug": "banana-bread-slice-cake",
    "category": "Bread / Loaf",
    "description": "Freshly baked wholesome banana bread loaf made with ripe bananas and a touch of cinnamon.",
    "images": [
      {
        "url": "/products/banana-bread-slice-cake.jpg",
        "alt": "Banana Bread / Slice Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Full Loaf",
        "amountPKR": 850
      },
      {
        "label": "2 Loaves Pack",
        "amountPKR": 1650
      }
    ],
    "priceMode": "fixed",
    "flavors": [
      "Classic Banana Walnut",
      "Choc-Chip Banana"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 4
  },
  {
    "_id": "prod_5",
    "name": "Long Candle Celebration Cake",
    "slug": "long-cake",
    "category": "Designer Cake",
    "description": "Elegant horizontal designer cake adorned with delicate ribbon piping and tall birthday candles.",
    "images": [
      {
        "url": "/products/long-cake.jpg",
        "alt": "Long Candle Celebration Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "2 Pounds (Serves 8-12)",
        "amountPKR": 2200
      },
      {
        "label": "3 Pounds (Serves 14-18)",
        "amountPKR": 3300
      },
      {
        "label": "4 Pounds (Serves 20-25)",
        "amountPKR": 4400
      },
      {
        "label": "5 Pounds (Grand Event)",
        "amountPKR": 5500
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Chocolate Ganache",
      "Vanilla Cream",
      "Red Velvet"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 5
  },
  {
    "_id": "prod_6",
    "name": "Ribbed Ribbon Cake",
    "slug": "ribbon-cake",
    "category": "Designer Cake",
    "description": "Artisanal tiered ribbed texture cake styled with dark satin ribbons and personalized lettering.",
    "images": [
      {
        "url": "/products/ribbon-cake.jpg",
        "alt": "Ribbed Ribbon Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Pound",
        "amountPKR": 1125
      },
      {
        "label": "2 Pounds",
        "amountPKR": 2250
      },
      {
        "label": "3 Pounds",
        "amountPKR": 3375
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4500
      },
      {
        "label": "5 Pounds",
        "amountPKR": 5625
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Vanilla Bean",
      "Chocolate Ganache",
      "Strawberry Swirl"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 6
  },
  {
    "_id": "prod_7",
    "name": "Gold Nikkah Mubarak Cake",
    "slug": "nikkah-cake",
    "category": "Designer Cake",
    "description": "Special Nikkah & Wedding celebration cake with textured gold finish and custom acrylic topper.",
    "images": [
      {
        "url": "/products/nikkah-cake.jpg",
        "alt": "Gold Nikkah Mubarak Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Pound",
        "amountPKR": 1025
      },
      {
        "label": "2 Pounds",
        "amountPKR": 2050
      },
      {
        "label": "3 Pounds",
        "amountPKR": 3075
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4100
      },
      {
        "label": "5 Pounds",
        "amountPKR": 5125
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Royal Vanilla",
      "Lotus Biscoff",
      "Chocolate Ganache"
    ],
    "minNoticeDays": 2,
    "isActive": true,
    "sortOrder": 7
  },
  {
    "_id": "prod_8",
    "name": "Gold Floral Anniversary Cake",
    "slug": "gold-floral-anniversary-cake",
    "category": "Designer Cake",
    "description": "Stunning anniversary cake decorated with white sugar florals, golden pearls, and customized anniversary numbers.",
    "images": [
      {
        "url": "/products/gold-floral-anniversary-cake.jpg",
        "alt": "Gold Floral Anniversary Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Pound",
        "amountPKR": 1240
      },
      {
        "label": "2 Pounds",
        "amountPKR": 2470
      },
      {
        "label": "3 Pounds",
        "amountPKR": 3700
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4933
      },
      {
        "label": "5 Pounds",
        "amountPKR": 6166
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Vanilla Bean",
      "Red Velvet",
      "Dark Truffle"
    ],
    "minNoticeDays": 2,
    "isActive": true,
    "sortOrder": 8
  },
  {
    "_id": "prod_9",
    "name": "Mickey & Butterflies Kids Cake",
    "slug": "mickey-mouse-cake",
    "category": "Kids Theme",
    "description": "Vibrant kids birthday cake featuring Mickey Mouse accents, 3D blue butterflies, and custom greeting.",
    "images": [
      {
        "url": "/products/mickey-mouse-cake.jpg",
        "alt": "Mickey & Butterflies Kids Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "2 Pounds",
        "amountPKR": 2333
      },
      {
        "label": "3 Pounds",
        "amountPKR": 3500
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4667
      },
      {
        "label": "5 Pounds",
        "amountPKR": 5833
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Chocolate Fudge",
      "Vanilla Cream",
      "Strawberry"
    ],
    "minNoticeDays": 2,
    "isActive": true,
    "sortOrder": 9
  },
  {
    "_id": "prod_10",
    "name": "Fairy Butterfly Wings Cake",
    "slug": "fairy-butterfly-wings-cake",
    "category": "Theme Cake",
    "description": "Enchanting pastel pink ombre cake topped with illuminated fairy wings and delicate butterflies.",
    "images": [
      {
        "url": "/products/fairy-butterfly-wings-cake.jpg",
        "alt": "Fairy Butterfly Wings Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "2 Pounds",
        "amountPKR": 2333
      },
      {
        "label": "3 Pounds",
        "amountPKR": 3500
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4667
      },
      {
        "label": "5 Pounds",
        "amountPKR": 5833
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Strawberry Shortcake",
      "Vanilla Frosting",
      "Red Velvet"
    ],
    "minNoticeDays": 2,
    "isActive": true,
    "sortOrder": 10
  },
  {
    "_id": "prod_11",
    "name": "Football Championship Theme Cake",
    "slug": "football-them-cake",
    "category": "Theme Cake",
    "description": "Custom sports celebration cake crafted with a 3D soccer ball surface and grassy buttercream turf.",
    "images": [
      {
        "url": "/products/football-them-cake.jpg",
        "alt": "Football Championship Theme Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "2 Pounds",
        "amountPKR": 2267
      },
      {
        "label": "3 Pounds",
        "amountPKR": 3400
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4533
      },
      {
        "label": "5 Pounds",
        "amountPKR": 5667
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Chocolate Truffle",
      "Oreo Cream",
      "Vanilla"
    ],
    "minNoticeDays": 2,
    "isActive": true,
    "sortOrder": 11
  },
  {
    "_id": "prod_12",
    "name": "Purple Butterfly Dream Cake",
    "slug": "purple-butterfly-cake",
    "category": "Theme Cake",
    "description": "Pastel lilac cake adorned with fluttering butterflies, edible gold sequins, and birthday topper.",
    "images": [
      {
        "url": "/products/purple-butterfly-cake.jpg",
        "alt": "Purple Butterfly Dream Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Pound",
        "amountPKR": 1133
      },
      {
        "label": "2 Pounds",
        "amountPKR": 2267
      },
      {
        "label": "3 Pounds",
        "amountPKR": 3400
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4533
      },
      {
        "label": "5 Pounds",
        "amountPKR": 5667
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Lavender Berry",
      "Vanilla Bean",
      "Chocolate"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 12
  },
  {
    "_id": "prod_13",
    "name": "Vintage Black Ribbon Heart Cake",
    "slug": "vintage-black-ribbon-cake",
    "category": "Custom Cake",
    "description": "Retro Korean/Lambeth style white cake adorned with delicate black satin bows and mini hearts.",
    "images": [
      {
        "url": "/products/vintage-black-ribbon-cake.jpg",
        "alt": "Vintage Black Ribbon Heart Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Pound",
        "amountPKR": 1067
      },
      {
        "label": "2 Pounds",
        "amountPKR": 2133
      },
      {
        "label": "3 Pounds",
        "amountPKR": 3200
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4267
      },
      {
        "label": "5 Pounds",
        "amountPKR": 5333
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Chocolate Ganache",
      "Vanilla Cream",
      "Red Velvet"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 13
  },
  {
    "_id": "prod_14",
    "name": "Chocolate Drip Gourmet Cake",
    "slug": "chocolate-drip-cake",
    "category": "Drip Cake",
    "description": "Rich dark chocolate ganache waterfall drip over chocolate sponge with chocolate bar chunks.",
    "images": [
      {
        "url": "/products/chocolate-drip-cake.jpg",
        "alt": "Chocolate Drip Gourmet Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Pound",
        "amountPKR": 1200
      },
      {
        "label": "2 Pounds",
        "amountPKR": 2400
      },
      {
        "label": "2.5 Pounds (Special)",
        "amountPKR": 3000
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4800
      },
      {
        "label": "5 Pounds",
        "amountPKR": 6000
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Dark Belgian Chocolate",
      "Nutella Fudge"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 14
  },
  {
    "_id": "prod_15",
    "name": "Welcome Baby Boy Theme Cake",
    "slug": "welcome-baby-boy-cake",
    "category": "Theme Cake",
    "description": "Sky blue cake decorated with fluffy cloud piping, sunshine accents, and welcoming baby lettering.",
    "images": [
      {
        "url": "/products/welcome-baby-boy-cake.jpg",
        "alt": "Welcome Baby Boy Theme Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "2 Pounds",
        "amountPKR": 2240
      },
      {
        "label": "2.5 Pounds (Special)",
        "amountPKR": 2800
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4480
      },
      {
        "label": "5 Pounds",
        "amountPKR": 5600
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Vanilla Cloud",
      "Strawberry Cream",
      "Chocolate"
    ],
    "minNoticeDays": 2,
    "isActive": true,
    "sortOrder": 15
  },
  {
    "_id": "prod_16",
    "name": "Sheep / Lamb 3D Cake",
    "slug": "sheep-lamb-cake",
    "category": "Custom Cake",
    "description": "Adorable 3D textured sheep cake crafted with rosette wool piping and cute fondant face.",
    "images": [
      {
        "url": "/products/sheep-lamb-cake.jpg",
        "alt": "Sheep / Lamb 3D Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "2 Pounds",
        "amountPKR": 2240
      },
      {
        "label": "2.5 Pounds (Special)",
        "amountPKR": 2800
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4480
      },
      {
        "label": "5 Pounds",
        "amountPKR": 5600
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Vanilla Bean",
      "Cookies & Cream",
      "Chocolate"
    ],
    "minNoticeDays": 2,
    "isActive": true,
    "sortOrder": 16
  },
  {
    "_id": "prod_17",
    "name": "Cute Teddy Bear Bento & Tier Cake",
    "slug": "cute-teddy-bear-cake",
    "category": "Custom Cake",
    "description": "Charming pastel themed cake featuring dual hand-piped teddy bear illustrations.",
    "images": [
      {
        "url": "/products/cute-teddy-bear-cake.jpg",
        "alt": "Cute Teddy Bear Bento & Tier Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "2 Pounds",
        "amountPKR": 2700
      },
      {
        "label": "3 Pounds",
        "amountPKR": 4050
      },
      {
        "label": "4 Pounds",
        "amountPKR": 5400
      },
      {
        "label": "5 Pounds",
        "amountPKR": 6750
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Caramel Cream",
      "Vanilla Shortcake",
      "Chocolate"
    ],
    "minNoticeDays": 2,
    "isActive": true,
    "sortOrder": 17
  },
  {
    "_id": "prod_18",
    "name": "Fluffy Bear Face 3D Cake",
    "slug": "fluffy-bear-face-cake",
    "category": "Custom Cake",
    "description": "Fully sculpted 3D bear head cake with grass-tip textured fur piping and chocolate ears.",
    "images": [
      {
        "url": "/products/fluffy-bear-face-cake.jpg",
        "alt": "Fluffy Bear Face 3D Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "2 Pounds",
        "amountPKR": 2500
      },
      {
        "label": "3 Pounds",
        "amountPKR": 3750
      },
      {
        "label": "4 Pounds",
        "amountPKR": 5000
      },
      {
        "label": "5 Pounds",
        "amountPKR": 6250
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Chocolate Truffle",
      "Nutella Cream",
      "Vanilla"
    ],
    "minNoticeDays": 2,
    "isActive": true,
    "sortOrder": 18
  },
  {
    "_id": "prod_19",
    "name": "Flork Meme Custom Cake",
    "slug": "flork-meme-cake",
    "category": "Custom Cake",
    "description": "Hilarious and personalized Flork meme cake with customized funny quotes and drawings.",
    "images": [
      {
        "url": "/products/flork-meme-cake.jpg",
        "alt": "Flork Meme Custom Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "2 Pounds",
        "amountPKR": 2200
      },
      {
        "label": "3 Pounds",
        "amountPKR": 3300
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4400
      },
      {
        "label": "5 Pounds",
        "amountPKR": 5500
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Chocolate Ganache",
      "Vanilla",
      "Red Velvet"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 19
  },
  {
    "_id": "prod_20",
    "name": "Sea Green / Teal Ombre Birthday Cake",
    "slug": "sea-green-birthday-cake",
    "category": "Standard Cream",
    "description": "Smooth white base with vibrant sea-green / teal shell border piping and custom birthday greeting.",
    "images": [
      {
        "url": "/products/sea-green-birthday-cake.jpg",
        "alt": "Sea Green / Teal Ombre Birthday Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "2 Pounds",
        "amountPKR": 2200
      },
      {
        "label": "3 Pounds",
        "amountPKR": 3300
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4400
      },
      {
        "label": "5 Pounds",
        "amountPKR": 5500
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Vanilla Fresh Cream",
      "Pineapple Swirl",
      "Chocolate"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 20
  },
  {
    "_id": "prod_21",
    "name": "Classic Black Forest Cake",
    "slug": "black-forest-cake",
    "category": "Standard Cream",
    "description": "Traditional chocolate sponge layered with whipped vanilla cream, dark chocolate shavings, and glazed red cherries.",
    "images": [
      {
        "url": "/products/black-forest-cake.jpg",
        "alt": "Classic Black Forest Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Pound",
        "amountPKR": 1100
      },
      {
        "label": "2 Pounds",
        "amountPKR": 2200
      },
      {
        "label": "3 Pounds",
        "amountPKR": 3300
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4400
      },
      {
        "label": "5 Pounds",
        "amountPKR": 5500
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Cherry Chocolate Cream",
      "Black Forest Deluxe"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 21
  },
  {
    "_id": "prod_22",
    "name": "Fresh Strawberry Wave Cake",
    "slug": "fresh-strawberry-cake",
    "category": "Standard Cream",
    "description": "Elegant textured wave piping around vanilla sponge crowned with fresh glazed strawberries.",
    "images": [
      {
        "url": "/products/fresh-strawberry-cake.jpg",
        "alt": "Fresh Strawberry Wave Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Pound",
        "amountPKR": 1100
      },
      {
        "label": "2 Pounds",
        "amountPKR": 2200
      },
      {
        "label": "3 Pounds",
        "amountPKR": 3300
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4400
      },
      {
        "label": "5 Pounds",
        "amountPKR": 5500
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Fresh Strawberry Puree",
      "Vanilla Cream"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 22
  },
  {
    "_id": "prod_23",
    "name": "Triple Chocolate Fudge Star Cake",
    "slug": "triple-chocolate-fudge-cake",
    "category": "Fudge / Premium",
    "description": "Intense triple fudge chocolate cake with star-piped dark chocolate rosettes and crunchy hazelnut praline.",
    "images": [
      {
        "url": "/products/triple-chocolate-fudge-cake.jpg",
        "alt": "Triple Chocolate Fudge Star Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Pound",
        "amountPKR": 1100
      },
      {
        "label": "2 Pounds",
        "amountPKR": 2100
      },
      {
        "label": "3 Pounds",
        "amountPKR": 3100
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4100
      },
      {
        "label": "5 Pounds",
        "amountPKR": 5100
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Belgian Triple Chocolate",
      "Dark Truffle Fudge"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 23
  },
  {
    "_id": "prod_24",
    "name": "Blue Painted Floral Birthday Cake",
    "slug": "blue-floral-birthday-cake",
    "category": "Cream Cake",
    "description": "Artistic palette-knife blue floral strokes with gold leaf accents on pristine white buttercream.",
    "images": [
      {
        "url": "/products/blue-painted-floral.jpg",
        "alt": "Blue Painted Floral Birthday Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Pound",
        "amountPKR": 1000
      },
      {
        "label": "2 Pounds",
        "amountPKR": 2000
      },
      {
        "label": "3 Pounds",
        "amountPKR": 3000
      },
      {
        "label": "4 Pounds",
        "amountPKR": 4000
      },
      {
        "label": "5 Pounds",
        "amountPKR": 5000
      }
    ],
    "priceMode": "from",
    "flavors": [
      "French Buttercream",
      "Vanilla Bean",
      "White Chocolate"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 24
  },
  {
    "_id": "prod_25",
    "name": "Ferrero Rocher Deluxe Cake",
    "slug": "ferrero-rocher-cake",
    "category": "Premium Cake",
    "description": "Decadent chocolate hazelnut cake topped with whole Ferrero Rocher chocolates, chocolate drip, and toasted nuts.",
    "images": [
      {
        "url": "/products/ferrero-rocher-cake.jpg",
        "alt": "Ferrero Rocher Deluxe Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "2 Pounds",
        "amountPKR": 1900
      },
      {
        "label": "3 Pounds",
        "amountPKR": 2850
      },
      {
        "label": "4 Pounds",
        "amountPKR": 3800
      },
      {
        "label": "5 Pounds",
        "amountPKR": 4750
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Nutella Hazelnut",
      "Chocolate Praline"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 25
  },
  {
    "_id": "prod_26",
    "name": "Mango Glaze Golden Sponge Cake",
    "slug": "mango-glaze-cake",
    "category": "Cream Cake",
    "description": "Moist golden sponge layered with tropical mango fruit compote and a mirror glaze top.",
    "images": [
      {
        "url": "/products/mango-glaze-cake.jpg",
        "alt": "Mango Glaze Golden Sponge Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "2 Pounds",
        "amountPKR": 1800
      },
      {
        "label": "3 Pounds",
        "amountPKR": 2700
      },
      {
        "label": "4 Pounds",
        "amountPKR": 3600
      },
      {
        "label": "5 Pounds",
        "amountPKR": 4500
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Pure Mango Glaze",
      "Mango Vanilla Swirl"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 26
  },
  {
    "_id": "prod_27",
    "name": "Classic Chocolate Drip Cake (HBD Special)",
    "slug": "chocolate-drip-cake-classic",
    "category": "Drip Cake",
    "description": "Vanilla cream cake with dark chocolate drip, decorative top rosettes, and customized lettering.",
    "images": [
      {
        "url": "/products/chocolate-drip-cake-classic.jpg",
        "alt": "Classic Chocolate Drip Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Pound",
        "amountPKR": 1000
      },
      {
        "label": "2 Pounds",
        "amountPKR": 1800
      },
      {
        "label": "3 Pounds",
        "amountPKR": 2700
      },
      {
        "label": "4 Pounds",
        "amountPKR": 3600
      },
      {
        "label": "5 Pounds",
        "amountPKR": 4500
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Chocolate Drip Vanilla",
      "Double Chocolate"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 27
  },
  {
    "_id": "prod_28",
    "name": "Chocolate Sprinkles Celebration Cake",
    "slug": "chocolate-sprinkles-cake",
    "category": "Standard Cream",
    "description": "Rich chocolate buttercream swirl cake adorned with colorful festive party sprinkles.",
    "images": [
      {
        "url": "/products/chocolate-sprinkles-cake.jpg",
        "alt": "Chocolate Sprinkles Celebration Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Pound",
        "amountPKR": 1000
      },
      {
        "label": "2 Pounds",
        "amountPKR": 1700
      },
      {
        "label": "3 Pounds",
        "amountPKR": 2550
      },
      {
        "label": "4 Pounds",
        "amountPKR": 3400
      },
      {
        "label": "5 Pounds",
        "amountPKR": 4250
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Chocolate Fudge",
      "Chocolate Confetti"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 28
  },
  {
    "_id": "prod_29",
    "name": "Caramel Crunch Toffee Cake",
    "slug": "caramel-crunch-cake",
    "category": "Crunch Cake",
    "description": "Gourmet salted caramel drip cake crowned with buttercream swirls and crunchy honeycomb toffee crumble.",
    "images": [
      {
        "url": "/products/caramel-crunch-cake.jpg",
        "alt": "Caramel Crunch Toffee Cake"
      }
    ],
    "priceOptions": [
      {
        "label": "1 Pound",
        "amountPKR": 1200
      },
      {
        "label": "2 Pounds",
        "amountPKR": 1600
      },
      {
        "label": "3 Pounds",
        "amountPKR": 2400
      },
      {
        "label": "4 Pounds",
        "amountPKR": 3200
      },
      {
        "label": "5 Pounds",
        "amountPKR": 4000
      }
    ],
    "priceMode": "from",
    "flavors": [
      "Salted Caramel Toffee",
      "Caramel Buttercream"
    ],
    "minNoticeDays": 1,
    "isActive": true,
    "sortOrder": 29
  }
];

const defaultSettings: ISettings = {
  businessHours: '10:00 AM – 10:00 PM (Monday to Sunday)',
  deliveryNote: 'Delivery available exclusively within Dera Ismail Khan city limits. Delivery fee is quoted by distance upon order confirmation.',
  paymentAccounts: [
    {
      method: 'Easypaisa',
      number: '03169403356',
      title: 'Sweet Pearl Bakes (Easypaisa)',
      instructions: 'Please send 100% advance amount to Easypaisa number 0316-9403356 and upload screenshot proof.'
    },
    {
      method: 'JazzCash',
      number: '03306363356',
      title: 'Sweet Pearl Bakes (JazzCash)',
      instructions: 'Please send 100% advance amount to JazzCash number 0330-6363356 and upload screenshot proof.'
    }
  ],
  announcementText: '✨ Simple cakes require 1 day notice • Custom cakes require 2-3 days notice ✨',
  whatsappNumber: '923306363356',
  minNoticeDaysSimple: 1,
  minNoticeDaysCustom: 2
};

class LocalStore {
  private data: DatabaseData;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseData {
    if (fs.existsSync(DATA_FILE)) {
      try {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(content);
      } catch (err) {
        console.error('Error reading db.json, initializing fresh store', err);
      }
    }

    const defaultAdminHash = bcrypt.hashSync('sweetpearl123', 10);

    const initialData: DatabaseData = {
      products: defaultProducts,
      orders: [
        {
          _id: 'ord_demo1',
          orderNumber: 'SPB-1001',
          customer: {
            name: 'Ayesha Khan',
            phone: '03301234567',
            email: 'ayesha@example.com'
          },
          deliveryAddress: 'House 42, Street 7, University Road, Dera Ismail Khan',
          items: [
            {
              productName: 'Classic Chocolate Ganache Cake',
              flavor: 'Chocolate Ganache',
              sizeLabel: '2 lbs (Serves 8-12)',
              quantity: 1,
              unitPricePKR: 3400
            }
          ],
          deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          instructions: 'Please write "Happy 21st Birthday Ayesha!" in gold lettering.',
          totalPKR: 3400,
          payment: {
            method: 'Easypaisa',
            proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
            status: 'Verified',
            verifiedAt: new Date()
          },
          status: 'Preparing',
          statusHistory: [
            { status: 'Received', at: new Date(Date.now() - 3600000 * 4), by: 'System' },
            { status: 'Payment Verified', at: new Date(Date.now() - 3600000 * 3), by: 'Admin' },
            { status: 'Preparing', at: new Date(Date.now() - 3600000 * 1), by: 'Admin', note: 'Baking sponge layers in progress.' }
          ],
          source: 'web',
          createdAt: new Date(Date.now() - 3600000 * 4),
          updatedAt: new Date(Date.now() - 3600000 * 1)
        }
      ],
      messages: [
        {
          _id: 'msg_1',
          name: 'Fatima Tariq',
          email: 'fatima@example.com',
          phone: '03159876543',
          message: 'Can you bake a 3-tier engagement cake for 25th of this month in DI Khan?',
          status: 'New',
          createdAt: new Date()
        }
      ],
      subscribers: [
        {
          _id: 'sub_1',
          email: 'sweetbakesfan@example.com',
          subscribedAt: new Date(),
          unsubscribed: false
        }
      ],
      settings: defaultSettings,
      orderCounter: 1002,
      adminUsers: [
        {
          _id: 'usr_admin',
          email: 'admin@sweetpearlbakes.com',
          passwordHash: defaultAdminHash,
          role: 'owner',
          name: 'Sweet Pearl Owner'
        }
      ],
      auditLogs: []
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseData) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing db.json:', err);
    }
  }

  public getData(): DatabaseData {
    return this.data;
  }

  public save() {
    this.saveData(this.data);
  }

  public getNextOrderNumber(): string {
    const nextSeq = this.data.orderCounter++;
    this.save();
    return `SPB-${nextSeq}`;
  }
}

export const localStore = new LocalStore();
